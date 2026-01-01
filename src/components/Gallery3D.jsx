import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointerLockControls, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

const Wall = (props) => {
    return (
        <mesh {...props} receiveShadow>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
    );
};

const Floor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.1} />
        </mesh>
    );
};

const Painting = ({ position, rotation, color, label, id, navigate }) => {
    const [hovered, setHover] = useState(false);

    return (
        <group position={position} rotation={rotation}>
            {/* Frame */}
            <mesh position={[0, 0, 0.1]}>
                <boxGeometry args={[3.2, 2.2, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Canvas/Art */}
            <mesh
                position={[0, 0, 0.25]}
                onClick={() => navigate(`/project/${id}`)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[3, 2, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? 'hotpink' : color}
                    emissive={hovered ? color : '#000'}
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Label */}
            <mesh position={[0, -1.5, 0]}>
                <boxGeometry args={[1, 0.3, 0.05]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
    );
};

// Simple Instructions Overlay
const UI = () => (
    <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        pointerEvents: 'none',
        textAlign: 'center',
        fontFamily: 'Exo 2',
        zIndex: 10
    }}>
        <div style={{ fontSize: '2rem' }}>Click to Start</div>
        <div style={{ opacity: 0.7 }}>WASD to Walk • Mouse to Look</div>
    </div>
);

const GalleryScene = () => {
    const navigate = useNavigate();
    const [locked, setLocked] = useState(false);

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            {!locked && <UI />}
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} shadows>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} castShadow />

                <PointerLockControls onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />

                {/* Room Structure */}
                <Floor />
                <Wall position={[0, 0, -10]} width={20} height={10} /> {/* Back */}
                <Wall position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} /> {/* Left */}
                <Wall position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} /> {/* Right */}

                {/* Exhibits */}
                <Painting
                    position={[0, 0, -9.5]}
                    color="cyan"
                    label="Project 1"
                    id="1"
                    navigate={navigate}
                />
                <Painting
                    position={[-9.5, 0, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    color="purple"
                    label="Project 2"
                    id="2"
                    navigate={navigate}
                />
                <Painting
                    position={[9.5, 0, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                    color="orange"
                    label="Project 3"
                    id="3"
                    navigate={navigate}
                />

                <Environment preset="city" />
            </Canvas>

            {/* Exit Button */}
            <button
                style={{ position: 'absolute', top: 20, right: 20, zIndex: 20, padding: '10px 20px' }}
                onClick={() => navigate('/')}
            >
                Exit Gallery
            </button>
        </div>
    );
};

export default GalleryScene;
