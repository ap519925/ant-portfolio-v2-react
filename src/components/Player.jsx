import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// Using ONLY the Run file effectively solves the bone mismatch issues.
const MODEL_RUN = '/assets/dog-run.glb';

useGLTF.preload(MODEL_RUN);

export const Player = (props) => {
    const group = useRef();
    // Load the Run model (Mesh + Animation)
    const { scene, animations } = useGLTF(MODEL_RUN);

    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    const { actions, names } = useAnimations(animations, group);

    const [position, setPosition] = useState([0, 0, 5]);
    const [rotation, setRotation] = useState([0, Math.PI, 0]);
    const moveSpeed = 6;
    const rotateSpeed = 3;
    const [isMoving, setIsMoving] = useState(false);
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
    const { camera } = useThree();

    // Input Listeners
    useEffect(() => {
        const handleDown = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = true;
            if (e.key === 'Shift') keys.current.shift = true;
        };
        const handleUp = (e) => {
            const k = e.key.toLowerCase();
            if (keys.current[k] !== undefined) keys.current[k] = false;
            if (e.key === 'Shift') keys.current.shift = false;
        };
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    useFrame((state, delta) => {
        // Logic
        const { w, s, shift } = keys.current;
        const moving = w || s;

        if (moving !== isMoving) {
            setIsMoving(moving);
            // Play/Stop Animation based on movement
            // Improve: Identify the Run clip name
            const actionName = names[0]; // Assume first clip is Run
            if (actionName) {
                const action = actions[actionName];
                if (moving) {
                    action.reset().fadeIn(0.2).play();
                    // Speed var?
                    action.timeScale = shift ? 1.5 : 1.0;
                } else {
                    action.fadeOut(0.2);
                }
            }
        }

        // Update TimeScale dynamically
        if (moving) {
            const actionName = names[0];
            if (actionName && actions[actionName]) {
                actions[actionName].timeScale = shift ? 1.5 : 1.0;
            }
        }

        if (!group.current) return;

        let rotY = rotation[1];
        if (keys.current.a) rotY += rotateSpeed * delta;
        if (keys.current.d) rotY -= rotateSpeed * delta;

        let moveX = 0; let moveZ = 0;
        let speed = (shift) ? moveSpeed * 2.0 : moveSpeed;

        if (keys.current.w) {
            moveX += Math.sin(rotY) * speed * delta;
            moveZ += Math.cos(rotY) * speed * delta;
        }
        if (keys.current.s) {
            moveX -= Math.sin(rotY) * speed * delta;
            moveZ -= Math.cos(rotY) * speed * delta;
        }

        const newPos = [position[0] + moveX, position[1], position[2] + moveZ];
        if (Math.abs(newPos[0]) > 9.5) newPos[0] = position[0];
        if (Math.abs(newPos[2]) > 9.5) newPos[2] = position[2];

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
