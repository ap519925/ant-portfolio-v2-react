import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei'; // Added OrbitControls
import * as THREE from 'three';

// PROCEDURAL ROBOT + ORBIT CAMERA
export const Player = forwardRef((props, ref) => {
    const group = useRef();
    useImperativeHandle(ref, () => group.current);

    const [position, setPosition] = useState([0, 0, 5]);
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
    const orbitRef = useRef(); // Ref for OrbitControls

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

        // Camera Follow Logic (with Orbit support)
        // If OrbitControls is active, we just update the TARGET to the player.
        // We do NOT force camera position (let the user rotate).

        if (orbitRef.current) {
            orbitRef.current.target.lerp(group.current.position, 0.2);
            orbitRef.current.update();
        }

        // Movement relative to Camera? 
        // For simple WSAD, we usually move relative to world.
        // But if user rotates camera, 'W' should mean "Forward away from camera"?
        // Implementing Camera-Relative Movement:

        const { w, s, a, d, shift } = keys.current;
        const moving = w || s || a || d;
        let speed = shift ? 10 : 5;

        if (moving) {
            // Get camera direction (ignoring Y for flat movement)
            const camDir = new THREE.Vector3();
            state.camera.getWorldDirection(camDir);
            camDir.y = 0;
            camDir.normalize();

            const camRight = new THREE.Vector3();
            camRight.crossVectors(state.camera.up, camDir).normalize();
            // Actually crossVectors(up, dir) might be inverted depending on handiness. 
            // Standard: Right = Dir x Up (No, Right = Cross(UnitY, -Dir)? No.)
            // ThreeJS: Right = Cross(Dir, Up) * -1? 
            // Let's use simpler logic: 
            // Forward = camDir. Right = Cross(camDir, Vector3(0,1,0)).

            const right = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize(); // Actually this gives Left usually?
            // Let's test: Dir=(0,0,-1). Up=(0,1,0). Cross=(1,0,0) -> +X (Right). Correct.

            const moveDir = new THREE.Vector3(0, 0, 0);
            if (w) moveDir.add(camDir);
            if (s) moveDir.sub(camDir);
            if (a) moveDir.sub(right); // 'A' goes Left
            if (d) moveDir.add(right); // 'D' goes Right

            if (moveDir.lengthSq() > 0) {
                moveDir.normalize();

                // Rot body to face move dir
                const targetRot = Math.atan2(moveDir.x, moveDir.z);
                // Smooth rotation
                // Quaternion slerp is better/easier
                const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRot);
                group.current.quaternion.slerp(q, 0.1);

                // Move
                group.current.position.addScaledVector(moveDir, speed * delta);
            }

            // Bobbing 
            const body = group.current.children[0];
            if (body) {
                body.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 15) * 0.1;
                // Tilt forward
                // Need to rotate logic... simplified tilt
                // body.rotation.x = 0.2; 
            }
        } else {
            const body = group.current.children[0];
            if (body) body.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    return (
        <>
            <OrbitControls
                ref={orbitRef}
                enablePan={false}
                minDistance={5}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going under floor
            />

            <group ref={group} {...props} dispose={null}>
                {/* Robot Container */}
                <group position={[0, 0.5, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.5, 0.6, 0.3]} />
                        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                        <boxGeometry args={[0.35, 0.35, 0.35]} />
                        <meshStandardMaterial color="#eee" roughness={0.2} metalness={0.5} />
                    </mesh>
                    {/* Visor indicates "Forward" face */}
                    <mesh position={[0, 0.5, 0.15]}>
                        <boxGeometry args={[0.25, 0.08, 0.1]} />
                        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
                    </mesh>
                    <mesh position={[0, 0.8, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                        <meshStandardMaterial color="#888" />
                    </mesh>
                    <mesh position={[0, 1.0, 0]}>
                        <sphereGeometry args={[0.04]} />
                        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={5} />
                    </mesh>
                </group>

                {/* Shadow */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                    <circleGeometry args={[0.4, 32]} />
                    <meshBasicMaterial color="black" opacity={0.3} transparent depthWrite={false} />
                </mesh>
            </group>
        </>
    );
});

export default Player;
