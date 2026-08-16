import { ModelObject } from "../../../models/ModelObject";

interface Props {
    object: ModelObject;
}

export default function ModelRenderer({ object }: Props) {
    return (
        <mesh
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}