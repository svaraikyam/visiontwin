import { GizmoHelper, GizmoViewport } from "@react-three/drei";

export default function NavigationGizmo() {
    return (
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport
                axisColors={["#f44336", "#4caf50", "#2196f3"]}
                labelColor="white"
            />
        </GizmoHelper>
    );
}