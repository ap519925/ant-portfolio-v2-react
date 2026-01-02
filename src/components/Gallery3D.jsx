import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sky, Cloud, Stars, BakeShadows, SoftShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import * as THREE from 'three';

// --- Components ---

const Wall = (props) => {
    return (
        <mesh {...props} receiveShadow castShadow>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
        </mesh>
    );
};

const GrassFloor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#4caf50" roughness={0.8} />
        </mesh>
    );
};

// Procedural Tree Component
const Tree = ({ position, scale = 1 }) => {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
                <meshStandardMaterial color="#5d4037" />
            </mesh>
            {/* Leaves (Cone Layers) */}
            <mesh position={[0, 3, 0]} castShadow receiveShadow>
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial color="#2e7d32" roughness={0.8} />
            </mesh>
            <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[1.2, 2.5, 8]} />
                <meshStandardMaterial color="#388e3c" roughness={0.8} />
            </mesh>
        </group>
    );
};

// Generate Random Forest
const Forest = () => {
    const trees = useMemo(() => {
        const t = [];
        for (let i = 0; i < 50; i++) {
            const x = (Math.random() - 0.5) * 200; // Spread x
            const z = (Math.random() - 0.5) * 200; // Spread z
            // Avoid placing trees inside the gallery (center area)
            if (Math.abs(x) < 20 && Math.abs(z) < 20) continue;
            const scale = 0.8 + Math.random() * 0.8;
            t.push(<Tree key={i} position={[x, 0, z]} scale={scale} />);
        }
        return t;
    }, []);
    return <group>{trees}</group>;
};

const Painting = ({ position, rotation, color, label, id, navigate }) => {
    const [hovered, setHover] = useState(false);
    return (
        <group position={position} rotation={rotation}>
            {/* Spotlight */}
            <spotLight position={[0, 4, 3]} intensity={8} angle={0.4} penumbra={0.5} castShadow />
            {/* Frame */}
            <mesh position={[0, 1.5, 0.1]}>
                <boxGeometry args={[3.2, 2.2, 0.2]} />
                <meshStandardMaterial color="#111" />
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
                    emissiveIntensity={hovered ? 2 : 0.5} // Bloom effect trigger
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

            <Canvas shadows camera={{ position: [0, 5, 12], fov: 60 }}>
                {/* Advanced Rendering Settings */}
                <SoftShadows size={10} samples={10} focus={0.5} />
                <fog attach="fog" args={['#87CEEB', 20, 100]} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[50, 80, 50]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                />

                <Sky sunPosition={[100, 40, 100]} turbidity={0.5} rayleigh={0.5} />
                <Environment preset="park" background={false} />

                {/* Clouds */}
                <Cloud position={[-20, 20, -40]} speed={0.2} opacity={0.6} />
                <Cloud position={[20, 25, -20]} speed={0.15} opacity={0.6} />

                {/* Objects */}
                <Player position={[0, 0, 8]} />
                <GrassFloor />
                <Forest />

                {/* Gallery Building */}
                <group position={[0, 0, 0]}>
                    <Wall position={[0, 2.5, -10]} width={20} height={10} />
                    <Wall position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} />
                    <Wall position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} />
                    <Wall position={[-6, 2.5, 10]} width={8} height={10} />
                    <Wall position={[6, 2.5, 10]} width={8} height={10} />

                    <Painting position={[0, 0, -9.5]} color="cyan" label="Project 1" id="1" navigate={navigate} />
                    <Painting position={[-9.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="purple" label="Project 2" id="2" navigate={navigate} />
                    <Painting position={[9.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="orange" label="Project 3" id="3" navigate={navigate} />
                </group>

                {/* Post Processing Pipeline */}
                <EffectComposer>
                    <Bloom luminanceThreshold={1} intensity={1.5} levels={9} mipmapBlur />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>

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
