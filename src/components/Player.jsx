import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useFBX, useAnimations, Html } from '@react-three/drei'; // Switch to useFBX
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const MODEL_PATH = '/assets/dog-run.fbx';

// Preload
useFBX.preload(MODEL_PATH);

export const Player = (props) => {
    const group = useRef();

    // Load FBX
    const fbx = useFBX(MODEL_PATH);
    const { animations } = fbx;

    // Clone scene using SkeletonUtils to allow multiple instances
    const clone = useMemo(() => SkeletonUtils.clone(fbx), [fbx]);

    const { actions, names } = useAnimations(animations, group);
    const [debugInfo, setDebugInfo] = useState("Loading FBX...");

    // Debug Animations
    useEffect(() => {
        if (!names || names.length === 0) {
            setDebugInfo("No Animations in FBX!");
        } else {
            setDebugInfo("Anims: " + names.join(", "));
            // Auto play first
            const action = actions[names[0]];
            if (action) action.reset().play();
        }
    }, [names, actions]);

    const [position, setPosition] = useState([0, 0, 5]);
    const [rotation, setRotation] = useState([0, Math.PI, 0]);
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
    const { camera } = useThree();

    // Key Listeners
    useEffect(() => {
        const bg = (e) => {
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
        return () => { window.removeEventListener('keydown', bg); window.removeEventListener('keyup', bu); };
    }, []);

    useFrame((state, delta) => {
        const { w, s, shift } = keys.current;
        const moving = w || s;

        // Play/Speed
        const action = actions[names[0]];
        if (action) {
            if (moving) {
                if (!action.isRunning()) action.reset().fadeIn(0.2).play();
                action.timeScale = shift ? 1.5 : 1.0;
            } else {
                // If not moving, fade out? Or pause on first frame?
                // For now let it run if it's idle, or stop if it's run.
                // Assuming single clip is 'Run', we stop it.
                action.fadeOut(0.2);
            }
        }

        if (!group.current) return;

        let rotY = rotation[1];
        if (keys.current.a) rotY += 3 * delta;
        if (keys.current.d) rotY -= 3 * delta;

        let speed = shift ? 10 : 5;
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
            {/* FBX needs scaling usually. Assuming 0.01 for cm -> m conversion */}
            <primitive object={clone} scale={0.01} />

            <Html position={[0, 2, 0]}>
                <div style={{ background: 'black', color: 'cyan', padding: '5px', borderRadius: '4px', fontSize: '10px' }}>
                    {debugInfo}
                </div>
            </Html>
        </group>
    );
};

export default Player;
