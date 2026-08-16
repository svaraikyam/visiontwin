import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect } from "react";

interface EngineSetupProps {
    backgroundColor: string;
}

export default function EngineSetup({
    backgroundColor,
}: EngineSetupProps) {

    const { scene, gl, camera } = useThree();

    useEffect(() => {

        // THREE.Scene
        scene.background = new THREE.Color(backgroundColor);

        // WebGLRenderer
        gl.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        gl.outputColorSpace = THREE.SRGBColorSpace;

        gl.toneMapping = THREE.ACESFilmicToneMapping;

        gl.toneMappingExposure = 1.0;

        // PerspectiveCamera
        if (camera instanceof THREE.PerspectiveCamera) {

            camera.near = 0.1;
            camera.far = 5000;

            camera.updateProjectionMatrix();
        }

    }, [
        scene,
        gl,
        camera,
        backgroundColor,
    ]);

    return null;
}