import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import * as THREE from 'three';

// --- VISUAL ASSETS ---
const Wall = (props) => (
    <mesh {...props}>
        <boxGeometry args={[props.width, props.height, 0.5]} />
        <meshStandardMaterial color="#fff0f5" />
    </mesh>
);

const DreamFloor = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#eecbf2" />
        <gridHelper args={[500, 50, '#ffffff', '#eecbf2']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
    </mesh>
);

// --- PROCEDURAL PROJECT ZONES (HTML LABELS) ---
const ProjectZone = ({ position, color, title, description, icon }) => {
    const [hovered, setHover] = useState(false);
    return (
        <group position={position}>
            {/* Title Label (HTML) */}
            <Html position={[0, 4, 0]} center transform sprite zIndexRange={[100, 0]}>
                <div style={{
                    color: '#a855f7', fontSize: '24px', fontWeight: 'bold', fontFamily: 'sans-serif',
                    textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                    pointerEvents: 'none', whiteSpace: 'nowrap'
                }}>
                    {title}
                </div>
            </Html>

            <mesh position={[0, 1.5, 0]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setHover(!hovered)}>
                <boxGeometry args={[3, 3, 3]} />
                <meshStandardMaterial color={hovered ? '#d8b4fe' : color} />
            </mesh>
            <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[2.5, 2, 4]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Info Card */}
            {hovered && (
                <Html position={[0, 2, 2]} center zIndexRange={[100, 0]}>
                    <div style={{
                        background: 'rgba(255,255,255,0.95)', padding: '15px', borderRadius: '10px',
                        border: '2px solid #a855f7', width: '200px', textAlign: 'center', pointerEvents: 'none'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '5px' }}>{icon}</div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{title}</h4>
                        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>{description}</p>
                    </div>
                </Html>
            )}
        </group>
    );
};

const Village = () => {
    const houses = useMemo(() => {
        const h = [];
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const r = 25 + Math.random() * 5;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            if (Math.abs(x) < 10 || Math.abs(z) < 10) continue;
            h.push(
                <group key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
                    <mesh position={[0, 1, 0]}><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color="#fff" /></mesh>
                    <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.8, 1.5, 4]} /><meshStandardMaterial color="#ffdac1" /></mesh>
                </group>
            );
        }
        return h;
    }, []);

    return (
        <group>
            {houses}
            <ProjectZone position={[-15, 0, -5]} color="#88ccff" title="E-COMMERCE" description="A full-stack shopping platform with Stripe integration." icon="🛒" />
            <ProjectZone position={[15, 0, -5]} color="#ff88cc" title="SOCIAL APP" description="Real-time chat and media sharing platform." icon="💬" />
            <ProjectZone position={[0, 0, -20]} color="#88ffcc" title="DATA VIZ" description="Interactive dashboards for complex datasets." icon="📊" />
        </group>
    );
};

