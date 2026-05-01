// Description: A React component that handles WebGL context loss and restoration events in a Three.js scene using react-three-fiber.

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

const HandleContextLoss = () => {
    const { gl } = useThree();

    useEffect(() => {
        const handleContextLost = (e: any) => {
            e.preventDefault();
            // console.warn("WebGL context lost");
        };

        const handleContextRestored = () => {
            // console.info("WebGL context restored");
        };

        gl.domElement.addEventListener("webglcontextlost", handleContextLost);
        gl.domElement.addEventListener(
            "webglcontextrestored",
            handleContextRestored
        );

        return () => {
            gl.domElement.removeEventListener(
                "webglcontextlost",
                handleContextLost
            );
            gl.domElement.removeEventListener(
                "webglcontextrestored",
                handleContextRestored
            );
        };
    }, [gl]);

    return null;
};

export default HandleContextLoss;
