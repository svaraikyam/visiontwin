import { ModelObject } from "../../../models/ModelObject";
import { useSceneStore } from "../../../store/sceneStore";
import GLBModel from "./GLBModel";

interface Props {
    object: ModelObject;
}

export default function ModelRenderer({ object }: Props) {
    return (
        <group
            onClick={(e) => {
                e.stopPropagation();
                if (!object.selected) {
                    useSceneStore.getState().selectObject(object.id);
                }
            }}
        >
            {object.modelPath ? (
                <GLBModel url={object.modelPath} />
            ) : (
                <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial
                        color={object.selected ? "#ff9800" : "#e65100"}
                        roughness={0.4}
                        metalness={0.2}
                    />
                </mesh>
            )}
        </group>
    );
}