// --- ROBOT GUIDE ---
const RobotDog = () => {
    const group = useRef();
    useFrame((state) => {
        if (group.current) {
            group.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
            const tail = group.current.getObjectByName("tail");
            if (tail) tail.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.2;
        }
    });
    return (
        <group ref={group}>
            <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.4, 0.4, 0.6]} /><meshStandardMaterial color="#a855f7" /></mesh>
            <mesh position={[0, 0.7, 0.4]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color="#ddd" /></mesh>
            <mesh position={[0.15, 0.9, 0.4]} rotation={[0, 0, -0.2]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#a855f7" /></mesh>
            <mesh position={[-0.15, 0.9, 0.4]} rotation={[0, 0, 0.2]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#a855f7" /></mesh>
            <mesh name="tail" position={[0, 0.6, -0.3]}><boxGeometry args={[0.1, 0.1, 0.4]} /><meshStandardMaterial color="#a855f7" /></mesh>
            <mesh position={[0.15, 0.2, 0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
            <mesh position={[-0.15, 0.2, 0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
            <mesh position={[0.15, 0.2, -0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
            <mesh position={[-0.15, 0.2, -0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
        </group>
    );
};

const DogGuide = ({ active, playerPosition }) => {
    const group = useRef();
    const [chatStep, setChatStep] = useState(0);

    useEffect(() => {
        if (active && group.current && playerPosition) {
            group.current.position.set(playerPosition.x + 2, 0, playerPosition.z + 2);
            group.current.lookAt(playerPosition.x, 0, playerPosition.z);
        }
    }, [active, playerPosition]);

    if (!active) return null;

    return (
        <group ref={group}>
            <RobotDog />
            <Html position={[1.8, 1.5, 0]} center>
                <div style={{
                    background: 'rgba(255,255,255,0.95)', padding: '15px', borderRadius: '15px 15px 15px 0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '220px', textAlign: 'center',
                    fontFamily: 'sans-serif', border: '2px solid #a855f7', pointerEvents: 'auto'
                }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#a855f7' }}>🤖 Robo-Dog Guide</h4>
                    {chatStep === 0 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#333' }}>Woof! Need help?</p>
                            <button onClick={() => setChatStep(1)} style={btnStyle}>Who is Anthony?</button>
                            <button onClick={() => setChatStep(2)} style={btnStyle}>What can I do?</button>
                            <button onClick={() => setChatStep(3)} style={btnStyle}>Contact</button>
                        </>
                    )}
                    {chatStep === 1 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#333' }}>Anthony is a creative developer who loves 3D web tech!</p>
                            <button onClick={() => setChatStep(0)} style={btnStyle}>Back</button>
                        </>
                    )}
                    {chatStep === 2 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#333' }}>Jump with Space! Collect floating items! Explore the Village!</p>
                            <button onClick={() => setChatStep(0)} style={btnStyle}>Back</button>
                        </>
                    )}
                    {chatStep === 3 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#333' }}>anthony@example.com</p>
                            <button onClick={() => setChatStep(0)} style={btnStyle}>Back</button>
                        </>
                    )}
                </div>
            </Html>
        </group>
    );
};

const btnStyle = {
    display: 'block', width: '100%', margin: '5px 0', padding: '8px',
    background: '#a855f7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};

const hudBtn = {
    padding: '8px 15px', background: 'rgba(255,255,255,0.8)', border: '1px solid #aaa',
    borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

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
                    <mesh rotation={[0.5, 0.5, 0]}><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="lime" /></mesh>
                )}
                {type === 'art' && (
                    <mesh><torusGeometry args={[0.3, 0.1, 16, 32]} /><meshStandardMaterial color="magenta" /></mesh>
                )}
                {type === 'lang' && (
                    <mesh><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color="cyan" /></mesh>
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
    const [dogActive, setDogActive] = useState(false);
    const [playerPosForDog, setPlayerPosForDog] = useState(new THREE.Vector3(0, 0, 0));

    const handleSummonDog = () => {
        if (playerRef.current) setPlayerPosForDog(playerRef.current.position.clone());
        setDogActive(true);
    };

    const teleportTo = (x, z) => {
        if (playerRef.current) {
            playerRef.current.position.set(x, 0.5, z);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffe4e1', overflow: 'hidden' }}>
            {/* HUD - FAST TRAVEL */}
            <div style={{
                position: 'absolute', top: 20, left: 20, zIndex: 10,
                display: 'flex', gap: '10px'
            }}>
                <button onClick={() => teleportTo(0, 8)} style={hudBtn}>🏠 Base</button>
                <button onClick={() => teleportTo(-15, -5)} style={hudBtn}>🛒 Shop</button>
                <button onClick={() => teleportTo(15, -5)} style={hudBtn}>💬 Social</button>
                <button onClick={() => teleportTo(0, -20)} style={hudBtn}>📊 Data</button>
            </div>

            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10,
                fontFamily: 'Exo 2', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>PORTFOLIO WORLD</div>
                <div>Collected: {score}</div>
            </div>

            {!dogActive && (
                <button
                    onClick={handleSummonDog}
                    style={{
                        position: 'absolute', bottom: 30, right: 30, zIndex: 50,
                        padding: '15px 25px', background: '#a855f7', color: 'white',
                        border: 'none', borderRadius: '50px', cursor: 'pointer',
                        fontWeight: 'bold', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}
                >
                    <span style={{ fontSize: '20px' }}>🐶</span> Ask Guide
                </button>
            )}

            <Canvas camera={{ position: [0, 5, 12], fov: 60 }} gl={{ antialias: true }}>
                <color attach="background" args={['#ffe4e1']} />
                <ambientLight intensity={1.0} color="#fff" />
                <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fff" />
                <Sparkles count={50} scale={40} size={5} speed={0.4} opacity={0.5} color="#fff" />

                <Player ref={playerRef} position={[0, 0, 8]} />
                <CollectiblesManager playerRef={playerRef} setScore={setScore} />
                <DreamFloor />

                <Village />

                <DogGuide active={dogActive} playerPosition={playerPosForDog} />

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
