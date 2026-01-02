import React, { useRef, useEffect, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const MODEL_PATH = '/assets/dog-compressed.glb';

export const Player = forwardRef((props, ref) => {
    const group = useRef();
    useImperativeHandle(ref, () => group.current);

    const { scene, animations } = useGLTF(MODEL_PATH);
    const { actions, names } = useAnimations(animations, group);
    const [debugInfo, setDebugInfo] = useState("");

    const clone = useMemo(() => {
        const c = SkeletonUtils.clone(scene);
        c.traverse((o) => {
            if (o.isMesh) {
                // NO REAL SHADOWS
                // o.castShadow = true; 
                // o.receiveShadow = true;
                if (!o.material.map) o.material.color.set('#a855f7');
            }
        });
        return c;
    }, [scene]);

    useEffect(() => {
        if (!names || names.length === 0) setDebugInfo("No Anims");
        else {
            const idle = names.find(n => n.toLowerCase().includes('idle')) || names[0];
            const action = actions[idle];
            if (action) action.reset().play();
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

        // Anims
        if (names.length > 0) {
            const runKey = names.find(n => n.toLowerCase().includes('run') || n.toLowerCase().includes('walk')) || names[1] || names[0];
            const idleKey = names.find(n => n.toLowerCase().includes('idle')) || names[0];
            const runAct = actions[runKey];
            const idleAct = actions[idleKey];

            if (moving) {
                if (idleAct?.isRunning()) idleAct.fadeOut(0.2);
                if (runAct && !runAct.isRunning()) runAct.reset().fadeIn(0.2).play();
                if (runAct) runAct.timeScale = shift ? 1.5 : 1.0;
            } else {
                if (runAct?.isRunning()) runAct.fadeOut(0.2);
                if (idleAct && !idleAct.isRunning()) idleAct.reset().fadeIn(0.2).play();
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
            <primitive object={clone} scale={1.5} />
            {/* FAKE SHADOW BLOB */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <circleGeometry args={[0.6, 32]} />
                <meshBasicMaterial color="black" opacity={0.4} transparent depthWrite={false} />
            </mesh>
            {debugInfo && <Html position={[0, 2, 0]}><div style={{ background: 'black', color: 'white', fontSize: 10 }}>{debugInfo}</div></Html>}
        </group>
    );
});

export default Player;
