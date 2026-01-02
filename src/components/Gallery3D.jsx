import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sky, Float, Sparkles, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import * as THREE from 'three';

// --- VISUAL ASSETS ---

const Wall = (props) => {
    return (
        <mesh {...props}>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#fff0f5" roughness={0.2} metalness={0.1} />
        </mesh>
    );
};

const DreamFloor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="#eecbf2" roughness={0.4} metalness={0.1} />
            <gridHelper args={[500, 50, '#ffffff', '#eecbf2']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
        </mesh>
    );
};

// --- COLLECTIBLES SYSTEM ---

const Collectible = ({ position, color, type, onCollect }) => {
    const ref = useRef();
    const [active, setActive] = useState(true);

    useFrame((state, delta) => {
        if (!active || !ref.current) return;
        // Float & Rotate
        ref.current.rotation.y += delta;
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    });

    const checkCollection = (playerPos) => {
        if (!active || !ref.current) return;
        const d = ref.current.position.distanceTo(new THREE.Vector3(...playerPos));
        if (d < 1.5) {
            setActive(false);
            onCollect(type);
        }
    };

    // Expose check to parent (simplified for now, ideally we use global state or collision system)
    // We will cheat and check in the main loop or pass player ref.
    // Actually, let's just make the Player check logic? 
    // Or simpler: The Player is managed by the Scene, so we can pass player Pos down?
    // Let's use a simple Global/Context or manual prop passing would be messy.
    // For MVP: Simple ref.

    // Changing approach: The SCENE manages the collection check roughly.

    if (!active) return null;

    return (
        <group ref={ref} position={position}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {type === 'code' && (
                    <mesh rotation={[0.5, 0.5, 0]}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
                    </mesh>
                )}
                {type === 'art' && (
                    <mesh>
                        <torusGeometry args={[0.3, 0.1, 16, 32]} />
                        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
                    </mesh>
                )}
                {type === 'lang' && (
                    <mesh>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
                    </mesh>
                )}
            </Float>
            {/* Glow */}
            <pointLight distance={3} intensity={2} color={color} />
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
            // Distance check
            const dx = playerPos.x - item.pos[0];
            const dz = playerPos.z - item.pos[2];
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 1.5) {
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
    const playerRef = useRef(); // We need to access player ref from Scene
    const [score, setScore] = useState(0);

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffe4e1', overflow: 'hidden' }}>
            {/* HUD */}
            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10,
                fontFamily: 'Exo 2', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>DREAMSCAPE</div>
                <div>Collected: {score} / 5</div>
            </div>

            <Canvas shadows camera={{ position: [0, 5, 12], fov: 60 }}>
                {/* Fog */}
                <fog attach="fog" args={['#eecbf2', 10, 80]} />

                {/* Lighting */}
                <ambientLight intensity={0.8} color="#ffe4e1" />
                <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fff" />

                <Sky sunPosition={[100, 10, 100]} turbidity={0.5} rayleigh={0.8} />
                <Environment preset="sunset" background={false} />

                {/* Sparkling Particles */}
                <Sparkles count={100} scale={40} size={5} speed={0.4} opacity={0.5} color="#fff" />

                {/* Player - Pass ref so we can track it */}
                <Player ref={playerRef} position={[0, 0, 8]} />

                {/* Collectibles Logic */}
                <CollectiblesManager playerRef={playerRef} setScore={setScore} />

                <DreamFloor />

                {/* Gallery Building */}
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
