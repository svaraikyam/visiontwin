import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

interface Props {
    url: string;
}

// Persistent cache for cloned GLB scenes to avoid CPU re-cloning freezes
const sceneCache = new Map<string, THREE.Group>();

function GltfComponent({ url }: Props) {
    const gltf = useGLTF(url);

    const modelScene = useMemo(() => {
        if (sceneCache.has(url)) {
            return sceneCache.get(url)!;
        }

        const clone = gltf.scene.clone(true);
        clone.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        sceneCache.set(url, clone);
        return clone;
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

