import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Html, Image as DreiImage } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import * as THREE from 'three';
import { projects } from '../data/projects';
import SpotifyWidget3D from './SpotifyWidget3D';

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
        <fog attach="fog" args={['#ffe4e1', 10, 80]} />
    </mesh>
);

const Road = ({ position, rotation, length, width = 8 }) => (
    <mesh rotation={[-Math.PI / 2, 0, rotation || 0]} position={[position[0], 0.01, position[2]]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#d8b4fe" roughness={0.8} />
    </mesh>
);

// --- SLIDESHOW (SAFE MODE) ---
const SlideshowScreen = ({ images, position, rotation, scale }) => {
    const [index, setIndex] = useState(0);
    const activeImage = (images && images.length > 0) ? images[index] : '/assets/stock-1.jpg';
    useEffect(() => {
        if (!images || images.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);
    return (
        <group position={position} rotation={rotation} scale={scale}>
            <DreiImage url={activeImage} transparent opacity={0.95} toneMapped={false} />
        </group>
    );
};

const ProjectZone = ({ position, project }) => {
    const [hovered, setHover] = useState(false);
    const color = project.color || '#888';

    const renderGeometry = () => {
        const gallery = (project.gallery && project.gallery.length > 0) ? project.gallery : (project.image ? [project.image] : []);
        if (project.category.includes('AI') || project.id === 'capframe') {
            return (
                <group>
                    <mesh position={[0, 1.5, 0]}><boxGeometry args={[4, 4, 4]} /><meshStandardMaterial color={hovered ? '#ff8da1' : color} metalness={0.8} roughness={0.2} /></mesh>
                    {gallery.length > 0 && <SlideshowScreen images={gallery} position={[0, 1.5, 2.05]} rotation={[0, 0, 0]} scale={[3.5, 2.5, 1]} />}
                </group>
            );
        } else if (project.category.includes('Web') || project.id === 'ibew-union') {
            return (
                <group>
                    <mesh position={[-1.5, 3, 0]}><boxGeometry args={[1.2, 6, 1.2]} /><meshStandardMaterial color={hovered ? '#4fa3ff' : color} /></mesh>
                    <mesh position={[1.5, 2.5, 0]}><boxGeometry args={[1.2, 5, 1.2]} /><meshStandardMaterial color={hovered ? '#4fa3ff' : color} /></mesh>
                    {gallery.length > 0 && <SlideshowScreen images={gallery} position={[0, 3, 0]} rotation={[0, 0, 0]} scale={[2.5, 1.8, 1]} />}
                </group>
            );
        } else if (project.category.includes('Mobile') || project.id === 'prk-nyc') {
            return (
                <group>
                    <mesh position={[0, 3, 0]}><boxGeometry args={[2.5, 5, 0.3]} /><meshStandardMaterial color="#333" /></mesh>
                    {gallery.length > 0 && <SlideshowScreen images={gallery} position={[0, 3, 0.16]} rotation={[0, 0, 0]} scale={[2.3, 4, 1]} />}
                </group>
            );
        } else {
            return (
                <group>
                    <mesh position={[-1.5, 2, 0]}><boxGeometry args={[1.2, 4, 1.2]} /><meshStandardMaterial color={color} /></mesh>
                    <mesh position={[0, 3, 0]}><boxGeometry args={[1.2, 6, 1.2]} /><meshStandardMaterial color={color} /></mesh>
                    <mesh position={[1.5, 4, 0]}><boxGeometry args={[1.2, 8, 1.2]} /><meshStandardMaterial color="#4caf50" /></mesh>
                    {gallery.length > 0 && <SlideshowScreen images={gallery} position={[0, 5, 1.5]} rotation={[0, 0, 0]} scale={[4, 2.5, 1]} />}
                </group>
            );
        }
    };

    return (
        <group position={position} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setHover(!hovered)}>
            {/* Larger Floor Platform */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[4, 5, 32]} />
                <meshBasicMaterial color={color} opacity={0.6} transparent />
            </mesh>
            <Html position={[0, 7, 0]} center transform sprite zIndexRange={[100, 0]}>
                <div style={{
                    color: color, fontSize: '32px', fontWeight: 'bold', fontFamily: 'sans-serif',
                    textShadow: '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff',
                    pointerEvents: 'none', whiteSpace: 'nowrap', textTransform: 'uppercase'
                }}>
                    {project.title}
                </div>
            </Html>
            {renderGeometry()}
            {hovered && (
                <Html position={[0, 3, 4]} center zIndexRange={[100, 0]}>
                    <div style={{
                        background: 'rgba(255,255,255,0.95)', padding: '20px', borderRadius: '15px',
                        border: `3px solid ${color}`, width: '280px', textAlign: 'center', pointerEvents: 'none',
                        boxShadow: `0 0 20px ${color}`
                    }}>
                        <h3 style={{ margin: '0 0 5px 0', color: color }}>{project.title}</h3>
                        <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '15px', background: color, color: 'white', fontSize: '12px', marginBottom: '10px' }}>{project.category}</div>
                        <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>{project.description}</p>
                    </div>
                </Html>
            )}
        </group>
    );
};

