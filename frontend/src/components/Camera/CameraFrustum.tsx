import { useMemo } from "react";
import * as THREE from "three";
import { CameraObject } from "../../models/CameraObject";

interface Props {
    object: CameraObject;
    color?: string;
}

export default function CameraFrustum({ object, color = "#00e5ff" }: Props) {
    const linesGeometry = useMemo(() => {
        const focalLength = object.focalLength || 4.0;
        const sensorWidth = object.sensorWidth || 6.4;
        const sensorHeight = object.sensorHeight || 3.6;

        const hFov =
            typeof object.horizontalFov === "number" && !isNaN(object.horizontalFov)
                ? object.horizontalFov
                : 2 * Math.atan(sensorWidth / (2 * focalLength));

        const vFov = 2 * Math.atan(sensorHeight / (2 * focalLength));

        const near = object.near || 0.5;
        const far = Math.min(object.far || 30, 40); // Cap visualization far distance for view clarity

        const hNear = near * Math.tan(vFov / 2);
        const wNear = near * Math.tan(hFov / 2);
        const hFar = far * Math.tan(vFov / 2);
        const wFar = far * Math.tan(hFov / 2);

        // Coordinates pointing along -Z
        const n1 = new THREE.Vector3(-wNear, hNear, -near);
        const n2 = new THREE.Vector3(wNear, hNear, -near);
        const n3 = new THREE.Vector3(wNear, -hNear, -near);
        const n4 = new THREE.Vector3(-wNear, -hNear, -near);

        const f1 = new THREE.Vector3(-wFar, hFar, -far);
        const f2 = new THREE.Vector3(wFar, hFar, -far);
        const f3 = new THREE.Vector3(wFar, -hFar, -far);
        const f4 = new THREE.Vector3(-wFar, -hFar, -far);

        const points: THREE.Vector3[] = [
            // Rays from origin to far plane
            new THREE.Vector3(0, 0, 0), f1,
            new THREE.Vector3(0, 0, 0), f2,
            new THREE.Vector3(0, 0, 0), f3,
            new THREE.Vector3(0, 0, 0), f4,

            // Far plane rectangle
            f1, f2,
            f2, f3,
            f3, f4,
            f4, f1,

            // Near plane rectangle
            n1, n2,
            n2, n3,
            n3, n4,
            n4, n1,
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }, [
        object.focalLength,
        object.sensorWidth,
        object.sensorHeight,
        object.near,
        object.far,
    ]);

    return (
        <lineSegments geometry={linesGeometry}>
            <lineBasicMaterial color={color} linewidth={1.5} opacity={0.8} transparent />
        </lineSegments>
    );
}
