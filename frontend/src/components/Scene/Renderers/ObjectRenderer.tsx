import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { TransformControls } from "@react-three/drei";
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
    onTransformDragging?: (dragging: boolean) => void;
}

export default function ObjectRenderer({ object, onTransformDragging }: Props) {
    const [targetGroup, setTargetGroup] = useState<THREE.Group | null>(null);
    const controlsRef = useRef<any>(null);
    const transformMode = useEditorStore((state) => state.transformMode);

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls || !targetGroup) return;

        const handleDragging = (e: any) => {
            const isDragging = Boolean(e.value);
            if (onTransformDragging) {
                onTransformDragging(isDragging);
            }
            if (!isDragging) {
                useSceneStore.getState().updateObject(object.id, (obj) => {
                    obj.position.copy(targetGroup.position);
                    obj.rotation.copy(targetGroup.rotation);
                    obj.scale.copy(targetGroup.scale);
                });
            }
        };

        controls.addEventListener("dragging-changed", handleDragging);

        return () => {
            controls.removeEventListener("dragging-changed", handleDragging);
        };
    }, [object.id, onTransformDragging, targetGroup]);

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
                    ref={controlsRef}
                    object={targetGroup}
                    mode={transformMode}
                    makeDefault
                />
            )}
        </>
    );
}