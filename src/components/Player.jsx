import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// Asset Paths
const MODEL_MAIN = '/assets/dog-suit.glb'; // Used for the Mesh
const MODEL_RUN = '/assets/dog-run.glb';
const MODEL_WALK = '/assets/dog-walk.glb';
const MODEL_SCARED = '/assets/dog-scared.glb';
// (Scared used for Idle/Stop maybe? Or 'dancing' as user said. 
// User said 'scared', but text said 'dancing'. I'll map 'scared' to a key or just Idle fallback).

export const Player = (props) => {
    const group = useRef();
    const { scene, materials, animations: mainAnims } = useGLTF(MODEL_MAIN);

    // Load Animations separately
    const { animations: runAnims } = useGLTF(MODEL_RUN);
    const { animations: walkAnims } = useGLTF(MODEL_WALK);
    const { animations: scaredAnims } = useGLTF(MODEL_SCARED);

    // Clone scene to avoid mutation issues (React Three Fiber best practice for skinned meshes)
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    // Combine and Rename Animations
    const animations = useMemo(() => {
        const anims = [];
        if (runAnims.length > 0) {
            const clip = runAnims[0].clone();
            clip.name = 'Run';
            anims.push(clip);
        }
        if (walkAnims.length > 0) {
            const clip = walkAnims[0].clone();
            clip.name = 'Walk';
            anims.push(clip);
        }
        if (scaredAnims.length > 0) {
            const clip = scaredAnims[0].clone();
            clip.name = 'Scared'; // Maybe use for Idle?
            anims.push(clip);
        }
        // Fallback or Main anims
        if (mainAnims.length > 0) {
            mainAnims.forEach(clip => {
                if (!anims.find(a => a.name === clip.name)) anims.push(clip);
            });
        }
        return anims;
    }, [runAnims, walkAnims, scaredAnims, mainAnims]);

    const { actions } = useAnimations(animations, group);

    const [position, setPosition] = useState([0, 0, 5]);
    const [rotation, setRotation] = useState([0, Math.PI, 0]);

    // Movement Parameters
    const moveSpeed = 6;
    const rotateSpeed = 3;

    // Input State
    const [moveState, setMoveState] = useState('idle'); // 'idle', 'walk', 'run'
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });

    const { camera } = useThree();

    // Input Listeners
    useEffect(() => {
        const handleDown = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = true;
            if (e.key === 'Shift') keys.current.shift = true;

            updateState();
        };
        const handleUp = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = false;
            if (e.key === 'Shift') keys.current.shift = false;

            updateState();
        };

        const updateState = () => {
            const { w, s, shift } = keys.current;
            if (w || s) {
                setMoveState(shift ? 'run' : 'walk');
            } else {
                setMoveState('idle');
            }
        };

        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    // Animation Transitions
    useEffect(() => {
        // Stop all
        const currentAction = actions['Walk'] || actions['Run'] || actions['Scared'];

        if (moveState === 'walk') {
            actions['Run']?.fadeOut(0.2);
            actions['Scared']?.fadeOut(0.2);
            actions['Walk']?.reset().fadeIn(0.2).play();
        } else if (moveState === 'run') {
            actions['Walk']?.fadeOut(0.2);
            actions['Scared']?.fadeOut(0.2);
            actions['Run']?.reset().fadeIn(0.2).play();
        } else {
            // Idle
            actions['Walk']?.fadeOut(0.2);
            actions['Run']?.fadeOut(0.2);
            // Play Scared or Idle as fallback
            actions['Scared']?.reset().fadeIn(0.2).play();
        }
    }, [moveState, actions]);

    useFrame((state, delta) => {
        if (!group.current) return;

        // 1. Rotation
        let rotY = rotation[1];
        if (keys.current.a) rotY += rotateSpeed * delta;
        if (keys.current.d) rotY -= rotateSpeed * delta;

        // 2. Position
        let moveX = 0;
        let moveZ = 0;
        let speed = keys.current.shift ? moveSpeed * 1.5 : moveSpeed;

        if (keys.current.w) {
            moveX += Math.sin(rotY) * speed * delta;
            moveZ += Math.cos(rotY) * speed * delta;
        }
        if (keys.current.s) {
            moveX -= Math.sin(rotY) * speed * delta;
            moveZ -= Math.cos(rotY) * speed * delta;
        }

        const newPos = [position[0] + moveX, position[1], position[2] + moveZ];

        // Boundary
        if (Math.abs(newPos[0]) > 9.5) newPos[0] = position[0];
        if (Math.abs(newPos[2]) > 9.5) newPos[2] = position[2];

        setPosition(newPos);
        setRotation([0, rotY, 0]);

        // Apply
        group.current.position.set(newPos[0], newPos[1], newPos[2]);
        group.current.rotation.set(0, rotY, 0);

        // 3. Camera Follow
        const camDist = 5;
        const camHeight = 3;
        const targetCamX = newPos[0] - Math.sin(rotY) * camDist;
        const targetCamZ = newPos[2] - Math.cos(rotY) * camDist;

        camera.position.lerp(new THREE.Vector3(targetCamX, camHeight, targetCamZ), 0.1);
        camera.lookAt(newPos[0], 1.5, newPos[2]);
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={clone} scale={1.2} />
        </group>
    );
};

// Preload all
useGLTF.preload(MODEL_MAIN);
useGLTF.preload(MODEL_RUN);
useGLTF.preload(MODEL_WALK);
useGLTF.preload(MODEL_SCARED);

export default Player;
