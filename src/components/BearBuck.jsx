import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const BearBuck = ({ position, onCollect, isCollected }) => {
    const ref = useRef();
    const [hovered, setHover] = useState(false);

    // Simple bobbing and rotating animation
    useFrame((state, delta) => {
        if (!ref.current || isCollected) return;

        ref.current.rotation.x += delta * 2;
        ref.current.rotation.y += delta * 2;
    });

    if (isCollected) return null;

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={2} floatIntensity={1}>
                <group ref={ref}>
                    {/* Tennis Ball Geometry */}
                    <mesh
                        onPointerOver={() => setHover(true)}
                        onPointerOut={() => setHover(false)}
                        onClick={onCollect} // Fallback click interaction
                    >
                        <sphereGeometry args={[0.4, 32, 32]} />
                        <meshStandardMaterial
                            color="#ccff00" // Tennis Ball Green/Yellow
                            metalness={0.0}
                            roughness={0.9} // fuzzy
                            emissive="#ccff00"
                            emissiveIntensity={hovered ? 0.3 : 0.1}
                        />
                    </mesh>

                    {/* Simple visualization of a seam using a white line curve? 
                        Without a custom texture, a simple white Torus ring creates a generic 'sport ball' look.
                    */}
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.39, 0.02, 16, 32]} />
                        <meshStandardMaterial color="white" />
                    </mesh>
                </group>
            </Float>
            {/* Glow Effect */}
            <pointLight distance={3} intensity={0.5} color="#ccff00" />
        </group>
    );
};

export default BearBuck;
