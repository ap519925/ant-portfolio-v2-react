import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

// --- CONSTANTS ---
const MODEL_PATH = '/assets/Meshy_AI_Animation_Walking_withSkin.glb';
const MOVE_SPEED = 10;
const JUMP_FORCE = 12;
const GRAVITY = 30;
const DRAG = 5;

// Preload the model to avoid pop-in
useGLTF.preload(MODEL_PATH);

export const Player = forwardRef((props, ref) => {
    // 1. Setup Refs for State (Manual Physics)
    const position = useRef(new THREE.Vector3(0, 0, 8)); // Start at 0,0,8 (y=0 for ground)
    const velocity = useRef(new THREE.Vector3(0, 0, 0));
    const keys = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });

    // 2. Setup 3D Model
    const { scene, animations } = useGLTF(MODEL_PATH);
    const modelRef = useRef();
    // Clone scene to avoid conflicts if multiple players exist (good practice)
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { actions, names } = useAnimations(animations, modelRef);

    // Refs for controls
    const orbitRef = useRef();
    const playerGroup = useRef();

    // Double Jump Logic
    const jumpCount = useRef(0);
    const canJump = useRef(true);

    useImperativeHandle(ref, () => ({
        position: position.current,
        velocity: velocity.current
    }));

    // 3. Input Handling
    useEffect(() => {
        const onKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                if (canJump.current) {
                    if (jumpCount.current < 2) {
                        velocity.current.y = JUMP_FORCE;
                        jumpCount.current++;
                    }
                    canJump.current = false;
                }
            }
            if (e.key === 'Shift') keys.current.shift = true;
        };
        const onKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = false;
            if (e.code === 'Space') canJump.current = true;
            if (e.key === 'Shift') keys.current.shift = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    // 4. Animation Initialization
    useEffect(() => {
        if (names.length > 0 && actions[names[0]]) {
            const action = actions[names[0]];
            action.reset().fadeIn(0.2).play();
            action.timeScale = 0; // Start paused/idle
        }
    }, [names, actions]);

    // 5. Physics & Animation Loop
    useFrame((state, delta) => {
        // --- MOVEMENT ---
        const camDir = new THREE.Vector3();
        state.camera.getWorldDirection(camDir);
        camDir.y = 0;
        camDir.normalize();
        const rightDir = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

        const moveDir = new THREE.Vector3(0, 0, 0);
        if (keys.current.w) moveDir.add(camDir);
        if (keys.current.s) moveDir.sub(camDir);
        if (keys.current.d) moveDir.add(rightDir);
        if (keys.current.a) moveDir.sub(rightDir);

        const isMoving = moveDir.lengthSq() > 0;
        if (isMoving) moveDir.normalize();

        const speed = keys.current.shift ? MOVE_SPEED * 1.5 : MOVE_SPEED;

        // Acceleration
        if (isMoving) {
            velocity.current.x += moveDir.x * speed * delta * 5;
            velocity.current.z += moveDir.z * speed * delta * 5;

            // Rotate Model smoothly
            const targetRot = Math.atan2(moveDir.x, moveDir.z);
            if (modelRef.current) {
                // Smooth rotation toward target
                // Calculate shortage angle diff
                let diff = targetRot - modelRef.current.rotation.y;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                modelRef.current.rotation.y += diff * 10 * delta;
            }
        }

        // Gravity
        velocity.current.y -= GRAVITY * delta;

        // Friction
        velocity.current.x -= velocity.current.x * DRAG * delta;
        velocity.current.z -= velocity.current.z * DRAG * delta;

        // Position Update
        position.current.x += velocity.current.x * delta;
        position.current.y += velocity.current.y * delta;
        position.current.z += velocity.current.z * delta;

        // Floor Collision
        if (position.current.y < 0) {
            position.current.y = 0;
            velocity.current.y = 0;
            jumpCount.current = 0;
        }

        // Apply to Group
        if (playerGroup.current) {
            playerGroup.current.position.copy(position.current);

            // Front Flip on Double Jump
            if (modelRef.current) {
                if (jumpCount.current === 2 && velocity.current.y > 0) {
                    modelRef.current.rotation.x += 15 * delta;
                } else {
                    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, 0, 0.2);
                }
            }
        }

        // --- ANIMATION UPDATE ---
        if (names.length > 0 && actions[names[0]]) {
            const action = actions[names[0]];
            if (isMoving) {
                // If moving fast (Shift), play faster
                action.timeScale = keys.current.shift ? 1.5 : 1.0;
            } else {
                // If idle, pause or slow down? 
                // Since this is a simple 'Walking' clip, we just set speed to 0 or very low
                action.timeScale = THREE.MathUtils.lerp(action.timeScale, 0, 0.1);
            }
        }

        // --- CAMERA UPDATE ---
        if (orbitRef.current) {
            // Target slightly above player
            const target = position.current.clone().add(new THREE.Vector3(0, 1.5, 0));
            orbitRef.current.target.lerp(target, 0.1);
            orbitRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls ref={orbitRef} minDistance={5} maxDistance={20} enablePan={false} maxPolarAngle={Math.PI / 2 - 0.05} />
            <group ref={playerGroup}>
                {/* The GLB Model */}
                <group ref={modelRef} scale={1.2}>
                    <primitive object={clone} />
                </group>

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
