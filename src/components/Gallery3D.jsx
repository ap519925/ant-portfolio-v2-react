import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Html, Image as DreiImage, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import * as THREE from 'three';
import { projects } from '../data/projects';
import SpotifyWidget3D from './SpotifyWidget3D';
import ProjectInterior from './ProjectInterior';
import BearBuck from './BearBuck';
import TennisBall from './TennisBall';
import MobileControls from './MobileControls';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

// --- ASSETS & HELPERS ---
const DreamFloor = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#eecbf2" />
        <gridHelper args={[500, 50, '#ffffff', '#eecbf2']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
        <fog attach="fog" args={['#ffe4e1', 20, 100]} />
    </mesh>
);

const Road = ({ position, rotation, length, width = 8 }) => (
    <mesh rotation={[-Math.PI / 2, 0, rotation || 0]} position={[position[0], 0.01, position[2]]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#d8b4fe" roughness={0.8} />
    </mesh>
);

// --- BUILDING COMPONENTS ---

const ComplexBuilding = ({ project, hovered }) => {
    const isWeb = project.category.includes('Web');
    const isApp = project.category.includes('App') || project.category.includes('Desktop');
    const height = isWeb ? 7 : (isApp ? 8 : 6);
    const width = 3.5;
    const color = project.color || '#888';

    // Different geometry based on type - SCALED UP & DISTINCT
    const renderStructure = () => {
        if (isApp) {
            // "Tech Tower" - Sleek, tall, glass
            const h = height * 1.5;
            const w = width * 1.5;
            return (
                <group>
                    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                        <boxGeometry args={[w, h, w]} />
                        <meshStandardMaterial color={color} metalness={0.9} roughness={0.0} />
                    </mesh>
                    {/* Glass Panels */}
                    <mesh position={[0, h / 2, w / 2 + 0.1]}>
                        <planeGeometry args={[w * 0.9, h * 0.9]} />
                        <meshStandardMaterial color="#aaf" emissive="#5080ff" emissiveIntensity={hovered ? 0.5 : 0.1} toneMapped={false} transparent opacity={0.6} />
                    </mesh>
                    {/* Top Antenna */}
                    <mesh position={[0, h, 0]}>
                        <cylinderGeometry args={[0.2, 0.5, 3, 8]} />
                        <meshStandardMaterial color="#888" />
                    </mesh>
                </group>
            );
        } else if (isWeb) {
            // "Web Citadel" - Massive, cylindrical, layered
            const h = height * 1.3;
            const w = width * 1.8;
            return (
                <group>
                    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[w, w * 0.8, h, 8]} />
                        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
                    </mesh>
                    {/* Glowing Rings */}
                    <mesh position={[0, h * 0.3, 0]} rotation={[0, 0, 0]}>
                        <torusGeometry args={[w * 1.05, 0.3, 16, 32]} />
                        <meshStandardMaterial color={hovered ? "#fff" : color} emissive={color} emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[0, h * 0.7, 0]} rotation={[0, 0, 0]}>
                        <torusGeometry args={[w * 1.05, 0.3, 16, 32]} />
                        <meshStandardMaterial color={hovered ? "#fff" : color} emissive={color} emissiveIntensity={0.5} />
                    </mesh>
                </group>
            );
        } else {
            // "Creative Spire" - Twisted, artistic
            const h = height * 1.4;
            const w = width * 1.6;
            return (
                <group>
                    {/* Base */}
                    <mesh position={[0, h / 4, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[w * 0.8, w, h / 2, 5]} />
                        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
                    </mesh>
                    {/* Top Twist */}
                    <mesh position={[0, h * 0.75, 0]} rotation={[0, Math.PI / 4, 0]}>
                        <coneGeometry args={[w * 0.8, h / 2, 5]} />
                        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
                    </mesh>
                    {/* Wireframe Cage */}
                    <mesh position={[0, h / 2, 0]}>
                        <icosahedronGeometry args={[w * 1.2, 0]} />
                        <meshStandardMaterial color="#fff" wireframe />
                    </mesh>
                </group>
            );
        }
    };

    return (
        <group>
            {renderStructure()}

            {/* Floating Logo Billboard - Only visible on hover */}
            {hovered && (
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, height + 4, 0]}>
                    <group scale={1.8}>
                        {/* Frame */}
                        <mesh>
                            <boxGeometry args={[3.2, 2.2, 0.2]} />
                            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
                        </mesh>
                        {/* Front Image */}
                        <DreiImage url={project.image} position={[0, 0, 0.11]} scale={[3, 2]} />
                        {/* Back Image (optional, maybe logo?) */}
                        <DreiImage url={project.image} position={[0, 0, -0.11]} scale={[3, 2]} rotation={[0, Math.PI, 0]} />

                        {/* Glow effect behind */}
                        <mesh position={[0, 0, -0.2]}>
                            <planeGeometry args={[3.5, 2.5]} />
                            <meshBasicMaterial color={color} transparent opacity={0.3} />
                        </mesh>
                    </group>
                </Float>
            )}
        </group>
    );
};