// ... Village, RobotDog, etc ...
const Village = () => {
    const capframe = projects.find(p => p.id === 'capframe');
    const ibew = projects.find(p => p.id === 'ibew-union');
    const prk = projects.find(p => p.id === 'prk-nyc');
    const bearish = projects.find(p => p.id === 'bearish-bulls');

    // Generate City Blocks (Quadrants)
    const buildings = useMemo(() => {
        const b = [];
        // Place decorative buildings in the 4 quadrants, away from roads
        // Quadrants: (+x, +z), (+x, -z), (-x, +z), (-x, -z)
        // Roads are at x=0 (width 8) and z=0 (width 8)

        for (let i = 0; i < 40; i++) {
            // Random quadrant
            const qx = Math.random() > 0.5 ? 1 : -1;
            const qz = Math.random() > 0.5 ? 1 : -1;

            // Pos
            const x = (10 + Math.random() * 40) * qx;
            const z = (10 + Math.random() * 40) * qz;

            const scale = 1 + Math.random() * 2;
            const height = 2 + Math.random() * 6;

            b.push(
                <group key={i} position={[x, 0, z]}>
                    <mesh position={[0, height / 2, 0]}>
                        <boxGeometry args={[scale * 2, height, scale * 2]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                    {/* Roof */}
                    <mesh position={[0, height + scale / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
                        <coneGeometry args={[scale * 1.5, scale, 4]} />
                        <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 80%)`} />
                    </mesh>
                </group>
            );
        }
        return b;
    }, []);

    return (
        <group>
            {/* CROSSROADS CITY LAYOUT */}
            <Road position={[0, 0, 0]} length={150} width={8} /> {/* North-South */}
            <Road position={[0, 0, 0]} rotation={Math.PI / 2} length={150} width={8} /> {/* East-West */}

            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[12, 32]} />
                <meshStandardMaterial color="#e0c0ff" />
            </mesh>

            {buildings}

            {/* ZONES spread out at ends of roads (Dis 50) */}
            {/* North (-Z) */}
            {prk && <ProjectZone position={[0, 0, -50]} project={prk} />}

            {/* South (+Z) */}
            {bearish && <ProjectZone position={[0, 0, 50]} project={bearish} />}

            {/* West (-X) */}
            {capframe && <ProjectZone position={[-50, 0, 0]} project={capframe} />}

            {/* East (+X) */}
            {ibew && <ProjectZone position={[50, 0, 0]} project={ibew} />}

        </group>
    );
};

// ... RobotDog, DogGuide (UNCHANGED) ...
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

const btnStyle = {
    display: 'block', width: '100%', margin: '5px 0', padding: '8px',
    background: '#a855f7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};

const hudBtn = {
    padding: '8px 15px', background: 'rgba(255,255,255,0.8)', border: '1px solid #aaa',
    borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
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
            <div style={{
                position: 'absolute', top: 20, left: 20, zIndex: 10,
                display: 'flex', gap: '10px'
            }}>
                <button onClick={() => teleportTo(0, 8)} style={hudBtn}>🏠 Base</button>
                <button onClick={() => teleportTo(-50, 0)} style={hudBtn}>🤖 Al</button> {/* Updated Coords */}
                <button onClick={() => teleportTo(50, 0)} style={hudBtn}>⚡ Web</button>
                <button onClick={() => teleportTo(0, -50)} style={hudBtn}>🚗 App</button>
                <button onClick={() => teleportTo(0, 50)} style={hudBtn}>📈 Fin</button>
            </div>

            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10,
                fontFamily: 'Exo 2', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>PORTFOLIO CITY</div>
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

            <Canvas camera={{ position: [0, 10, 20], fov: 60 }} gl={{ antialias: true }}>
                <Suspense fallback={<Html center>Loading City...</Html>}>
                    <color attach="background" args={['#ffe4e1']} />
                    <ambientLight intensity={1.0} color="#fff" />
                    <directionalLight position={[20, 50, 20]} intensity={1.5} color="#fff" />
                    <Sparkles count={100} scale={100} size={8} speed={0.4} opacity={0.5} color="#fff" />

                    <Player ref={playerRef} position={[0, 0, 8]} />
                    <CollectiblesManager playerRef={playerRef} setScore={setScore} />
                    <DreamFloor />

                    <Village />

                    {/* RESTORED SPOTIFY WIDGET */}
                    <SpotifyWidget3D position={[-12, 4, 12]} />

                    <DogGuide active={dogActive} playerPosition={playerPosForDog} />

                    <group position={[0, 0, 0]}>
                        {/* Removed Walls for Open City Feel */}
                    </group>
                </Suspense>
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
