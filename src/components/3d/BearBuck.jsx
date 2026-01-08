import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

const BearBuck = ({ position, onCollect, isCollected }) => {
    const ref = useRef();
    const [hovered, setHover] = useState(false);

    // Simple bobbing and rotating animation
    useFrame((state, delta) => {
        if (!ref.current || isCollected) return;

        ref.current.rotation.y += delta * 2;
    });

    if (isCollected) return null;

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0} floatIntensity={1}>
                <group ref={ref}>
                    {/* Coin Geometry */}
                    <mesh
                        rotation={[Math.PI / 2, 0, 0]}
                        onPointerOver={() => setHover(true)}
                        onPointerOut={() => setHover(false)}
                        onClick={onCollect} // Fallback click interaction
                    >
                        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
                        <meshStandardMaterial
                            color="#ffd700"
                            metalness={0.8}
                            roughness={0.2}
                            emissive="#ffd700"
                            emissiveIntensity={hovered ? 0.4 : 0.1}
                        />
                    </mesh>

                    {/* DOG FACE Placeholder */}
                    <Text
                        position={[0, 0, 0.06]}
                        fontSize={0.5}
                        color="#8B4513"
                        anchorX="center"
                        anchorY="middle"
                    >
                        🐶
                    </Text>
                    <Text
                        position={[0, 0, -0.06]}
                        rotation={[0, Math.PI, 0]}
                        fontSize={0.5}
                        color="#8B4513"
                        anchorX="center"
                        anchorY="middle"
                    >
                        🐶
                    </Text>
                </group>
            </Float>
            {/* Glow Effect */}
            <pointLight distance={3} intensity={0.5} color="#ffd700" />
        </group>
    );
};

export default BearBuck;
