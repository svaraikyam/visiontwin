import { CameraObject } from "../../../models/CameraObject";

interface Props {
    object: CameraObject;
}

export default function CameraRenderer({ object }: Props) {
    return (
        <mesh
            position={object.position}
            rotation={object.rotation}
        >
            <coneGeometry args={[0.3, 0.8, 16]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
}