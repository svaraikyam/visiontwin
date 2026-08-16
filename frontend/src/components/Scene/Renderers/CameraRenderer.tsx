import { CameraObject } from "../../../models/CameraObject";
import CameraFrustum from "../../Camera/CameraFrustum";
import { useSceneStore } from "../../../store/sceneStore";
import { useEditorStore } from "../../../store/editorStore";

interface Props {
    object: CameraObject;
}

export default function CameraRenderer({ object }: Props) {
    const showCameraFrustum = useEditorStore((state) => state.showCameraFrustum);

    return (
        <group
            onClick={(e) => {
                e.stopPropagation();
                useSceneStore.getState().selectObject(object.id);
            }}
        >
            {/* Main CCTV Housing Body (Bullet Style) */}
            <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.22, 0.6, 16]} />
                <meshStandardMaterial color="#37474f" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Lens Hood */}
            <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.27, 0.27, 0.1, 16]} />
                <meshStandardMaterial color="#1c313a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Front Lens Glass */}
            <mesh position={[0, 0, -0.17]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.23, 0.23, 0.02, 16]} />
                <meshStandardMaterial color="#00e5ff" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
            </mesh>

            {/* Mounting Bracket Base */}
            <mesh position={[0, 0.3, 0.3]}>
                <boxGeometry args={[0.12, 0.4, 0.12]} />
                <meshStandardMaterial color="#263238" metalness={0.5} roughness={0.4} />
            </mesh>

            {/* Status Indicator LED */}
            <mesh position={[0, 0.2, 0.4]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#00ff66" />
            </mesh>

            {/* Optical Camera Frustum Visualizer (Togglable) */}
            {showCameraFrustum && <CameraFrustum object={object} />}
        </group>
    );
}