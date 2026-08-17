import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

interface Props {
    url: string;
}

function GltfComponent({ url }: Props) {
    const gltf = useGLTF(url);

    const modelScene = useMemo(() => {
        const clone = gltf.scene.clone(true);
        clone.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // PRESERVE IMPORTED NORMALS:
                // Only compute vertex normals if the GLB file is missing normal attributes
                if (mesh.geometry) {
                    if (!mesh.geometry.attributes.normal) {
                        console.log(`[VisionTwin GLB] Missing normals in model: ${url}. Generating fallback normals.`);
                        mesh.geometry.computeVertexNormals();
                    }
                    mesh.geometry.computeBoundingBox();
                    mesh.geometry.computeBoundingSphere();
                }

                if (mesh.material) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    mat.side = THREE.DoubleSide; // Double-sided rendering fallback for thin geometries
                }
            }
        });

        // 1. Initial 3D bounding box of raw imported GLB
        let box = new THREE.Box3().setFromObject(clone);
        const size = new THREE.Vector3();
        box.getSize(size);

        // 2. AUTO-LIMIT OVERSIZED MODELS:
        // If model max dimension exceeds 25 meters/units, auto-scale down so it fits in the viewport
        const maxDim = Math.max(size.x, size.y, size.z);
        const TARGET_MAX_VIEWPORT_SIZE = 25.0; // Max 25 meters
        if (maxDim > TARGET_MAX_VIEWPORT_SIZE) {
            const scaleFactor = TARGET_MAX_VIEWPORT_SIZE / maxDim;
            console.log(`[VisionTwin GLB] Oversized model detected (${maxDim.toFixed(1)}m). Auto-limiting scale by factor ${scaleFactor.toFixed(3)} to fit viewport.`);
            clone.scale.multiplyScalar(scaleFactor);
            clone.updateMatrixWorld(true);
            box.setFromObject(clone);
            box.getSize(size);
        }

        // Auto-detect Z-up export (common in Photogrammetry Aerial Scans / CAD / Drone GIS):
        // If vertical height Y is significantly larger than depth Z (flat plane standing vertically upright),
        // rotate -90 degrees around X-axis so the aerial scan lies 100% horizontally flat on the X-Z floor grid.
        if (size.y > size.z * 1.5) {
            console.log(`[VisionTwin GLB] Auto-detected Z-up scan for: ${url}. Rotating -90° X to align flat with ground plane.`);
            clone.rotation.x = -Math.PI / 2;
            clone.updateMatrixWorld(true);
            box.setFromObject(clone);
            box.getSize(size);
        }

        const center = new THREE.Vector3();
        box.getCenter(center);

        // 3. Auto-center footprint on X, Z axes and ground bottom base at Y = 0 (floor grid level)
        clone.position.x -= center.x;
        clone.position.z -= center.z;
        clone.position.y -= box.min.y; // Lowest point sits flat on ground grid Y=0

        const containerGroup = new THREE.Group();
        containerGroup.add(clone);

        return containerGroup;
    }, [gltf, url]);

    return <primitive object={modelScene} />;
}

export default function GLBModel({ url }: Props) {
    if (!url) {
        return (
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#ff9800" roughness={0.4} />
            </mesh>
        );
    }

    return (
        <Suspense
            fallback={
                <mesh>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial color="#29b6f6" wireframe />
                </mesh>
            }
        >
            <GltfComponent url={url} />
        </Suspense>
    );
}

