import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// PHYSICS CONSTANTS
const GRAVITY = 30;
const JUMP_FORCE = 10;
const MOVE_SPEED = 10;

export const Player = forwardRef((props, ref) => {
    const group = useRef();
    useImperativeHandle(ref, () => group.current);

    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false, space: false });
    const orbitRef = useRef();

    // Physics State
    const velocity = useRef(new THREE.Vector3(0, 0, 0));
    const isGrounded = useRef(true);
    const jumpCount = useRef(0);

    useEffect(() => {
        const onKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = true;
            if (e.key === 'Shift') keys.current.shift = true;

            // Jump Logic (Space)
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                if (jumpCount.current < 2) { // Double Jump
                    velocity.current.y = JUMP_FORCE;
                    isGrounded.current = false;
                    jumpCount.current++;

                    // Visual feedback for double jump?
                    if (jumpCount.current === 2) {
                        // Trigger flip? logic in useFrame
                    }
                }
            }
        };

        const onKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = false;
            if (e.key === 'Shift') keys.current.shift = false;
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!group.current) return;

        // 1. Update Camera Target
        if (orbitRef.current) {
            orbitRef.current.target.lerp(group.current.position, 0.2);
            orbitRef.current.update();
        }

        const { w, s, a, d } = keys.current;
        const moving = w || s || a || d;

        // 2. Horizontal Movement (Camera Relative)
        const camDir = new THREE.Vector3();
        state.camera.getWorldDirection(camDir);
        camDir.y = 0; camDir.normalize();
        const right = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize(); // Left actually?
        // Wait, standard Cross(Forward, Up) = Right. For WebGL (Right-Handed): 
        // Forward is -Z. Up is +Y. Cross(-Z, +Y) = +X (Right).
        // camera.getWorldDirection returns direction vector (Target - Pos). 
        // If looking -Z. Dir = (0,0,-1). Cross = (1,0,0) = +X. Correct.

        const moveDir = new THREE.Vector3(0, 0, 0);
        if (w) moveDir.add(camDir);
        if (s) moveDir.sub(camDir);
        if (a) moveDir.sub(right); // A goes Left? If Right vector is +X, we want -X.
        if (d) moveDir.add(right);

        if (moveDir.lengthSq() > 0) {
            moveDir.normalize();
            // Apply speed to X/Z velocity? Or direct position?
            // Direct position is tighter for non-physics implementations.
            group.current.position.addScaledVector(moveDir, MOVE_SPEED * delta);

            // Rotate body
            const targetRot = Math.atan2(moveDir.x, moveDir.z);
            const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRot);
            group.current.quaternion.slerp(q, 0.15);
        }

        // 3. Vertical Physics (Gravity)
        velocity.current.y -= GRAVITY * delta;
        group.current.position.y += velocity.current.y * delta;

        // Floor Collision
        if (group.current.position.y <= 0) {
            group.current.position.y = 0;
            velocity.current.y = 0;
            isGrounded.current = true;
            jumpCount.current = 0;
        }

        // 4. Procedural Animations
        const body = group.current.children[0];
        if (body) {
            // Bobbing only if grounded and moving
            if (isGrounded.current && moving) {
                body.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 15) * 0.1;
                body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, 0.2, 0.1);
            }
            // Flying / Jumping pose
            else if (!isGrounded.current) {
                body.position.y = 0.5;
                // Tilt back slightly when jumping?
                body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, -0.2, 0.1);

                // Spin if Double Jump? (TODO)
                if (jumpCount.current === 2) {
                    body.rotation.x += 10 * delta; // Front flip
                }
            }
            // Idle
            else {
                body.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
                body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, 0, 0.1);
            }
        }
    });

    return (
        <>
            <OrbitControls
                ref={orbitRef}
                enablePan={false}
                minDistance={5}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2 - 0.1}
            />

            <group ref={group} {...props} dispose={null}>
                {/* Robot Container */}
                <group position={[0, 0, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.5, 0.6, 0.3]} />
                        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                        <boxGeometry args={[0.35, 0.35, 0.35]} />
                        <meshStandardMaterial color="#eee" roughness={0.2} metalness={0.5} />
                    </mesh>
                    <mesh position={[0, 0.5, 0.15]}>
                        <boxGeometry args={[0.25, 0.08, 0.1]} />
                        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
                    </mesh>
                    <mesh position={[0, 0.8, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                        <meshStandardMaterial color="#888" />
                    </mesh>
                    <mesh position={[0, 1.0, 0]}>
                        <sphereGeometry args={[0.04]} />
                        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={5} />
                    </mesh>
                </group>

                {/* Fake Shadow (scales when jumping) */}
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0.02, 0]}
                    scale={1 / (Math.max(1, group.current?.position.y || 1))} // Shrink shadow when high
                >
                    <circleGeometry args={[0.4, 32]} />
                    <meshBasicMaterial color="black" opacity={0.3} transparent depthWrite={false} />
                </mesh>
            </group>
        </>
    );
});

export default Player;
