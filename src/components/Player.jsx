import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// PROCEDURAL ROBOT (100% Stable)
// No external GLB files. Just code.
export const Player = forwardRef((props, ref) => {
    const group = useRef();
    useImperativeHandle(ref, () => group.current);

    const [position, setPosition] = useState([0, 0, 5]);
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
        if (!group.current) return;

        const { w, s, a, d, shift } = keys.current;
        const moving = w || s || a || d;
        let speed = shift ? 10 : 5;

        // Bobbing animation for Robot parts
        const body = group.current.children[0];
        if (body) {
            if (moving) {
                body.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 15) * 0.1;
                // Tilt forward when running
                body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, 0.2, 0.1);
            } else {
                body.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
                body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, 0, 0.1);
            }
        }

        // Movement
        if (w) group.current.position.z -= speed * delta;
        if (s) group.current.position.z += speed * delta;
        if (a) group.current.position.x -= speed * delta;
        if (d) group.current.position.x += speed * delta;

        // Camera Follow
        const p = group.current.position;
        // Smooth follow
        const goalPos = new THREE.Vector3(p.x, p.y + 5, p.z + 8);
        camera.position.lerp(goalPos, 0.1);
        camera.lookAt(p.x, p.y + 1, p.z);
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* Robot Container */}
            <group position={[0, 0.5, 0]}>
                {/* Body */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.5, 0.6, 0.3]} />
                    <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
                </mesh>
                {/* Head */}
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.35, 0.35, 0.35]} />
                    <meshStandardMaterial color="#eee" roughness={0.2} metalness={0.5} />
                </mesh>
                {/* Eye / Visor */}
                <mesh position={[0, 0.5, 0.15]}>
                    <boxGeometry args={[0.25, 0.08, 0.1]} />
                    <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
                </mesh>
                {/* Antenna */}
                <mesh position={[0, 0.8, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                    <meshStandardMaterial color="#888" />
                </mesh>
                {/* Glowing Bit */}
                <mesh position={[0, 1.0, 0]}>
                    <sphereGeometry args={[0.04]} />
                    <meshStandardMaterial color="red" emissive="red" emissiveIntensity={5} />
                </mesh>
            </group>

            {/* FAKE SHADOW BLOB */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <circleGeometry args={[0.4, 32]} />
                <meshBasicMaterial color="black" opacity={0.3} transparent depthWrite={false} />
            </mesh>
        </group>
    );
});

export default Player;
