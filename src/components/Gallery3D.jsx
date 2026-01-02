import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sky, Float } from '@react-three/drei';
// import { Cloud, Sparkles } from '@react-three/drei'; // REMOVED FOR DEBUG
// import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'; // DISABLED
import { useNavigate } from 'react-router-dom';
import Player from './Player';

// --- DREAMSCAPE COMPONENTS ---

const Wall = (props) => {
    return (
        <mesh {...props} receiveShadow castShadow>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#fff0f5" roughness={0.2} metalness={0.1} />
        </mesh>
    );
};

const DreamFloor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#eecbf2" roughness={0.4} metalness={0.3} />
            <gridHelper args={[1000, 100, '#ffffff', '#eecbf2']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
        </mesh>
    );
};

// FOREST DISABLED TO RULE OUT GEOMETRY OVERLOAD
// const SakuraTree = ({ position, scale = 1 }) => { ... }
// const Forest = () => { ... }

// Floating Geometric Shapes for "Magic" feel
const FloatingShapes = () => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh position={[15, 10, -15]} castShadow>
                <icosahedronGeometry args={[2, 0]} />
                <meshStandardMaterial color="#bae1ff" emissive="#bae1ff" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-20, 15, -10]} castShadow>
                <octahedronGeometry args={[3, 0]} />
                <meshStandardMaterial color="#ffffba" emissive="#ffffba" emissiveIntensity={0.5} />
            </mesh>
        </Float>
    );
};

const Painting = ({ position, rotation, color, label, id, navigate }) => {
    const [hovered, setHover] = useState(false);
    return (
        <group position={position} rotation={rotation}>
            <spotLight position={[0, 4, 3]} intensity={5} angle={0.5} penumbra={1} color="#fff" castShadow />
            <mesh position={[0, 1.5, 0.1]}>
                <boxGeometry args={[3.2, 2.2, 0.2]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
            <mesh
                position={[0, 1.5, 0.25]}
                onClick={() => navigate(`/project/${id}`)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[3, 2, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? '#fff' : color}
                    emissive={hovered ? '#fff' : color}
                    emissiveIntensity={hovered ? 2 : 0.8}
                />
            </mesh>
        </group>
    );
};

const GalleryScene = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffe4e1' }}>
            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10,
                fontFamily: 'Exo 2', letterSpacing: '2px', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>D R E A M S C A P E (PROBE)</div>
            </div>

            <Canvas shadows camera={{ position: [0, 5, 12], fov: 60 }} gl={{ preserveDrawingBuffer: true }}>
                {/* Fog */}
                <fog attach="fog" args={['#eecbf2', 10, 80]} />

                {/* Lighting */}
                <ambientLight intensity={0.6} color="#ffe4e1" />
                <directionalLight
                    position={[30, 50, 20]}
                    intensity={1.2}
                    color="#fff5e6"
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                <Sky sunPosition={[100, 10, 100]} turbidity={0.3} rayleigh={0.8} />
                <Environment preset="sunset" background={false} />

                {/* HEAVY ELEMENTS DISABLED */}
                {/* <Sparkles ... /> */}
                {/* <Cloud ... /> */}
                {/* <Forest /> */}

                <Player position={[0, 0, 8]} />
                <DreamFloor />
                <FloatingShapes />

                <group position={[0, 0, 0]}>
                    <Wall position={[0, 2.5, -10]} width={20} height={10} />
                    <Wall position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} />
                    <Wall position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} />
                    <Wall position={[-6, 2.5, 10]} width={8} height={10} />
                    <Wall position={[6, 2.5, 10]} width={8} height={10} />

                    <Painting position={[0, 0, -9.5]} color="#ff69b4" label="Project 1" id="1" navigate={navigate} />
                    <Painting position={[-9.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#00ced1" label="Project 2" id="2" navigate={navigate} />
                    <Painting position={[9.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#ffa07a" label="Project 3" id="3" navigate={navigate} />
                </group>

            </Canvas>

            <button
                style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 20,
                    padding: '10px 20px', background: 'rgba(255,255,255,0.3)', border: '1px solid white',
                    color: 'white', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold',
                    backdropFilter: 'blur(10px)'
                }}
                onClick={() => navigate('/')}
            >
                EXIT
            </button>
        </div>
    );
};

export default GalleryScene;
