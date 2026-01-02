import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, useGLTF, Html, useAnimations } from '@react-three/drei';
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

// --- PROCEDURAL HOUSES ---
const House = ({ position, rotation }) => {
    const color = useMemo(() => ['#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'][Math.floor(Math.random() * 5)], []);
    return (
        <group position={position} rotation={rotation}>
            <mesh position={[0, 1, 0]}><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color="#fff" /></mesh>
            <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.8, 1.5, 4]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0, 0.75, 1.01]}><planeGeometry args={[0.8, 1.5]} /><meshStandardMaterial color="#333" /></mesh>
        </group>
    );
};
const Village = () => {
    const houses = useMemo(() => {
        const h = [];
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const r = 20 + Math.random() * 10;
            h.push(<House key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} rotation={[0, -angle + Math.PI / 2, 0]} />);
        }
        return h;
    }, []);
    return <group>{houses}</group>;
};

// --- DOG GUIDE NPC ---
const DOG_MODEL = '/assets/dog-suit-opt.glb'; // 2.2MB Version

const DogGuide = ({ active, playerPosition }) => {
    const group = useRef();
    const { scene, animations } = useGLTF(DOG_MODEL);
    const { actions } = useAnimations(animations, group);
    const [chatStep, setChatStep] = useState(0);

    // Initial Spawn Logic
    useEffect(() => {
        if (active && group.current && playerPosition) {
            // Teleport in front of player
            // Simplified: Just 2 units Z+ for now, ideally calc forward vector
            group.current.position.set(playerPosition.x + 2, 0, playerPosition.z + 2);
            group.current.lookAt(playerPosition.x, 0, playerPosition.z);

            // Play idle/wave animation if exists
            if (actions && actions[Object.keys(actions)[0]]) {
                actions[Object.keys(actions)[0]].play();
            }
        }
    }, [active, playerPosition, actions]);

    if (!active) return null;

    return (
        <group ref={group}>
            <primitive object={scene} scale={1.2} />
            <Html position={[0, 2.5, 0]} center>
                <div style={{
                    background: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '15px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '200px', textAlign: 'center',
                    fontFamily: 'sans-serif', border: '2px solid #a855f7'
                }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#a855f7' }}>🐶 Sir Barks-a-Lot</h4>
                    {chatStep === 0 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>Hello! I am your guide. How can I help?</p>
                            <button onClick={() => setChatStep(1)} style={btnStyle}>About Anthony</button>
                            <button onClick={() => setChatStep(2)} style={btnStyle}>View Projects</button>
                            <button onClick={() => setChatStep(3)} style={btnStyle}>Contact Info</button>
                        </>
                    )}
                    {chatStep === 1 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>Anthony is a Full Stack Developer specializing in React, Drupal, and 3D Web Experiences!</p>
                            <button onClick={() => setChatStep(0)} style={btnStyle}>Back</button>
                        </>
                    )}
                    {chatStep === 2 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>Explore the gallery walls to see the projects interactively!</p>
                            <button onClick={() => setChatStep(0)} style={btnStyle}>Back</button>
                        </>
                    )}
                    {chatStep === 3 && (
                        <>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>Email: anthony@example.com</p>
                            <button onClick={() => setChatStep(0)} style={btnStyle}>Back</button>
                        </>
                    )}
                </div>
            </Html>
        </group>
    );
};

const btnStyle = {
    display: 'block', width: '100%', margin: '5px 0', padding: '5px',
    background: '#a855f7', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
};

// ... Collectibles (Same as before) ...
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
        if (playerRef.current) {
            setPlayerPosForDog(playerRef.current.position.clone());
        }
        setDogActive(true);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffe4e1', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10,
                fontFamily: 'Exo 2', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>VILLAGE MODE</div>
                <div>Collected: {score}</div>
            </div>

            {/* SUMMON DOG BUTTON */}
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

                {/* Dog Guide (Only renders when summoned) */}
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
