import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// Asset Paths (Optimized files ~2.5MB each)
const MODEL_MAIN = '/assets/dog-suit.glb';
const MODEL_RUN = '/assets/dog-run.glb';
const MODEL_WALK = '/assets/dog-walk.glb';
const MODEL_SCARED = '/assets/dog-scared.glb';

// Preload assets to avoid popping
useGLTF.preload(MODEL_MAIN);
useGLTF.preload(MODEL_RUN);
useGLTF.preload(MODEL_WALK);
useGLTF.preload(MODEL_SCARED);

export const Player = (props) => {
    const group = useRef();
    const { scene } = useGLTF(MODEL_MAIN);

    // Load Animations
    const { animations: runAnims } = useGLTF(MODEL_RUN);
    const { animations: walkAnims } = useGLTF(MODEL_WALK);
    const { animations: scaredAnims } = useGLTF(MODEL_SCARED);

    // Clone the main scene for this instance
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    // Combine Animations
    const animations = useMemo(() => {
        const anims = [];
        if (runAnims.length) {
            const clip = runAnims[0].clone();
            clip.name = 'Run';
            anims.push(clip);
        }
        if (walkAnims.length) {
            const clip = walkAnims[0].clone();
            clip.name = 'Walk';
            anims.push(clip);
        }
        if (scaredAnims.length) {
            const clip = scaredAnims[0].clone();
            clip.name = 'Idle'; // Use Scared as Idle
            anims.push(clip);
        }
        return anims;
    }, [runAnims, walkAnims, scaredAnims]);

    const { actions } = useAnimations(animations, group);

    // State
    const [position, setPosition] = useState([0, 0, 5]);
    const [rotation, setRotation] = useState([0, Math.PI, 0]);
    const moveSpeed = 6;
    const rotateSpeed = 3;
    const [moveState, setMoveState] = useState('Idle');
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
    const { camera } = useThree();

    // Key Listeners
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

    // Frame Loop (Logic + Animation Update)
    useFrame((state, delta) => {
        // Determine intended state based on KEYS (every frame check is safer than event listener for continuous transitions)
        const { w, s, shift } = keys.current;
        let nextState = 'Idle';
        if (w || s) {
            nextState = shift ? 'Run' : 'Walk';
        }

        if (nextState !== moveState) {
            // Transition
            const currentAction = actions[moveState];
            const nextAction = actions[nextState];

            if (nextAction) {
                currentAction?.fadeOut(0.2);
                nextAction?.reset().fadeIn(0.2).play();
                setMoveState(nextState);
            }
        }

        // --- Movement Logic ---
        if (!group.current) return;

        let rotY = rotation[1];
        if (keys.current.a) rotY += rotateSpeed * delta;
        if (keys.current.d) rotY -= rotateSpeed * delta;

        let moveX = 0; let moveZ = 0;
        let speed = (moveState === 'Run') ? moveSpeed * 2.0 : moveSpeed;

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

        group.current.position.set(newPos[0], newPos[1], newPos[2]);
        group.current.rotation.set(0, rotY, 0);

        // Camera Follow
        const camDist = 5;
        const camHeight = 3;
        const targetCamX = newPos[0] - Math.sin(rotY) * camDist;
        const targetCamZ = newPos[2] - Math.cos(rotY) * camDist;

        camera.position.lerp(new THREE.Vector3(targetCamX, camHeight, targetCamZ), 0.1);
        camera.lookAt(newPos[0], 1.5, newPos[2]);
    });

    useEffect(() => {
        // Init Idle animation
        if (actions['Idle']) actions['Idle'].play();
    }, [actions]);

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={clone} scale={1.2} />
        </group>
    );
};

export default Player;
