import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// Meshy AI Model with Merged Animations
const MODEL_PATH = '/assets/dog-final.glb';
useGLTF.preload(MODEL_PATH);

export const Player = (props) => {
    const group = useRef();
    const { scene, animations } = useGLTF(MODEL_PATH);
    const { actions, names } = useAnimations(animations, group);
    const [debugInfo, setDebugInfo] = useState("Loading...");

    // Debug & Animation Logic
    useEffect(() => {
        if (!names || names.length === 0) {
            setDebugInfo("No Animations Found!");
        } else {
            console.log("Found Animations:", names);
            setDebugInfo("Found: " + names.join(", "));

            // Try to find Idle/Run
            const idleAnim = names.find(n => n.toLowerCase().includes('idle')) || names[0];
            const action = actions[idleAnim];
            if (action) action.reset().fadeIn(0.5).play();
        }
    }, [names, actions]);

    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

    // State
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

        // Animation Switching
        // Heuristic: If we have >1 anims, try to switch.
        // Meshy output usually has: 'Idle', 'Run', 'Walk'?
        // If names are weird (e.g. 'animation_0'), we default to [0] and [1].
        if (names.length > 1) {
            const idleName = names.find(n => n.toLowerCase().includes('idle')) || names[0];
            const moveName = names.find(n => n.toLowerCase().includes('run') || n.toLowerCase().includes('walk')) || names[1] || names[0];

            const idleAction = actions[idleName];
            const moveAction = actions[moveName];

            if (moving) {
                if (idleAction && idleAction.isRunning()) idleAction.fadeOut(0.2);
                if (moveAction && !moveAction.isRunning()) {
                    moveAction.reset().fadeIn(0.2).play();
                }
                if (moveAction) moveAction.timeScale = shift ? 1.5 : 1.0;
            } else {
                if (moveAction && moveAction.isRunning()) moveAction.fadeOut(0.2);
                if (idleAction && !idleAction.isRunning()) {
                    idleAction.reset().fadeIn(0.2).play();
                }
            }
        } else if (names.length === 1) {
            // Single Animation handling (Always play, maybe speed up?)
            const action = actions[names[0]];
            if (moving) action.timeScale = shift ? 1.5 : 1.0;
            else action.timeScale = 1.0; // Play normally if idle?
        }

        // --- Movement Logic ---
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
            {/* Standard scale logic often needs adjustment for Meshy models */}
            <primitive object={clone} scale={1.5} />

            <Html position={[0, 2.5, 0]}>
                <div style={{ background: 'black', color: 'lime', padding: '5px', borderRadius: '4px', fontSize: '10px', whiteSpace: 'nowrap' }}>
                    {debugInfo}
                </div>
            </Html>
        </group>
    );
};

export default Player;
