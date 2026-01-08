import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const Collectible = ({ position, onCollect, id, collected, playerPosition }) => {
    const meshRef = useRef();
    const { camera } = useThree();

    useFrame((state) => {
        if (meshRef.current && !collected) {
            // Rotate the crystal slowly
            meshRef.current.rotation.y += 0.02;
            // Pulse the emissive intensity
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
            if (meshRef.current.material) {
                meshRef.current.material.emissiveIntensity = pulse;
            }

            // Proximity-based collection
            if (playerPosition) {
                const distance = Math.sqrt(
                    Math.pow(playerPosition[0] - position[0], 2) +
                    Math.pow(playerPosition[2] - position[2], 2)
                );
                // Collect if player is within 2 units
                if (distance < 2) {
                    onCollect(id);
                }
            }
        }
    });

    if (collected) return null;

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group position={position}>
                {/* Glow effect */}
                <pointLight color="#00ffff" intensity={2} distance={5} />

                {/* Crystal collectible */}
                <mesh ref={meshRef} onClick={() => onCollect(id)} castShadow>
                    <octahedronGeometry args={[0.5, 0]} />
                    <meshStandardMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={0.8}
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Inner glow */}
                <mesh scale={0.6}>
                    <octahedronGeometry args={[0.5, 0]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
                </mesh>
            </group>
        </Float>
    );
};

export default Collectible;
