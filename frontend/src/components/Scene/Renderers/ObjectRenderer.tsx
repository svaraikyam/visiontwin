import { useState } from "react";
import * as THREE from "three";
import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { SceneObject } from "../../../models/SceneObject";
import { ModelObject } from "../../../models/ModelObject";
import { CameraObject } from "../../../models/CameraObject";
import { ObjectType } from "../../../models/ObjectType";
import { useSceneStore } from "../../../store/sceneStore";
import { useEditorStore } from "../../../store/editorStore";
import ModelRenderer from "./ModelRenderer";
import CameraRenderer from "./CameraRenderer";

interface Props {
    object: SceneObject;
}

export default function ObjectRenderer({ object }: Props) {
    const [targetGroup, setTargetGroup] = useState<THREE.Group | null>(null);
    const transformMode = useEditorStore((state) => state.transformMode);
    const { controls } = useThree();

    let child = null;
    switch (object.type) {
        case ObjectType.MODEL:
            child = <ModelRenderer object={object as ModelObject} />;
            break;
        case ObjectType.CAMERA:
            child = <CameraRenderer object={object as CameraObject} />;
            break;
        default:
            break;
    }

    if (!child) return null;

    return (
        <>
            <group
                ref={setTargetGroup}
                position={[object.position.x, object.position.y, object.position.z]}
                rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
                scale={[object.scale.x, object.scale.y, object.scale.z]}
            >
                {child}
            </group>

            {object.selected && targetGroup && (
                <TransformControls
                    ref={(tc: any) => {
                        if (!tc) return;
                        // Avoid adding duplicate event listeners
                        if (tc.__listenersAttached) return;
                        tc.__listenersAttached = true;

                        tc.addEventListener("dragging-changed", (e: any) => {
                            const isDragging = Boolean(e.value);
                            console.log(`[VisionTwin 3D Diagnostic] Drag active: ${isDragging}`);

                            // Disable OrbitControls while dragging 3D object
                            if (controls) {
                                (controls as any).enabled = !isDragging;
                            }

                            // On drag end: update Zustand store so Object Inspector updates position numbers
                            if (!isDragging && targetGroup) {
                                console.log(
                                    `[VisionTwin 3D Diagnostic] Drag finished! Updated ${object.name} -> X: ${targetGroup.position.x.toFixed(2)}, Y: ${targetGroup.position.y.toFixed(2)}, Z: ${targetGroup.position.z.toFixed(2)}`
                                );
                                useSceneStore.getState().updateObject(object.id, {
                                    position: targetGroup.position.clone(),
                                    rotation: targetGroup.rotation.clone(),
                                    scale: targetGroup.scale.clone(),
                                });
                            }
                        });

                        tc.addEventListener("change", () => {
                            if (targetGroup && tc.dragging) {
                                console.log(
                                    `[VisionTwin 3D Diagnostic] Moving ${object.name} -> X: ${targetGroup.position.x.toFixed(2)}, Y: ${targetGroup.position.y.toFixed(2)}, Z: ${targetGroup.position.z.toFixed(2)}`
                                );
                            }
                        });
                    }}
                    object={targetGroup}
                    mode={transformMode}
                />
            )}
        </>
    );
}