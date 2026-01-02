import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import Player from './Player';

// SIMPLE LIGHTING SCENE - RESTORING VISIBILITY
const Wall = (props) => {
    return (
        <mesh {...props}>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#eee" />
        </mesh>
    );
};

const Floor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#ccc" />
            <gridHelper args={[100, 20]} />
        </mesh>
    );
};

const GalleryScene = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#333', overflow: 'hidden' }}> {/* Added overflow hidden */}
            <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>

                {/* RESTORED LIGHTS so character isn't black */}
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} />

                <Player position={[0, 0, 8]} />
                <Floor />

                <group position={[0, 0, 0]}>
                    <Wall position={[0, 2.5, -10]} width={20} height={10} />
                    <Wall position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} />
                    <Wall position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} />
                </group>

            </Canvas>

            <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 20, right: 20 }}>
                EXIT
            </button>
        </div>
    );
};

export default GalleryScene;
