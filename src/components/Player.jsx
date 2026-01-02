import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// DEBUG MODE: NO GLB LOADING
export const Player = (props) => {
    const group = useRef();
    const [debugInfo, setDebugInfo] = useState("Debug Box Player");

    // Simple Movement Logic (No Animation System)
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

        if (group.current) {
            group.current.position.set(newPos[0], newPos[1], newPos[2]);
            group.current.rotation.set(0, rotY, 0);
        }

        // Camera Follow
        const camDist = 5;
        const camHeight = 3;
        const targetCamX = newPos[0] - Math.sin(rotY) * camDist;
        const targetCamZ = newPos[2] - Math.cos(rotY) * camDist;

        camera.position.lerp(new THREE.Vector3(targetCamX, camHeight, targetCamZ), 0.1);
        camera.lookAt(newPos[0], 1.5, newPos[2]);
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* Simple Box instead of Heavy GLB */}
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
            <mesh position={[0, 1.5, 0.5]} castShadow>
                <boxGeometry args={[0.8, 0.5, 0.5]} /> {/* Eyes/Visor */}
                <meshStandardMaterial color="cyan" />
            </mesh>

            <Html position={[0, 2.5, 0]}>
                <div style={{ background: 'black', color: 'lime', padding: '5px', borderRadius: '4px', fontSize: '10px' }}>
                    {debugInfo}
                </div>
            </Html>
        </group>
    );
};

export default Player;
