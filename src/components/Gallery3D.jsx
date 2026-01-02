import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei'; // No sky for now
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import * as THREE from 'three';

// --- VISUAL ASSETS ---

const Wall = (props) => {
    return (
        <mesh {...props}>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#fff0f5" />
        </mesh>
    );
};

const DreamFloor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="#eecbf2" />
            <gridHelper args={[500, 50, '#ffffff', '#eecbf2']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
        </mesh>
    );
};

// --- PROCEDURAL HOUSES (Low Poly) ---
const House = ({ position, rotation }) => {
    const color = useMemo(() => {
        const colors = ['#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'];
        return colors[Math.floor(Math.random() * colors.length)];
    }, []);

    return (
        <group position={position} rotation={rotation}>
            {/* Base */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[1.8, 1.5, 4]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.75, 1.01]}>
                <planeGeometry args={[0.8, 1.5]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
};

const Village = () => {
    const houses = useMemo(() => {
        const h = [];
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const radius = 20 + Math.random() * 10;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            h.push(<House key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]} />);
        }
        return h;
    }, []);
    return <group>{houses}</group>;
};


// ... Collectibles code ...
const Collectible = ({ position, color, type, onCollect }) => {
    const ref = useRef();
    const [active, setActive] = useState(true);
    useFrame((state, delta) => {
        if (!active || !ref.current) return;
        ref.current.rotation.y += delta;
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    });
    if (!active) return null;
    return (
        <group ref={ref} position={position}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {type === 'code' && (
                    <mesh rotation={[0.5, 0.5, 0]}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial color="lime" />
                    </mesh>
                )}
                {type === 'art' && (
                    <mesh>
                        <torusGeometry args={[0.3, 0.1, 16, 32]} />
                        <meshStandardMaterial color="magenta" />
                    </mesh>
                )}
                {type === 'lang' && (
                    <mesh>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="cyan" />
                    </mesh>
                )}
            </Float>
        </group>
    );
};

const CollectiblesManager = ({ playerRef, setScore }) => {
    const items = useRef([
        { id: 1, pos: [5, 1, 5], type: 'code', color: 'lime' },
        { id: 2, pos: [-5, 1, 8], type: 'art', color: 'magenta' },
        { id: 3, pos: [0, 1, 15], type: 'lang', color: 'cyan' },
        { id: 4, pos: [10, 1, -5], type: 'code', color: 'lime' },
        { id: 5, pos: [-10, 1, -5], type: 'art', color: 'magenta' },
        // More items in the village
        { id: 6, pos: [20, 1, 0], type: 'lang', color: 'cyan' },
        { id: 7, pos: [-20, 1, 10], type: 'code', color: 'lime' },
    ]);
    const [collected, setCollected] = useState([]);
    useFrame(() => {
        if (!playerRef.current) return;
        const playerPos = playerRef.current.position;
        items.current.forEach(item => {
            if (collected.includes(item.id)) return;
            const dx = playerPos.x - item.pos[0];
            const dz = playerPos.z - item.pos[2];
            // Check Y too (must jump?) - Optional
            if (Math.sqrt(dx * dx + dz * dz) < 1.5) {
                setCollected(prev => [...prev, item.id]);
                setScore(s => s + 1);
            }
        });
    });
    return (
        <group>
            {items.current.map(item => !collected.includes(item.id) && (
                <Collectible key={item.id} position={item.pos} color={item.color} type={item.type} onCollect={() => { }} />
            ))}
        </group>
    );
};

const GalleryScene = () => {
    const navigate = useNavigate();
    const playerRef = useRef();
    const [score, setScore] = useState(0);

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffe4e1', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10,
                fontFamily: 'Exo 2', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>VILLAGE MODE</div>
                <div>Collected: {score}</div>
            </div>

            <Canvas camera={{ position: [0, 5, 12], fov: 60 }} gl={{ antialias: true }}>
                <color attach="background" args={['#ffe4e1']} />

                {/* Basic Lighting */}
                <ambientLight intensity={1.0} color="#fff" />
                <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fff" />

                {/* Re-enable Sparkles (Safe) */}
                <Sparkles count={50} scale={40} size={5} speed={0.4} opacity={0.5} color="#fff" />

                <Player ref={playerRef} position={[0, 0, 8]} />
                <CollectiblesManager playerRef={playerRef} setScore={setScore} />

                <DreamFloor />
                <Village />

                {/* Central Hall */}
                <group position={[0, 0, 0]}>
                    <Wall position={[0, 2.5, -10]} width={20} height={10} />
                    <Wall position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} />
                    <Wall position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} />
                    <Wall position={[-6, 2.5, 10]} width={8} height={10} />
                    <Wall position={[6, 2.5, 10]} width={8} height={10} />
                </group>

            </Canvas>

            <button onClick={() => navigate('/')} style={{
                position: 'absolute', top: 20, right: 20, zIndex: 20, padding: '10px 20px',
                background: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '20px', cursor: 'pointer'
            }}>
                EXIT
            </button>
        </div>
    );
};

export default GalleryScene;