const ProjectZone = ({ position, project, onEnter }) => {
    const [hovered, setHover] = useState(false);
    const isWeb = project.category.includes('Web');
    const isApp = project.category.includes('App') || project.category.includes('Desktop');
    const height = isWeb ? 7 : (isApp ? 8 : 6);
    const color = project.color || '#888';

    return (
        <group position={position} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={(e) => { e.stopPropagation(); onEnter(project); }}>
            {/* Ground Interaction Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[4, 5, 32]} />
                <meshBasicMaterial color={project.color || 'white'} opacity={0.6} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                <ringGeometry args={[5.2, 5.5, 32]} />
                <meshBasicMaterial color="white" opacity={hovered ? 1 : 0.3} transparent />
            </mesh>

            {/* Title Label - Only visible on hover */}
            {hovered && (
                <Html position={[0, 14, 0]} center transform sprite zIndexRange={[100, 0]} distanceFactor={30}>
                    <div style={{
                        color: project.color || '#fff',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        fontFamily: 'Exo 2, sans-serif',
                        textShadow: '0 0 10px rgba(0,0,0,0.8)',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '12px 24px',
                        borderRadius: '16px',
                        border: `3px solid ${project.color || '#fff'}`,
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        boxShadow: `0 0 20px ${project.color || '#fff'}`
                    }}>
                        {project.title}
                        <div style={{ fontSize: '0.6em', color: '#ccc', marginTop: '4px' }}>{project.category}</div>
                    </div>
                </Html>
            )}

            {/* The Building */}
            <ComplexBuilding project={project} hovered={hovered} />

            {/* Floating Diamond Indicator */}
            <Diamond position={[0, height + 8, 0]} color={color} />
        </group>
    );
};

const Diamond = ({ position, color }) => (
    <Float speed={2} rotationIntensity={1} floatIntensity={1} position={position}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe={false} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Inner wireframe for cool effect */}
        <mesh rotation={[0, 0, Math.PI / 4]} scale={1.1}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="white" wireframe transparent opacity={0.3} />
        </mesh>
    </Float>
);

const Village = ({ onEnterProject }) => {
    // Random City Layout Generator (Memoized for stability)
    const layout = useMemo(() => {
        const items = [];
        const usedPositions = [];
        const MIN_DIST = 70; // Increased to 70 for massive spacing
        const RANGE = 200; // Increased to 200 for larger map

        // 1. Map ALL Projects
        projects.forEach((p) => {
            let pos;
            let attempts = 0;
            while (!pos && attempts < 100) {
                const x = (Math.random() - 0.5) * 2 * RANGE;
                const z = (Math.random() - 0.5) * 2 * RANGE;
                // Keep clear of center spawn
                if (Math.hypot(x, z) < 40) { attempts++; continue; }
                // Check collision
                if (usedPositions.every(u => Math.hypot(u[0] - x, u[1] - z) > MIN_DIST)) {
                    pos = [x, 0, z];
                }
                attempts++;
            }
            // Fallback
            if (!pos) {
                const angle = (usedPositions.length / projects.length) * Math.PI * 2;
                const radius = 120 + (usedPositions.length * 15);
                pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
            }
            usedPositions.push(pos);
            items.push({ type: 'project', data: p, pos });
        });

        // 2. Add Decorative Buildings (Skyscrapers)
        for (let i = 0; i < 40; i++) {
            let pos;
            let attempts = 0;
            while (!pos && attempts < 50) {
                const x = (Math.random() - 0.5) * 2 * RANGE;
                const z = (Math.random() - 0.5) * 2 * RANGE;
                if (Math.hypot(x, z) < 40) { attempts++; continue; }
                if (usedPositions.every(u => Math.hypot(u[0] - x, u[1] - z) > 30)) {
                    pos = [x, 0, z];
                }
                attempts++;
            }
            if (pos) {
                usedPositions.push(pos);
                items.push({ type: 'deco', pos, scale: 0.5 + Math.random(), height: 10 + Math.random() * 20 });
            }
        }
        return items;
    }, []);

    return (
        <group>
            {/* Roads */}
            <Road position={[0, 0, 0]} length={500} width={15} />
            <Road position={[0, 0, 0]} rotation={Math.PI / 2} length={500} width={15} />

            {/* Center Plaza */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[15, 32]} />
                <meshStandardMaterial color="#e0c0ff" roughness={0.4} />
            </mesh>

            {layout.map((item, i) => {
                if (item.type === 'project') {
                    return <ProjectZone key={item.data.id} position={item.pos} project={item.data} onEnter={onEnterProject} />;
                } else {
                    // Decorative Skyscrapers
                    return (
                        <group key={'deco' + i} position={item.pos}>
                            <mesh position={[0, item.height / 2, 0]} castShadow receiveShadow>
                                <boxGeometry args={[item.scale * 4, item.height, item.scale * 4]} />
                                <meshStandardMaterial color={i % 2 === 0 ? "#ddd" : "#ccc"} metalness={0.2} roughness={0.1} />
                            </mesh>
                            {/* Simple Windows */}
                            <mesh position={[0, item.height / 2, item.scale * 2 + 0.01]}>
                                <planeGeometry args={[item.scale * 3, item.height * 0.9]} />
                                <meshStandardMaterial color="#111" />
                            </mesh>
                            <mesh position={[0, item.height + item.scale, 0]} rotation={[0, Math.PI / 4, 0]}>
                                <coneGeometry args={[item.scale * 2, item.scale * 4, 4]} />
                                <meshStandardMaterial color={`hsl(${Math.random() * 360}, 40%, 70%)`} />
                            </mesh>
                        </group>
                    );
                }
            })}
        </group>
    );
};

