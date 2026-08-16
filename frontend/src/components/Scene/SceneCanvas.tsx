
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { useState } from "react";

import { useSceneStore } from "../../store/sceneStore";
import { useEditorStore } from "../../store/editorStore";

import ObjectRenderer from "./Renderers/ObjectRenderer";
import EngineSetup from "./Engine/EngineSetup";
import NavigationGizmo from "./Engine/NavigationGizmo";
import ViewportControls from "./Engine/ViewportControls";
import ObjectToolbar from "../ObjectToolbar/ObjectToolbar";

function FloorMesh() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            onClick={(e) => {
                // Click canvas floor to clear selection
                e.stopPropagation();
                useSceneStore.getState().selectObject(null);
            }}
        >
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#33373d" roughness={0.8} />
        </mesh>
    );
}

export default function SceneCanvas() {
    const objects = useSceneStore((state) => state.objects);
    const showGrid = useEditorStore((state) => state.showGrid);
    const showAxes = useEditorStore((state) => state.showAxes);
    const [orbitEnabled, setOrbitEnabled] = useState(true);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >
            <Canvas
                shadows={false}
                camera={{
                    position: [15, 15, 15],
                    fov: 50,
                    near: 0.1,
                    far: 10000,
                }}
                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                    precision: "highp",
                    preserveDrawingBuffer: true,
                }}
                onCreated={({ gl }) => {
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                }}
                onPointerMissed={() => {
                    useSceneStore.getState().selectObject(null);
                }}
            >
                <EngineSetup backgroundColor="#20242a" />

                <ambientLight intensity={1.5} />

                <directionalLight
                    position={[20, 30, 10]}
                    intensity={2.5}
                    castShadow
                />

                {showGrid && (
                    <Grid
                        args={[1000, 1000]}
                        cellSize={1}
                        sectionSize={10}
                        position={[0, 0.01, 0]}
                        fadeDistance={500}
                        fadeStrength={1}
                        cellColor="#444a54"
                        sectionColor="#646c7a"
                    />
                )}

                <FloorMesh />

                {objects.map((object) => (
                    <ObjectRenderer
                        key={object.id}
                        object={object}
                        onTransformDragging={(dragging) => setOrbitEnabled(!dragging)}
                    />
                ))}

                {showAxes && <axesHelper args={[5]} />}

                <ViewportControls enabled={orbitEnabled} />

                <NavigationGizmo />
            </Canvas>

            {/* Bottom Floating Viewport Toolbar */}
            <ObjectToolbar />
        </div>
    );
}