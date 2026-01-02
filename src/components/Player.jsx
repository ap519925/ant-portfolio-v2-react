import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// --- CONSTANTS ---
const MOVE_SPEED = 10;
const JUMP_FORCE = 12;
const GRAVITY = 30;
const DRAG = 5;

// --- PROCEDURAL ROBOT COMPONENT ---
// A simple group of meshes to represent the player. No GLB loading = No Crashes.
const RobotPlayerModel = forwardRef((props, ref) => {
    const group = useRef();

    // Simple idle animation
    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();
        // Bobbing
        group.current.position.y = Math.sin(t * 2) * 0.05 - 0.5; // Offset to center
        // Arms swinging (if we added arms)
    });

    return (
        <group ref={group} {...props}>
            {/* Body */}
            <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[0.5, 0.6, 0.3]} />
                <meshStandardMaterial color="#00d2ff" metalness={0.5} roughness={0.2} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.2, 0]}>
                <boxGeometry args={[0.35, 0.35, 0.35]} />
                <meshStandardMaterial color="#eee" />
            </mesh>
            {/* Eyes */}
            <mesh position={[0.1, 1.25, 0.18]}>
                <boxGeometry args={[0.08, 0.05, 0.02]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[-0.1, 1.25, 0.18]}>
                <boxGeometry args={[0.08, 0.05, 0.02]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            {/* Antenna */}
            <mesh position={[0, 1.45, 0]} rotation={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[0.03, 1.6, 0]}>
                <sphereGeometry args={[0.05]} />
                <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
            </mesh>
            {/* Wheel/Base instead of legs for simplicity */}
            <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.4]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
});

export const Player = forwardRef((props, ref) => {
    // Refs
    // position is a Vector3 for easier math
    const position = useRef(new THREE.Vector3(0, 1, 8));
    const velocity = useRef(new THREE.Vector3(0, 0, 0));
    const keys = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });
    const orbitRef = useRef();
    const playerGroup = useRef();
    const modelRef = useRef();

    // Double Jump Logic
    const jumpCount = useRef(0);
    const canJump = useRef(true);

    useImperativeHandle(ref, () => ({
        position: position.current,
        velocity: velocity.current
    }));

    // Keyboard Input
    useEffect(() => {
        const onKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = true;
            if (e.code === 'Space') {
                // Prevent scrolling
                e.preventDefault();

                if (canJump.current) {
                    if (jumpCount.current < 2) {
                        velocity.current.y = JUMP_FORCE;
                        jumpCount.current++;

                        // Flip animation on double jump?
                        if (jumpCount.current === 2 && modelRef.current) {
                            // We'll handle rotation in useFrame
                        }
                    }
                    canJump.current = false; // Debounce slightly
                }
            }
            if (e.key === 'Shift') keys.current.shift = true;
        };
        const onKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = false;
            if (e.code === 'Space') canJump.current = true; // Reset debounce
            if (e.key === 'Shift') keys.current.shift = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    // Physics Loop (Manual)
    useFrame((state, delta) => {
        // 1. Get Camera Direction
        const camDir = new THREE.Vector3();
        state.camera.getWorldDirection(camDir);
        camDir.y = 0;
        camDir.normalize();
        const rightDir = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

        // 2. Calculate Movement Vector
        const moveDir = new THREE.Vector3(0, 0, 0);
        if (keys.current.w) moveDir.add(camDir);
        if (keys.current.s) moveDir.sub(camDir);
        if (keys.current.d) moveDir.add(rightDir);
        if (keys.current.a) moveDir.sub(rightDir);

        if (moveDir.lengthSq() > 0) moveDir.normalize();

        // 3. Apply Acceleration
        const speed = keys.current.shift ? MOVE_SPEED * 1.5 : MOVE_SPEED;
        if (moveDir.lengthSq() > 0) {
            velocity.current.x += moveDir.x * speed * delta * 5;
            velocity.current.z += moveDir.z * speed * delta * 5;

            // Rotate model to face direction
            const angle = Math.atan2(moveDir.x, moveDir.z);
            if (modelRef.current) {
                // Smooth rotation
                // modelRef.current.rotation.y = angle; 
                // Using lerp for smoothness would require Quaternion, simple set for now:
                modelRef.current.rotation.y = angle;
            }
        }

        // 4. Apply Gravity
        velocity.current.y -= GRAVITY * delta;

        // 5. Apply Drag (Damping)
        velocity.current.x -= velocity.current.x * DRAG * delta;
        velocity.current.z -= velocity.current.z * DRAG * delta;

        // 6. Update Position
        position.current.x += velocity.current.x * delta;
        position.current.y += velocity.current.y * delta;
        position.current.z += velocity.current.z * delta;

        // 7. Floor Collision (Simple y >= 0)
        if (position.current.y < 0) {
            position.current.y = 0;
            velocity.current.y = 0;
            jumpCount.current = 0; // Reset jumps
        }

        // 8. Update Visuals
        if (playerGroup.current) {
            playerGroup.current.position.copy(position.current);

            // Front Flip effect on double jump
            if (jumpCount.current === 2 && velocity.current.y > 0) {
                if (modelRef.current) modelRef.current.rotation.x += 10 * delta;
            } else {
                if (modelRef.current) modelRef.current.rotation.x = 0;
            }
        }

        // 9. Camera Follow
        if (orbitRef.current) {
            orbitRef.current.target.lerp(position.current, 0.1);
            orbitRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls ref={orbitRef} minDistance={5} maxDistance={20} enablePan={false} maxPolarAngle={Math.PI / 2 - 0.05} />
            <group ref={playerGroup}>
                <RobotPlayerModel ref={modelRef} />

                {/* Shadow */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                    <circleGeometry args={[0.5, 32]} />
                    <meshBasicMaterial color="black" opacity={0.3} transparent />
                </mesh>
            </group>
        </>
    );
});

export default Player;
