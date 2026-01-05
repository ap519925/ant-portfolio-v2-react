import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TennisBall = ({ position, velocity, playerRef, onPickup }) => {
    const meshRef = useRef();

    // Physics State
    const pos = useRef(new THREE.Vector3(position[0], position[1], position[2]));
    const vel = useRef(new THREE.Vector3(velocity[0], velocity[1], velocity[2]));
    const isPickedUp = useRef(false);

    useFrame((state, delta) => {
        if (isPickedUp.current || !meshRef.current) return;

        // Gravity
        vel.current.y -= 30 * delta;

        // Air Drag
        vel.current.x -= vel.current.x * 0.5 * delta;
        vel.current.z -= vel.current.z * 0.5 * delta;

        // Move
        pos.current.x += vel.current.x * delta;
        pos.current.y += vel.current.y * delta;
        pos.current.z += vel.current.z * delta;

        // Floor Bounce (Radius ~0.2)
        if (pos.current.y < 0.2) {
            pos.current.y = 0.2;

            // Bounce
            if (Math.abs(vel.current.y) > 1) {
                vel.current.y *= -0.7;
            } else {
                vel.current.y = 0;
            }

            // Floor Friction
            vel.current.x *= 0.95;
            vel.current.z *= 0.95;
        }

        // Apply to Mesh
        meshRef.current.position.copy(pos.current);

        // Rolling Visuals based on velocity
        meshRef.current.rotation.x += vel.current.z * delta;
        meshRef.current.rotation.z -= vel.current.x * delta;

        // Pickup Logic
        if (playerRef.current) {
            // Logic handled in GameLogic usually to prevent per-frame props issues, 
            // but we can compute distance here for simplicity.
            // playerRef.current is the API object from Player.jsx ({ position: Vector3 })
            if (playerRef.current.position) {
                const dist = pos.current.distanceTo(playerRef.current.position);
                if (dist < 1.5) {
                    isPickedUp.current = true;
                    if (onPickup) onPickup();
                }
            }
        }
    });

    return (
        <group ref={meshRef} position={position}>
            {/* Ball Body */}
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial
                    color="#DFFF00"
                    roughness={0.9}
                    metalness={0.0}
                />
            </mesh>
            {/* White Seam Approximation (Crucial for look) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.2, 0.01, 16, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.2, 0.01, 16, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
    );
};

export default TennisBall;
