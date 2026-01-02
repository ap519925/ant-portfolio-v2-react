import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const MODEL_PATH = '/assets/dog-final.glb';
useGLTF.preload(MODEL_PATH);

export const Player = ({ playSound, soundEnabled, onPositionChange, ...props }) => {
    const group = useRef();
    const { scene, animations } = useGLTF(MODEL_PATH);
    const { actions, names } = useAnimations(animations, group);
    const [debugInfo, setDebugInfo] = useState("Loading...");
    const footstepTimer = useRef(0);

    // Clone & Tint Material
    const clone = useMemo(() => {
        const c = SkeletonUtils.clone(scene);
        // Apply Color Tint manually since textures might be missing or lighting is simple
        c.traverse((o) => {
            if (o.isMesh) {
                // Determine existing material or replace
                if (o.material) {
                    // Check if it's the Suit or Skin?
                    // Just tint everything slightly Purple/Grey for a stylized look
                    // or preserve texture map if exists
                    o.castShadow = true;
                    o.receiveShadow = true;
                    if (!o.material.map) {
                        // Only tint if no texture
                        o.material.color.set('#a855f7'); // Purple
                    }
                }
            }
        });
        return c;
    }, [scene]);

    // Animation Logic
    useEffect(() => {
        if (!names || names.length === 0) {
            setDebugInfo("No Animations!");
        } else {
            setDebugInfo("Found: " + names.join(", "));
            // Auto play Index 0 or Idle
            const idleIdx = names.findIndex(n => n.toLowerCase().includes('idle'));
            const idx = idleIdx >= 0 ? idleIdx : 0;
            const action = actions[names[idx]];
            if (action) action.reset().fadeIn(0.5).play();
        }
    }, [names, actions]);

    const [position, setPosition] = useState([0, 0, 5]);
    const [rotation, setRotation] = useState([0, Math.PI, 0]);
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
    const { camera } = useThree();

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

        // Footstep sounds
        if (moving && soundEnabled && playSound) {
            footstepTimer.current += delta;
            const stepInterval = shift ? 0.25 : 0.4; // Faster steps when sprinting
            if (footstepTimer.current >= stepInterval) {
                playSound('footstep');
                footstepTimer.current = 0;
            }
        } else {
            footstepTimer.current = 0;
        }

        // Auto Switch Animation
        if (names.length > 1) {
            const runKey = names.find(n => n.toLowerCase().includes('run') || n.toLowerCase().includes('walk')) || names[1] || names[0];
            const idleKey = names.find(n => n.toLowerCase().includes('idle')) || names[0];

            const runAct = actions[runKey];
            const idleAct = actions[idleKey];

            if (moving) {
                if (idleAct && idleAct.isRunning()) idleAct.fadeOut(0.2);
                if (runAct && !runAct.isRunning()) runAct.reset().fadeIn(0.2).play();
                if (runAct) runAct.timeScale = shift ? 1.5 : 1.0;
            } else {
                if (runAct && runAct.isRunning()) runAct.fadeOut(0.2);
                if (idleAct && !idleAct.isRunning()) idleAct.reset().fadeIn(0.2).play();
            }
        } else if (names.length === 1) {
            const act = actions[names[0]];
            if (moving) act.timeScale = shift ? 1.5 : 1.0;
            else act.timeScale = 1.0;
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

        // Update parent component with new position
        if (onPositionChange) {
            onPositionChange(newPos);
        }

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
            <primitive object={clone} scale={1.5} />
            <Html position={[0, 2.5, 0]}>
                <div style={{ background: 'black', color: 'lime', padding: '5px', borderRadius: '4px', fontSize: '10px' }}>
                    {debugInfo}
                </div>
            </Html>
        </group>
    );
};

export default Player;
