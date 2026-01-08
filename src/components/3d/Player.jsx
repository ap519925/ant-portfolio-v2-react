
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

// --- CONSTANTS ---
const MODEL_PATH = '/assets/Meshy_AI_Animation_Walking_withSkin.glb';
// Fallback to walking animation since running file is missing from assets
// const RUN_PATH = '/assets/Meshy_AI_Animation_Running_withSkin.glb'; 
const MOVE_SPEED = 10;
const JUMP_FORCE = 12;
const GRAVITY = 30;
const DRAG = 4;

// Preload common ones
useGLTF.preload(MODEL_PATH);

export const Player = forwardRef(({ isDancing, danceUrl, activeAnimationName }, ref) => {
    // 1. Setup Refs for State (Manual Physics)
    const position = useRef(new THREE.Vector3(0, 0, 8)); // Start at 0,0,8 (y=0 for ground)
    const velocity = useRef(new THREE.Vector3(0, 0, 0));
    const keys = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });
    const jumpCount = useRef(0);
    const playerGroup = useRef();

    // EXPOSE GROUP TO PARENT (Critical for Coin Collection)
    useImperativeHandle(ref, () => playerGroup.current);

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': keys.current.w = true; break;
                case 'a': keys.current.a = true; break;
                case 's': keys.current.s = true; break;
                case 'd': keys.current.d = true; break;
                case 'shift': keys.current.shift = true; break;
                case ' ':
                    if (!keys.current.space) {
                        if (jumpCount.current < 2) {
                            velocity.current.y = JUMP_FORCE;
                            jumpCount.current++;
                        }
                        keys.current.space = true;
                    }
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': keys.current.w = false; break;
                case 'a': keys.current.a = false; break;
                case 's': keys.current.s = false; break;
                case 'd': keys.current.d = false; break;
                case 'shift': keys.current.shift = false; break;
                case ' ': keys.current.space = false; break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // 2. Setup 3D Models
    // A. MOVEMENT (Walk - Single File Fallback)
    const { scene, animations } = useGLTF(MODEL_PATH);
    const modelRef = useRef();
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { actions, names } = useAnimations(animations, modelRef);

    // B. DANCING (Custom)
    const activeFile = danceUrl || MODEL_PATH;
    const { scene: danceScene, animations: danceAmims } = useGLTF(activeFile);
    const danceRef = useRef();
    const danceClone = useMemo(() => SkeletonUtils.clone(danceScene), [danceScene]);
    const { actions: danceActions, names: danceNames } = useAnimations(danceAmims, { current: danceClone });

    // Refs for controls
    const orbitRef = useRef();

    // Dance Logic
    useEffect(() => {
        if (isDancing && danceNames.length > 0 && danceActions) {
            // Stop all current
            Object.values(danceActions).forEach(act => act.stop());

            // Determine which clip to play
            let clipToPlay = danceNames[0]; // Default to first

            // If specific name requested and exists
            if (activeAnimationName && danceNames.includes(activeAnimationName)) {
                clipToPlay = activeAnimationName;
            } else if (activeAnimationName) {
                const index = parseInt(activeAnimationName);
                if (!isNaN(index) && danceNames[index]) {
                    clipToPlay = danceNames[index];
                }
            }

            const action = danceActions[clipToPlay];
            if (action) {
                action.reset().fadeIn(0.2).play();
                action.timeScale = 1;
                action.setEffectiveWeight(1);
            }
        }
    }, [isDancing, danceNames, danceActions, activeAnimationName]);

    // 5. Physics & Animation Loop
    useFrame((state, delta) => {
        // --- MOVEMENT ---
        const camDir = new THREE.Vector3();
        state.camera.getWorldDirection(camDir);
        camDir.y = 0;
        camDir.normalize();
        const rightDir = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

        let isMoving = false;

        if (isDancing) {
            velocity.current.set(0, 0, 0);
        } else {
            // NORMAL MOVEMENT
            const moveDir = new THREE.Vector3(0, 0, 0);
            if (keys.current.w) moveDir.add(camDir);
            if (keys.current.s) moveDir.sub(camDir);
            if (keys.current.d) moveDir.add(rightDir);
            if (keys.current.a) moveDir.sub(rightDir);

            isMoving = moveDir.lengthSq() > 0;
            if (isMoving) moveDir.normalize();

            const speed = keys.current.shift ? MOVE_SPEED * 1.5 : MOVE_SPEED;

            // Acceleration
            if (isMoving) {
                velocity.current.x += moveDir.x * speed * delta * 5;
                velocity.current.z += moveDir.z * speed * delta * 5;

                // Rotate Model smoothly
                const targetRot = Math.atan2(moveDir.x, moveDir.z);
                if (modelRef.current) {
                    let diff = targetRot - modelRef.current.rotation.y;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    modelRef.current.rotation.y += diff * 8 * delta;

                    if (danceRef.current) danceRef.current.rotation.y = modelRef.current.rotation.y;
                }
            }

            // Normalizing model height/tilt
            if (modelRef.current) {
                modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, 0, 0.1);
                modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, 0, 0.1);
            }

            // Gravity & Friction
            velocity.current.y -= GRAVITY * delta;
            velocity.current.x -= velocity.current.x * DRAG * delta;
            velocity.current.z -= velocity.current.z * DRAG * delta;

            position.current.x += velocity.current.x * delta;
            position.current.y += velocity.current.y * delta;
            position.current.z += velocity.current.z * delta;

            if (position.current.y < 0) {
                position.current.y = 0;
                velocity.current.y = 0;
                jumpCount.current = 0;
            }
        }

        // Apply to Group
        if (playerGroup.current) {
            playerGroup.current.position.copy(position.current);

            // Double Jump Flip
            if (modelRef.current && !isDancing) {
                if (jumpCount.current === 2 && velocity.current.y > 0) {
                    modelRef.current.rotation.x += 15 * delta;
                } else {
                    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, 0, 0.2);
                }
            }
        }

        // --- ANIMATION CONTROLLER (Single File Logic) ---
        if (!isDancing && names.length > 0 && actions[names[0]]) {
            const action = actions[names[0]];
            const moving = (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.z) > 0.1);

            if (moving) {
                if (action.paused) action.paused = false;
                if (!action.isRunning()) action.play();
                action.timeScale = keys.current.shift ? 1.5 : 1.0;
            } else {
                // If stopped, fade timeScale to 0 to "pause" smoothly
                action.timeScale = THREE.MathUtils.lerp(action.timeScale, 0, 0.1);
                if (action.timeScale < 0.01) {
                    action.timeScale = 0;
                }
            }
        }

        // Force stop animations if dancing
        else if (isDancing) {
            Object.values(actions).forEach(a => a.stop());
        }

        // --- CAMERA UPDATE ---
        if (orbitRef.current) {
            const target = position.current.clone().add(new THREE.Vector3(0, 1.5, 0));
            orbitRef.current.target.lerp(target, 0.05);
            orbitRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls ref={orbitRef} minDistance={5} maxDistance={20} enablePan={false} maxPolarAngle={Math.PI / 2 - 0.05} />
            <group ref={playerGroup}>
                {/* MOVEMENT MODEL */}
                <group ref={modelRef} scale={1.2} visible={!isDancing}>
                    <primitive object={clone} />
                </group>

                {/* DANCE MODEL */}
                <group ref={danceRef} scale={1.2} visible={isDancing}>
                    <primitive object={danceClone} />
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
