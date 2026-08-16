
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
    Grid,
    OrbitControls,
} from "@react-three/drei";

import { useEffect } from "react";

import { useSceneStore } from "../../store/sceneStore";
import { ModelObject } from "../../models/ModelObject";

import ObjectRenderer from "./Renderers/ObjectRenderer";

import EngineSetup from "./Engine/EngineSetup";
import NavigationGizmo from "./Engine/NavigationGizmo";

function FloorMesh() {

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
        >
            <planeGeometry
                args={[1000, 1000]}
            />

            <meshStandardMaterial
                color="#555555"
            />
        </mesh>
    );
}

export default function SceneCanvas() {

    const objects = useSceneStore(
        (state) => state.objects
    );

    const addObject = useSceneStore(
        (state) => state.addObject
    );

    useEffect(() => {

        if (objects.length > 0) {
            return;
        }

        const cube = new ModelObject(
            "Test Cube",
            ""
        );

        cube.position.set(
            0,
            0.5,
            0
        );

        addObject(cube);

    }, [objects, addObject]);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >

            <Canvas
                shadows

                camera={{
                    position: [10, 8, 10],
                    fov: 50,
                    near: 0.1,
                    far: 5000,
                }}

                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true,
                }}

                onCreated={({ gl }) => {

                    gl.outputColorSpace =
                        THREE.SRGBColorSpace;

                }}
            >

                <EngineSetup
                    backgroundColor="#20242a"
                />

                <ambientLight
                    intensity={1.5}
                />

                <directionalLight
                    position={[
                        20,
                        30,
                        10,
                    ]}
                    intensity={2.5}
                    castShadow
                />

                <Grid
                    args={[1000, 1000]}
                    cellSize={1}
                    sectionSize={10}
                    position={[
                        0,
                        0.01,
                        0,
                    ]}
                    fadeDistance={500}
                    fadeStrength={1}
                />

                <FloorMesh />

                {objects.map((object) => (

                    <ObjectRenderer
                        key={object.id}
                        object={object}
                    />

                ))}

                <axesHelper
                    args={[5]}
                />

                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.08}
                />

                <NavigationGizmo />

            </Canvas>

        </div>
    );
}