import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { useSphere } from '@react-three/cannon';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

const MODEL_PATH = '/assets/Meshy_AI_Animation_Walking_withSkin.glb';
useGLTF.preload(MODEL_PATH);

// PHYSICS CONSTANTS
const MOVE_SPEED = 12;
const JUMP_FORCE = 8;

export const Player = forwardRef((props, ref) => {
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false, space: false });
    const orbitRef = useRef();
    const { scene, animations } = useGLTF(MODEL_PATH);
    const modelRef = useRef();
    const { actions, names } = useAnimations(animations, modelRef);

    // Clone the dog model
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

    // Physics body for collision
    const [physicsRef, api] = useSphere(() => ({
        mass: 10,
        position: props.position || [0, 1, 8],
        args: [0.8], // radius
        type: 'Dynamic',
        linearDamping: 0.85, // Lower damping for better movement response
        angularDamping: 1,
        fixedRotation: true,
    }));

    useImperativeHandle(ref, () => physicsRef.current);

    const position = useRef([0, 1, 8]);
    const velocity = useRef([0, 0, 0]);

    // Subscribe to physics
    useEffect(() => {
        const unsubscribe = api.position.subscribe(v => position.current = v);
        return unsubscribe;
    }, [api.position]);

    useEffect(() => {
        const unsubscribe = api.velocity.subscribe(v => velocity.current = v);
        return unsubscribe;
    }, [api.velocity]);

    // Start animation - model only has walking animation
    useEffect(() => {
        console.log('🎬 Total animations found:', names.length);
        console.log('📋 Animation names:', names);
        if (names && names.length > 0) {
            const walkAction = actions[names[0]];
            if (walkAction) {
                console.log('▶️ Starting walking animation:', names[0]);
                walkAction.reset().fadeIn(0.2).play();
                walkAction.timeScale = 0; // Start at 0 speed (idle)
            }
        }
    }, [names, actions]);

    useEffect(() => {
        const onKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = true;
            if (e.key === 'Shift') keys.current.shift = true;

            // Jump Logic (Space)
            if (e.code === 'Space') {
                e.preventDefault();
                // Simple jump
                if (Math.abs(velocity.current[1]) < 0.1) { // Only if not already jumping
                    api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
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
    }, [api]);

    useFrame((state, delta) => {
        if (!physicsRef.current) return;

        const { w, s, a, d, shift } = keys.current;
        const moving = w || s || a || d;

        // Camera relative movement
        const camDir = new THREE.Vector3();
        state.camera.getWorldDirection(camDir);
        camDir.y = 0;
        camDir.normalize();

        const right = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

        const moveDir = new THREE.Vector3(0, 0, 0);
        if (w) moveDir.add(camDir);
        if (s) moveDir.sub(camDir);
        if (a) moveDir.sub(right);
        if (d) moveDir.add(right);

        // Apply force-based movement for better physics
        if (moveDir.lengthSq() > 0) {
            moveDir.normalize();
            const speed = shift ? MOVE_SPEED * 1.5 : MOVE_SPEED;
            const force = moveDir.multiplyScalar(speed * 200); // Stronger force
            api.applyForce([force.x, 0, force.z], [0, 0, 0]);

            // Limit max horizontal speed
            const horizontalVel = Math.sqrt(velocity.current[0]**2 + velocity.current[2]**2);
            if (horizontalVel > speed) {
                const scale = speed / horizontalVel;
                api.velocity.set(velocity.current[0] * scale, velocity.current[1], velocity.current[2] * scale);
            }

            // Rotate character model towards movement direction
            const targetRot = Math.atan2(moveDir.x, moveDir.z);
            if (modelRef.current) {
                modelRef.current.rotation.y = targetRot; // Rotate visual model
            }
        }

        // Update camera
        const pos = new THREE.Vector3(position.current[0], position.current[1], position.current[2]);
        if (orbitRef.current) {
            orbitRef.current.target.lerp(pos, 0.2);
            orbitRef.current.update();
        }

        // Animation - single walking animation
        if (names.length > 0 && actions[names[0]]) {
            const walkAction = actions[names[0]];

            if (moving) {
                // Play walking animation when moving
                walkAction.timeScale = shift ? 1.5 : 1.0;
            } else {
                // Stop animation when idle (timeScale 0 = frozen on first frame)
                walkAction.timeScale = 0;
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

            <group ref={physicsRef} {...props} dispose={null}>
                {/* Character Model */}
                <group ref={modelRef} position={[0, -0.8, 0]}>
                    <primitive object={clone} scale={1} castShadow receiveShadow />
                </group>
            </group>
        </>
    );
});

export default Player;
