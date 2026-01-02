import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sky, Cloud, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import * as THREE from 'three';

const Wall = (props) => {
    return (
        <mesh {...props} receiveShadow>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
        </mesh>
    );
};

const GrassFloor = () => {
    // Simple infinite grass plane
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#4caf50" roughness={1} metalness={0} />
            {/* Optional: Add a grid helper that blends in or remove it for pure nature */}
            {/* <gridHelper args={[1000, 200, '#388e3c', '#4caf50']} rotation={[-Math.PI/2, 0, 0]} /> */}
        </mesh>
    );
};

const Painting = ({ position, rotation, color, label, id, navigate }) => {
    const [hovered, setHover] = useState(false);
    return (
        <group position={position} rotation={rotation}>
            {/* Spotlight */}
            <spotLight position={[0, 4, 3]} intensity={4} angle={0.4} penumbra={0.5} castShadow />
            {/* Frame */}
            <mesh position={[0, 1.5, 0.1]}>
                <boxGeometry args={[3.2, 2.2, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Canvas */}
            <mesh
                position={[0, 1.5, 0.25]}
                onClick={() => navigate(`/project/${id}`)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[3, 2, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? '#fff' : color}
                    emissive={hovered ? color : '#000'}
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    );
};

const GalleryScene = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#87CEEB' }}>
            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'white', zIndex: 10,
                fontFamily: 'Exo 2', textShadow: '0px 2px 4px rgba(0,0,0,0.5)', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em' }}>EXPLORE</div>
                <div style={{ fontSize: '0.9em' }}>WASD to Move • Shift to Run</div>
            </div>

            <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
                {/* Day Sky Color Fog */}
                <fog attach="fog" args={['#87CEEB', 20, 90]} />

                {/* Sunlight */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />

                {/* Environment & Sky */}
                <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
                <Environment preset="park" background={false} />

                {/* Clouds - Placed high above */}
                <Cloud position={[-10, 15, -20]} speed={0.2} opacity={0.5} />
                <Cloud position={[15, 20, -10]} speed={0.2} opacity={0.5} />
                <Cloud position={[0, 18, -40]} speed={0.2} opacity={0.5} />

                {/* The Player */}
                <Player position={[0, 0, 8]} />

                {/* The World */}
                <GrassFloor />

                {/* The Gallery Building */}
                <group position={[0, 0, 0]}>
                    <Wall position={[0, 2.5, -10]} width={20} height={10} /> {/* Back */}
                    <Wall position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} /> {/* Left */}
                    <Wall position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} /> {/* Right */}

                    {/* Front Walls */}
                    <Wall position={[-6, 2.5, 10]} width={8} height={10} />
                    <Wall position={[6, 2.5, 10]} width={8} height={10} />

                    {/* Artworks */}
                    <Painting position={[0, 0, -9.5]} color="cyan" label="Project 1" id="1" navigate={navigate} />
                    <Painting position={[-9.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="purple" label="Project 2" id="2" navigate={navigate} />
                    <Painting position={[9.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="orange" label="Project 3" id="3" navigate={navigate} />
                </group>

            </Canvas>

            <button
                style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 20,
                    padding: '10px 20px', background: 'white', border: 'none',
                    color: 'black', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onClick={() => navigate('/')}
            >
                EXIT
            </button>
        </div>
    );
};

export default GalleryScene;
