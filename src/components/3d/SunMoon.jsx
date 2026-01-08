import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const SunMoon = ({ time, radius = 60 }) => {
    const groupRef = useRef();
    const sunRef = useRef();
    const moonRef = useRef();

    useFrame(() => {
        // Rotate the entire celestial system based on time (0 to 1)
        // 0 = Dawn, 0.25 = Noon, 0.5 = Dusk, 0.75 = Midnight
        if (groupRef.current) {
            const angle = (time - 0.25) * Math.PI * 2; // Offset so 0.25 (Noon) is at top (-PI/2)
            groupRef.current.rotation.z = angle;
        }

        // Self-rotation for fun
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.005;
        }
        if (moonRef.current) {
            moonRef.current.rotation.y += 0.002;
            moonRef.current.rotation.z = Math.sin(time * 10) * 0.1; // Wobbly moon
        }
    });

    return (
        <group ref={groupRef} rotation={[0, 0, 0]}>
            {/* SUN - Positioned at Top relative to rotation */}
            <group ref={sunRef} position={[0, radius, 0]}>
                <pointLight intensity={1.5} distance={200} decay={2} color="#ffaa00" />
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <mesh>
                        <sphereGeometry args={[8, 32, 32]} />
                        <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={0.5} fog={false} />
                    </mesh>
                    {/* Happy Face */}
                    <group position={[0, 0, 7.5]} rotation={[0, 0, 0]}>
                        {/* Eyes */}
                        <mesh position={[-2, 1, 0]} rotation={[0.2, 0, 0]}>
                            <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
                            <meshStandardMaterial color="#333" fog={false} />
                        </mesh>
                        <mesh position={[2, 1, 0]} rotation={[0.2, 0, 0]}>
                            <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
                            <meshStandardMaterial color="#333" fog={false} />
                        </mesh>
                        {/* Smile */}
                        <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
                            <torusGeometry args={[2.5, 0.3, 8, 20, Math.PI]} />
                            <meshStandardMaterial color="#333" fog={false} />
                        </mesh>
                        {/* Cheeks */}
                        <mesh position={[-3.5, 0, -0.5]}>
                            <circleGeometry args={[0.8, 32]} />
                            <meshBasicMaterial color="#ff5555" opacity={0.6} transparent fog={false} />
                        </mesh>
                        <mesh position={[3.5, 0, -0.5]}>
                            <circleGeometry args={[0.8, 32]} />
                            <meshBasicMaterial color="#ff5555" opacity={0.6} transparent fog={false} />
                        </mesh>
                    </group>
                    {/* Rays */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <mesh key={i} rotation={[0, 0, (i / 12) * Math.PI * 2]} position={[0, 0, -1]}>
                            <boxGeometry args={[1, 22, 1]} />
                            <meshStandardMaterial color="#FDB813" transparent opacity={0.4} fog={false} />
                        </mesh>
                    ))}
                </Float>
            </group>

            {/* MOON - Positioned at Bottom */}
            <group ref={moonRef} position={[0, -radius, 0]}>
                <pointLight intensity={0.5} distance={150} decay={2} color="#aaaaff" />
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh>
                        <sphereGeometry args={[6, 32, 32]} />
                        <meshStandardMaterial color="#dddddd" roughness={0.8} fog={false} />
                    </mesh>
                    {/* Creepy Funny Face */}
                    <group position={[0, 0, 5.5]}>
                        {/* Big Crazy Eye */}
                        <mesh position={[-1.5, 1, 0]}>
                            <sphereGeometry args={[1.2, 32, 32]} />
                            <meshStandardMaterial color="white" fog={false} />
                        </mesh>
                        <mesh position={[-1.5, 1, 1]}>
                            <sphereGeometry args={[0.3, 32, 32]} />
                            <meshStandardMaterial color="black" fog={false} />
                        </mesh>

                        {/* Small Twitchy Eye */}
                        <mesh position={[2, 1.5, 0]}>
                            <sphereGeometry args={[0.6, 32, 32]} />
                            <meshStandardMaterial color="white" fog={false} />
                        </mesh>
                        <mesh position={[2, 1.5, 0.5]}>
                            <sphereGeometry args={[0.15, 32, 32]} />
                            <meshStandardMaterial color="red" fog={false} />
                        </mesh>

                        {/* Jagged Mouth */}
                        <mesh position={[0, -1.5, 0]}>
                            <torusGeometry args={[1.5, 0.2, 8, 3, Math.PI]} />
                            <meshStandardMaterial color="#330000" fog={false} />
                        </mesh>
                        {/* Tooth */}
                        <mesh position={[0.5, -1.8, 0.5]} rotation={[0, 0, -0.2]}>
                            <boxGeometry args={[0.4, 0.6, 0.1]} />
                            <meshStandardMaterial color="white" fog={false} />
                        </mesh>
                    </group>

                    {/* Craters - Keep default material as they are on the moon surface */}
                    <mesh position={[3, 3, 2]} rotation={[0.5, 0, 0]}>
                        <torusGeometry args={[1, 0.1, 16, 32]} />
                        <meshStandardMaterial color="#999" fog={false} />
                    </mesh>
                    <mesh position={[-2, -2, 3]} rotation={[-0.2, 0.5, 0]}>
                        <torusGeometry args={[1.5, 0.2, 16, 32]} />
                        <meshStandardMaterial color="#999" fog={false} />
                    </mesh>
                </Float>
            </group>
        </group>
    );
};

export default SunMoon;
