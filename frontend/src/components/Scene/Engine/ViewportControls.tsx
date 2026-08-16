import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ViewportControlsProps {
    enabled?: boolean;
}

export default function ViewportControls({ enabled = true }: ViewportControlsProps) {
    const { camera, gl } = useThree();
    const orbitRef = useRef<any>(null);

    const isRmbDownRef = useRef(false);
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const moveSpeedRef = useRef(15); // speed units per second

    const eulerRef = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
    const mousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const domElement = gl.domElement;

        const onMouseDown = (e: MouseEvent) => {
            if (e.button === 2) {
                // Right Mouse Button -> Enable Unity/Unreal Fly Mode
                isRmbDownRef.current = true;
                mousePosRef.current = { x: e.clientX, y: e.clientY };
                if (orbitRef.current) {
                    orbitRef.current.enabled = false;
                }
                eulerRef.current.setFromQuaternion(camera.quaternion, "YXZ");
            }
        };

        const onMouseUp = (e: MouseEvent) => {
            if (e.button === 2) {
                isRmbDownRef.current = false;
                if (orbitRef.current && enabled) {
                    orbitRef.current.enabled = true;
                }
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isRmbDownRef.current) return;

            const movementX = e.clientX - mousePosRef.current.x;
            const movementY = e.clientY - mousePosRef.current.y;
            mousePosRef.current = { x: e.clientX, y: e.clientY };

            const sensitivity = 0.003;
            eulerRef.current.y -= movementX * sensitivity;
            eulerRef.current.x -= movementY * sensitivity;

            // Clamp pitch to prevent camera flip (-89 to +89 degrees)
            const maxPitch = (89 * Math.PI) / 180;
            eulerRef.current.x = Math.max(-maxPitch, Math.min(maxPitch, eulerRef.current.x));

            camera.quaternion.setFromEuler(eulerRef.current);

            if (orbitRef.current) {
                const forward = new THREE.Vector3(0, 0, -5).applyQuaternion(camera.quaternion);
                orbitRef.current.target.copy(camera.position).add(forward);
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            keysPressed.current[e.code] = true;
        };

        const onKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.code] = false;
        };

        const onContextMenu = (e: MouseEvent) => {
            e.preventDefault(); // Suppress default right-click context menu in 3D viewport
        };

        domElement.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        domElement.addEventListener("contextmenu", onContextMenu);

        return () => {
            domElement.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            domElement.removeEventListener("contextmenu", onContextMenu);
        };
    }, [camera, gl, enabled]);

    // Continuous WASDQE fly movement frame loop
    useFrame((_, delta) => {
        if (!isRmbDownRef.current) return;

        const keys = keysPressed.current;
        const speedMultiplier = keys["ShiftLeft"] || keys["ShiftRight"] ? 2.5 : 1.0;
        const moveDistance = moveSpeedRef.current * speedMultiplier * delta;

        const moveVector = new THREE.Vector3();

        if (keys["KeyW"]) moveVector.z -= 1;
        if (keys["KeyS"]) moveVector.z += 1;
        if (keys["KeyA"]) moveVector.x -= 1;
        if (keys["KeyD"]) moveVector.x += 1;

        moveVector.normalize();
        moveVector.applyQuaternion(camera.quaternion);

        // Q = Down (-Y), E = Up (+Y)
        if (keys["KeyQ"]) moveVector.y -= 1;
        if (keys["KeyE"]) moveVector.y += 1;

        moveVector.multiplyScalar(moveDistance);
        camera.position.add(moveVector);

        if (orbitRef.current) {
            const forward = new THREE.Vector3(0, 0, -5).applyQuaternion(camera.quaternion);
            orbitRef.current.target.copy(camera.position).add(forward);
            orbitRef.current.update();
        }
    });

    return (
        <OrbitControls
            ref={orbitRef}
            makeDefault
            enabled={enabled}
            enableDamping
            dampingFactor={0.08}
        />
    );
}
