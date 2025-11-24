import { STLExporter } from "three/examples/jsm/Addons.js";
import getExportableMesh from "./getExportableMesh";
import * as THREE from "three";


function exportAsSTL(mesh: THREE.Mesh, originalName?: string) {
    const exporter = new STLExporter();
    const bakedMesh = getExportableMesh(mesh);

    const stlString = exporter.parse(bakedMesh);
    const blob = new Blob([stlString], { type: "text/plain" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const base = originalName || "exported_model";
    const filename = base.toLowerCase().endsWith(".stl") ? base : `${base}.stl`;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
}