const FullScreenGallery = ({ images, initialIndex = 0, onClose }) => {
    const [index, setIndex] = useState(initialIndex);
    const handleNext = (e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % images.length); };
    const handlePrev = (e) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + images.length) % images.length); };
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setIndex((prev) => (prev + 1) % images.length);
            if (e.key === 'ArrowLeft') setIndex((prev) => (prev - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, images.length]);

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
        }} onClick={onClose}>
            <button onClick={onClose} style={{ position: 'absolute', top: 30, right: 30, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={32} /></button>
            <div style={{ position: 'relative', maxWidth: '80%', maxHeight: '80%' }} onClick={(e) => e.stopPropagation()}>
                <img src={images[index]} alt="" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} />
                {images.length > 1 && (
                    <>
                        <button onClick={handlePrev} style={{ position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '48px', height: '48px', alignItems: 'center', justifyContent: 'center', color: 'white', border: 'none', cursor: 'pointer' }}><ChevronLeft size={24} /></button>
                        <button onClick={handleNext} style={{ position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '48px', height: '48px', alignItems: 'center', justifyContent: 'center', color: 'white', border: 'none', cursor: 'pointer' }}><ChevronRight size={24} /></button>
                    </>
                )}
            </div>
            <div style={{ marginTop: '20px', color: '#888', fontFamily: 'monospace' }}>{index + 1} / {images.length}</div>
        </div>
    );
};

const BallThrower = ({ setBalls, playerRef }) => {
    const { camera } = useThree();
    useEffect(() => {
        const handleDown = (e) => {
            if (e.key.toLowerCase() === 'f') {
                if (playerRef.current) {
                    const startPos = playerRef.current.position ? playerRef.current.position.clone() : new THREE.Vector3(0, 0, 0);
                    startPos.y += 1.5;

                    const dir = new THREE.Vector3();
                    camera.getWorldDirection(dir);

                    const vel = dir.multiplyScalar(25);
                    vel.y += 5;

                    const newBall = {
                        id: Date.now(),
                        pos: [startPos.x, startPos.y, startPos.z],
                        vel: [vel.x, vel.y, vel.z]
                    };
                    setBalls(prev => [...prev, newBall]);
                }
            }
        };
        window.addEventListener('keydown', handleDown);
        return () => window.removeEventListener('keydown', handleDown);
    }, [setBalls, playerRef, camera]);
    return null;
};

// FIX: GameLogic now accepts 'locations' prop to ensure synchronization with rendered coins.
const GameLogic = ({ playerRef, collectedIds, setCollectedIds, totalBucks, setDiscoMode, locations }) => {
    useFrame(() => {
        if (!playerRef.current || !locations) return;
        const playerPos = playerRef.current.position;

        locations.forEach((loc, index) => {
            if (collectedIds.includes(index)) return;
            const distance = playerPos.distanceTo(new THREE.Vector3(loc[0], loc[1], loc[2]));
            if (distance < 3) {
                setCollectedIds(prev => {
                    const newIds = [...prev, index];
                    if (newIds.length === totalBucks) {
                        setDiscoMode(true);
                    }
                    return newIds;
                });
            }
        });
    });
    return null;
};

