import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const MODEL_RUN = '/assets/dog-run.glb';
useGLTF.preload(MODEL_RUN);

export const Player = (props) => {
    const group = useRef();
    const { scene, animations } = useGLTF(MODEL_RUN);

    // Debug: Check animations
    useEffect(() => {
        console.log("Loaded Animations:", animations);
        if (animations.length === 0) console.warn("WARNING: No animations found in GLB!");
        else console.log("Animation Names:", animations.map(a => a.name));
    }, [animations]);

    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { actions, names } = useAnimations(animations, group);

    const [position, setPosition] = useState([0, 0, 5]);
    const [rotation, setRotation] = useState([0, Math.PI, 0]);
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
    const { camera } = useThree();

    // Input Debug
    useEffect(() => {
        const bg = (e) => {
            console.log("Key:", e.key); // DEBUG KEY PRESS
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = true;
            if (e.key === 'Shift') keys.current.shift = true;
        };
        const bu = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = false;
            if (e.key === 'Shift') keys.current.shift = false;
        };
        window.addEventListener('keydown', bg);
        window.addEventListener('keyup', bu);
        return () => {
            window.removeEventListener('keydown', bg);
            window.removeEventListener('keyup', bu);
        };
    }, []);

    useFrame((state, delta) => {
        const { w, s, shift } = keys.current;
        const moving = w || s;

        // Play Animation
        const actionName = names[0];
        const action = actions[actionName];

        if (action) {
            if (moving) {
                if (!action.isRunning()) action.reset().fadeIn(0.2).play();
                action.timeScale = shift ? 1.5 : 1.0;
            } else {
                // If idle, maybe pause or slow down? 
                // For now just let it loop or fade out
                if (action.isRunning()) action.fadeOut(0.2);
            }
        }

        if (!group.current) return;

        let rotY = rotation[1];
        if (keys.current.a) rotY += 3 * delta;
        if (keys.current.d) rotY -= 3 * delta;

        let speed = (shift) ? 10 : 5; // Creating faster speed
        let moveX = 0; let moveZ = 0;

        if (keys.current.w) {
            moveX += Math.sin(rotY) * speed * delta;
            moveZ += Math.cos(rotY) * speed * delta;
        }
        if (keys.current.s) {
            moveX -= Math.sin(rotY) * speed * delta;
            moveZ -= Math.cos(rotY) * speed * delta;
        }

        const newPos = [position[0] + moveX, position[1], position[2] + moveZ];
        setPosition(newPos);
        setRotation([0, rotY, 0]);

        group.current.position.set(newPos[0], newPos[1], newPos[2]);
        group.current.rotation.set(0, rotY, 0);

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

export default Player;
