import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';

// --- STRIPPED DOWN SCENE (No Environment/Sky/Fog/Sparkles) ---

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
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#eecbf2" />
            <gridHelper args={[100, 20]} />
        </mesh>
    );
};

// ... Collectibles code (Logic only) ...
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
                        <meshStandardMaterial color="#00ff00" />
                    </mesh>
                )}
                {type === 'art' && (
                    <mesh>
                        <torusGeometry args={[0.3, 0.1, 16, 32]} />
                        <meshStandardMaterial color="#ff00ff" />
                    </mesh>
                )}
                {type === 'lang' && (
                    <mesh>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#00ffff" />
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
    ]);
    const [collected, setCollected] = useState([]);
    useFrame(() => {
        if (!playerRef.current) return;
        const playerPos = playerRef.current.position;
        items.current.forEach(item => {
            if (collected.includes(item.id)) return;
            const dx = playerPos.x - item.pos[0];
            const dz = playerPos.z - item.pos[2];
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
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>SIMPLE MODE (NO ENV)</div>
                <div>Collected: {score} / 5</div>
            </div>

            <Canvas camera={{ position: [0, 5, 12], fov: 60 }} gl={{ antialias: true }}>
                {/* SOLID BACKGROUND INSTEAD OF SKY/ENV */}
                <color attach="background" args={['#ffe4e1']} />

                {/* Lighting - Basic */}
                <ambientLight intensity={1.0} color="#fff" />
                <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fff" />

                {/* REMOVED: Sky, Environment, Fog, Sparkles */}

                <Player ref={playerRef} position={[0, 0, 8]} />
                <CollectiblesManager playerRef={playerRef} setScore={setScore} />

                <DreamFloor />

                {/* Building */}
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
