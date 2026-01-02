import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// ULTIMATE DEBUG PLAYER - NO MODELS, NO LOGIC
export const Player = (props) => {
    const group = useRef();
    const [position, setPosition] = useState([0, 0, 5]);
    const keys = useRef({ w: false, a: false, s: false, d: false });
    const { camera } = useThree();

    useEffect(() => {
        const bg = (e) => { keys.current[e.key.toLowerCase()] = true; };
        const bu = (e) => { keys.current[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', bg);
        window.addEventListener('keyup', bu);
        return () => { window.removeEventListener('keydown', bg); window.removeEventListener('keyup', bu); };
    }, []);

    useFrame((state, delta) => {
        if (!group.current) return;

        // Simple movement
        const speed = 5;
        if (keys.current.w) group.current.position.z -= speed * delta;
        if (keys.current.s) group.current.position.z += speed * delta;
        if (keys.current.a) group.current.position.x -= speed * delta;
        if (keys.current.d) group.current.position.x += speed * delta;

        // Camera Follow
        const p = group.current.position;
        camera.position.lerp(new THREE.Vector3(p.x, p.y + 5, p.z + 10), 0.1);
        camera.lookAt(p.x, p.y, p.z);
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshBasicMaterial color="hotpink" /> {/* Basic Material is cheapest */}
            </mesh>
            <Html position={[0, 2.5, 0]}>
                <div style={{ background: 'black', color: 'red', padding: '5px' }}>
                    DEBUG MODE
                </div>
            </Html>
        </group>
    );
};

export default Player;
