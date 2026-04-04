import { message, UploadFile } from "antd";
import * as THREE from "three";
import axios from "axios";
import { MutableRefObject } from "react";
import { faceMatches, matricesEqual, parseFaceData } from "./faceData";
import { MeshFace } from "../../../types/job";

export const runValidation = async (
    analysisRequestId: MutableRefObject<string | null>,
    file: UploadFile,
    setDetectedFaces: (faces: MeshFace[]) => void,
    setIsAnalyzing: (analyzing: boolean) => void,
    setFile?: (files: UploadFile[]) => void,
) => {
    // Deduplication
    if (analysisRequestId.current === file.uid) return;
    analysisRequestId.current = file.uid;

    try {
        const form = new FormData();
        form.append("file", file.originFileObj as File);

        const resp = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`,
            form,
            { headers: { "Content-Type": "multipart/form-data" } },
        );

        const faces = resp.data.faces;
        const detected = faces.map(parseFaceData);
        setDetectedFaces(detected);
        setFile && setFile([{...file, name: resp.data.fileName}]);

        setIsAnalyzing(false);
    } catch (err: any) {
        setDetectedFaces([]);

        let errorMsg = "Failed to analyze mesh.";
        if (err.response && err.response.data) {
            const { message: msg, details } = err.response.data;
            errorMsg = details ? `${msg}: ${details}` : msg;
        } else if (err.message) {
            errorMsg = `Request Error: ${err.message}`;
        }

        message.error(errorMsg);

        if (setFile) {
            setFile([]);
        } else {
            setIsAnalyzing(false);
        }
    }

};

export const exportAndReplace = async (
    mesh: THREE.Mesh | null,
    suppressedFace: {
        centroid: THREE.Vector3;
        normal: THREE.Vector3;
    } | null,
    file: UploadFile,
) => {
    if (!mesh) {
        message.error("No mesh loaded.");
        throw new Error("No mesh loaded");
    }

    // Case 1: No Face Selected / Manual Rotation
    // If the user rotated the model manually or didn't select a face,
    // suppressedFace will be null. In this pipeline, that means "keep original".
    if (!suppressedFace) {
        return { message: "Using original orientation" };
    }

    // Case 2: Face Selected
    // We instruct the backend to apply the rotation permanently.
    try {
        message.loading({
            content: "Aligning mesh on server...",
            key: "aligning",
        });

        const payload = {
            fileName: file.name,
            normal: {
                x: suppressedFace.normal.x,
                y: suppressedFace.normal.y,
                z: suppressedFace.normal.z,
            },
            centroid: {
                x: suppressedFace.centroid.x,
                y: suppressedFace.centroid.y,
                z: suppressedFace.centroid.z,
            },
        };

        const resp = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/jobs/place-on-face`,
            payload,
        );

        message.success({
            content: "Mesh aligned successfully!",
            key: "aligning",
        });
        return resp.data;
    } catch (err: any) {
        console.error("Error aligning mesh:", err);
        message.error({
            content: "Failed to align mesh on server",
            key: "aligning",
        });
        throw err;
    }
};
