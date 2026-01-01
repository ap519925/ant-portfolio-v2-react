import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const MODEL_MAIN = '/assets/dog-suit.glb';
const MODEL_RUN = '/assets/dog-run.glb';
const MODEL_WALK = '/assets/dog-walk.glb';
const MODEL_SCARED = '/assets/dog-scared.glb';

export const Player = (props) => {
    const group = useRef();

    // Load Main Model
    const { scene, animations: mainAnims } = useGLTF(MODEL_MAIN);

    // Load Aux Animations (Try to be lightweight)
    const { animations: runAnims, scene: runScene } = useGLTF(MODEL_RUN);
    const { animations: walkAnims, scene: walkScene } = useGLTF(MODEL_WALK);
    const { animations: scaredAnims, scene: scaredScene } = useGLTF(MODEL_SCARED);

    // Memory Cleanup: Dispose of geometry from animation-only files immediately
    useEffect(() => {
        const cleanup = (sc) => {
            sc?.traverse((o) => {
                if (o.isMesh) {
                    o.geometry.dispose();
                    if (o.material.isMaterial) o.material.dispose();
                }
            });
        };
        cleanup(runScene);
        cleanup(walkScene);
        cleanup(scaredScene);

        // Clear from cache to free VRAM
        useGLTF.clear(MODEL_RUN);
        useGLTF.clear(MODEL_WALK);
        useGLTF.clear(MODEL_SCARED);
    }, [runScene, walkScene, scaredScene]);

    // Clone Scene
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
            clip.name = 'Scared';
            anims.push(clip);
        }
        // Fallback
        if (mainAnims.length) {
            mainAnims.forEach(clip => {
                if (!anims.find(a => a.name === clip.name)) anims.push(clip);
            });
        }
        return anims;
    }, [runAnims, walkAnims, scaredAnims, mainAnims]);

    const { actions } = useAnimations(animations, group);

    // State
    const [position, setPosition] = useState([0, 0, 5]);
    const [rotation, setRotation] = useState([0, Math.PI, 0]);
    const moveSpeed = 6;
    const rotateSpeed = 3;
    const [moveState, setMoveState] = useState('idle');
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
            if (w || s) setMoveState(shift ? 'run' : 'walk');
            else setMoveState('idle');
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
        // Fallback checks
        const runAction = actions['Run'];
        const walkAction = actions['Walk'];
        const idleAction = actions['Scared'] || actions[Object.keys(actions)[0]]; // Fallback to first

        if (moveState === 'walk') {
            runAction?.fadeOut(0.2);
            idleAction?.fadeOut(0.2);
            walkAction?.reset().fadeIn(0.2).play();
        } else if (moveState === 'run') {
            walkAction?.fadeOut(0.2);
            idleAction?.fadeOut(0.2);
            runAction?.reset().fadeIn(0.2).play();
        } else {
            walkAction?.fadeOut(0.2);
            runAction?.fadeOut(0.2);
            idleAction?.reset().fadeIn(0.2).play();
        }
    }, [moveState, actions]);

    useFrame((state, delta) => {
        if (!group.current) return;

        let rotY = rotation[1];
        if (keys.current.a) rotY += rotateSpeed * delta;
        if (keys.current.d) rotY -= rotateSpeed * delta;

        let moveX = 0; let moveZ = 0;
        let speed = keys.current.shift ? moveSpeed * 2.0 : moveSpeed;

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

        const camDist = 5; const camHeight = 3;
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

// Preload ONLY Main to save memory
useGLTF.preload(MODEL_MAIN);

export default Player;
