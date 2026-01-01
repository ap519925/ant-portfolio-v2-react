import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Asset Path
const MODEL_PATH = '/assets/poodle-suit.glb';

export const Player = (props) => {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF(MODEL_PATH);
    // Note: Meshy models might not have animations. If they do, useAnimations handles it.
    const { actions } = useAnimations(animations || [], group);

    const [position, setPosition] = useState([0, 0, 5]); // Start pos
    const [rotation, setRotation] = useState([0, Math.PI, 0]);

    // Movement State
    const moveSpeed = 5;
    const rotateSpeed = 2.5;
    const keys = useRef({ w: false, a: false, s: false, d: false });

    // Camera following logic
    const { camera } = useThree();

    // Key Listeners
    useEffect(() => {
        const handleDown = (e) => (keys.current[e.key.toLowerCase()] = true);
        const handleUp = (e) => (keys.current[e.key.toLowerCase()] = false);
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!group.current) return;

        // 1. Handle Rotation
        let rotY = rotation[1];
        if (keys.current.a) rotY += rotateSpeed * delta;
        if (keys.current.d) rotY -= rotateSpeed * delta;

        // 2. Handle Movement (Forward/Back relative to rotation)
        let moveX = 0;
        let moveZ = 0;

        if (keys.current.w) {
            moveX += Math.sin(rotY) * moveSpeed * delta;
            moveZ += Math.cos(rotY) * moveSpeed * delta;
        }
        if (keys.current.s) {
            moveX -= Math.sin(rotY) * moveSpeed * delta;
            moveZ -= Math.cos(rotY) * moveSpeed * delta;
        }

        const newPos = [position[0] + moveX, position[1], position[2] + moveZ];

        // Simple Boundary Check (Room is -10 to 10 approx)
        if (Math.abs(newPos[0]) > 9.5) newPos[0] = position[0];
        if (Math.abs(newPos[2]) > 9.5) newPos[2] = position[2];

        setPosition(newPos);
        setRotation([0, rotY, 0]);

        // Apply to mesh
        group.current.position.set(newPos[0], newPos[1], newPos[2]);
        group.current.rotation.set(0, rotY, 0);

        // 3. Update Camera (Third Person Follow)
        // Camera stays behind and above the player
        const camDist = 4;
        const camHeight = 2.5;

        // Calculate desired camera position based on player rotation
        const targetCamX = newPos[0] - Math.sin(rotY) * camDist;
        const targetCamZ = newPos[2] - Math.cos(rotY) * camDist;

        // Smooth Lerp Camera
        camera.position.lerp(new THREE.Vector3(targetCamX, camHeight, targetCamZ), 0.1);
        camera.lookAt(newPos[0], 1, newPos[2]); // Look at player head height
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* The Model */}
            <primitive object={nodes.scene || nodes.Scene} scale={1.5} />
        </group>
    );
};

// Preload the model
useGLTF.preload(MODEL_PATH);

export default Player;