const GalleryScene = () => {
    const navigate = useNavigate();
    const playerRef = useRef();
    const audioRef = useRef(null);
    const [activeProject, setActiveProject] = useState(null);
    const [galleryState, setGalleryState] = useState({ isOpen: false, index: 0 });

    // Audio State
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.4);

    // Game
    const [collectedBucks, setCollectedBucks] = useState([]);
    const [discoMode, setDiscoMode] = useState(false);
    const [currentDance, setCurrentDance] = useState(null);
    const [showDanceMenu, setShowDanceMenu] = useState(false);

    // Tennis Balls
    const [balls, setBalls] = useState([]);

    const BEAR_BUCK_LOCATIONS = useMemo(() => [
        [5, 2, 5], [20, 2, -20], [-25, 2, 10], [40, 2, 40], [-30, 2, -30]
    ], []);
    const totalBucks = BEAR_BUCK_LOCATIONS.length;

    // Audio Logic
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            audioRef.current.volume = volume;
        }
    }, [isMuted, volume]);

    useEffect(() => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        if (currentDance && currentDance.audio) {
            const audio = new Audio(currentDance.audio);
            audio.loop = true; audio.volume = volume; audio.muted = isMuted;
            audio.play().catch(e => console.warn("Audio play blocked:", e));
            audioRef.current = audio;
        }
    }, [currentDance]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'e' && discoMode) setShowDanceMenu(prev => !prev);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [discoMode]);

    const handlePickupBall = (id) => {
        setBalls(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: discoMode ? '#220033' : '#ffe4e1', overflow: 'hidden', transition: 'background 1s' }}>
            {/* Gallery Overlay */}
            {galleryState.isOpen && activeProject && (
                <FullScreenGallery images={activeProject.gallery && activeProject.gallery.length > 0 ? activeProject.gallery : [activeProject.image]} initialIndex={galleryState.index} onClose={() => setGalleryState(prev => ({ ...prev, isOpen: false }))} />
            )}

            {/* HUD */}
            {!activeProject && !galleryState.isOpen && (
                <>
                    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px' }}>
                            <b>Tip:</b> Click Buildings to Enter! <br />
                            <b>Tip:</b> Press 'F' to Throw Tennis Balls! 🎾
                        </div>
                    </div>

                    <div style={{ position: 'absolute', top: 90, left: 20, zIndex: 10, padding: '10px 15px', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', color: 'gold', fontWeight: 'bold', border: '2px solid gold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                        <span>🐶 Bear Bucks: {collectedBucks.length} / {totalBucks}</span>
                    </div>

                    {discoMode && (
                        <div style={{
                            position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
                            color: '#fff', fontSize: '3rem', fontWeight: 'bold', textShadow: '0 0 20px #ff00ff',
                            animation: 'pulse 0.5s infinite alternate', pointerEvents: 'none', zIndex: 5, textAlign: 'center'
                        }}>
                            <div>PARTY MODE UNLOCKED!</div>
                            <div style={{ fontSize: '1.5rem', marginTop: '10px', color: 'yellow' }}>PRESS 'E' TO OPEN DANCE MENU!</div>
                        </div>
                    )}

                    {showDanceMenu && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.9)', padding: '20px', borderRadius: '20px',
                            border: '2px solid #ff00ff', zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '10px',
                            minWidth: '300px', textAlign: 'center'
                        }}>
                            <div style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px', textTransform: 'uppercase', borderBottom: '1px solid #ff00ff', paddingBottom: '10px' }}>Choose Your Vibe</div>
                            <button onClick={() => { setCurrentDance({ id: 'dance1', name: 'Super Bass', file: '/assets/animations/super bass dance.glb', animationName: '0', audio: '/assets/music/bass.mp3' }); setShowDanceMenu(false); }} style={{ padding: '12px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>Super Bass</button>
                            <button onClick={() => { setCurrentDance({ id: 'dance3', name: 'Gangnam Style', file: '/assets/animations/gangnamstyle-dance.glb', animationName: '0', audio: '/assets/music/gangnam.mp3' }); setShowDanceMenu(false); }} style={{ padding: '12px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>Gangnam Style</button>
                            <button onClick={() => { setCurrentDance({ id: 'dance_ymca', name: 'YMCA', file: '/assets/animations/ymc-dance.glb', animationName: '0', audio: '/assets/music/ymca.mp3' }); setShowDanceMenu(false); }} style={{ padding: '12px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>YMCA</button>
                            <button onClick={() => { setCurrentDance({ id: 'dance_bubble', name: 'Bubble Pop', file: '/assets/animations/bubblepop-dance.glb', animationName: '0', audio: '/assets/music/bubble.mp3' }); setShowDanceMenu(false); }} style={{ padding: '12px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>Bubble Pop</button>
                            <button onClick={() => { setCurrentDance(null); setShowDanceMenu(false); }} style={{ padding: '12px', background: '#333', border: '1px solid #888', color: '#ccc', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>STOP DANCING</button>
                        </div>
                    )}
                </>
            )}

            <MobileControls />

            <div style={{ position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10, fontFamily: 'Exo 2', pointerEvents: 'none' }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{activeProject ? activeProject.title : "PORTFOLIO CITY"}</div>
            </div>

            <Canvas camera={{ position: [0, 10, 20], fov: 60 }} gl={{ antialias: true }} shadows>
                <Suspense fallback={<Html center>Loading...</Html>}>
                    {!activeProject ? (
                        <>
                            {discoMode ? (
                                <>
                                    <color attach="background" args={['#220033']} />
                                    <ambientLight intensity={0.5} color="#ff00ff" />
                                    <pointLight position={[0, 20, 0]} intensity={2} color="#00ffff" />
                                    <Sparkles count={500} scale={150} size={15} speed={2} opacity={1} color="cyan" />
                                </>
                            ) : (
                                <>
                                    <color attach="background" args={['#ffe4e1']} />
                                    <ambientLight intensity={0.6} color="#fff" />
                                    <directionalLight position={[20, 50, 20]} intensity={2.0} color="#fff" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
                                    <Sparkles count={100} scale={100} size={8} speed={0.4} opacity={0.5} color="#fff" />
                                </>
                            )}

                            <Player ref={playerRef} position={[0, 0, 8]} isDancing={!!currentDance} danceUrl={currentDance?.file} activeAnimationName={currentDance?.animationName} />
                            <DreamFloor />

                            <Village onEnterProject={setActiveProject} />

                            <SpotifyWidget3D position={[-12, 4, 12]} />

                            {BEAR_BUCK_LOCATIONS.map((pos, i) => (
                                <BearBuck key={i} position={pos} isCollected={collectedBucks.includes(i)}
                                    onCollect={() => {
                                        if (!collectedBucks.includes(i)) {
                                            setCollectedBucks(prev => {
                                                const newIds = [...prev, i];
                                                if (newIds.length === totalBucks) setDiscoMode(true);
                                                return newIds;
                                            });
                                        }
                                    }}
                                />
                            ))}

                            {balls.map(ball => (
                                <TennisBall
                                    key={ball.id}
                                    position={ball.pos}
                                    velocity={ball.vel}
                                    playerRef={playerRef}
                                    onPickup={() => handlePickupBall(ball.id)}
                                />
                            ))}

                            <BallThrower setBalls={setBalls} playerRef={playerRef} />

                            {/* Pass locations to GameLogic explicitly */}
                            <GameLogic
                                playerRef={playerRef}
                                collectedIds={collectedBucks}
                                setCollectedIds={setCollectedBucks}
                                totalBucks={totalBucks}
                                setDiscoMode={setDiscoMode}
                                locations={BEAR_BUCK_LOCATIONS}
                            />

                        </>
                    ) : (
                        <>
                            <color attach="background" args={['#222']} />
                            <ProjectInterior project={activeProject} onExit={() => setActiveProject(null)} onImageClick={(idx) => setGalleryState({ isOpen: true, index: idx })} />
                        </>
                    )}
                </Suspense>
            </Canvas>

            {/* Volume Control */}
            <div className="volume-control-container" style={{ position: 'absolute', top: 20, right: 100, zIndex: 20, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.5)', padding: '5px 15px', borderRadius: '30px', transition: 'width 0.3s' }}>
                <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex' }}>
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        if (parseFloat(e.target.value) > 0 && isMuted) setIsMuted(false);
                    }}
                    style={{ width: '80px', cursor: 'pointer' }}
                />
            </div>

            <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 20, right: 20, zIndex: 20, padding: '10px 20px', background: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                EXIT
            </button>

            <style>{`
                @keyframes pulse { from { opacity: 0.8; transform: translate(-50%, -50%) scale(1); } to { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } }
            `}</style>
        </div>
    );
};

export default GalleryScene;
