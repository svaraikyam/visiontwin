import {
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";

export default function NavigationGizmo() {

    return (
        <GizmoHelper
            alignment="bottom-right"
            margin={[70, 70]}
        >
            <GizmoViewport
                axisColors={[
                    "#ff0000",
                    "#00ff00",
                    "#0000ff",
                ]}
                labelColor="white"
            />
        </GizmoHelper>
    );
}