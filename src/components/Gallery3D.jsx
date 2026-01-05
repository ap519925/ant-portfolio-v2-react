import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Html, Image as DreiImage } from '@react-three/drei';
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

// --- SLIDESHOW (City View) ---
const SlideshowScreen = ({ images, position, rotation, scale }) => {
    const [index, setIndex] = useState(0);
    const activeImage = (images && images.length > 0) ? images[index] : '/assets/alogo.png';
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

const ProjectZone = ({ position, project, onEnter }) => {
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
        <group position={position} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={(e) => { e.stopPropagation(); onEnter(project); }}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[4, 5, 32]} />
                <meshBasicMaterial color={color} opacity={0.6} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                <ringGeometry args={[5.2, 5.5, 32]} />
                <meshBasicMaterial color="white" opacity={hovered ? 1 : 0.3} transparent />
            </mesh>

            <Html position={[0, 8, 0]} center transform sprite zIndexRange={[100, 0]}>
                <div style={{
                    color: color, fontSize: '32px', fontWeight: 'bold', fontFamily: 'sans-serif',
                    textShadow: '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff',
                    pointerEvents: 'none', whiteSpace: 'nowrap', textTransform: 'uppercase'
                }}>
                    {project.title}
                </div>
            </Html>

            {renderGeometry()}
        </group>
    );
};

const Village = ({ onEnterProject }) => {
    // Random City Layout Generator
    const layout = useMemo(() => {
        const items = [];
        const usedPositions = [];
        const MIN_DIST = 25; // Minimum distance between buildings
        const RANGE = 90; // Spread range (-90 to 90)

        // 1. Map ALL Projects
        projects.forEach((p) => {
            let pos;
            let attempts = 0;
            while (!pos && attempts < 100) {
                const x = (Math.random() - 0.5) * 2 * RANGE;
                const z = (Math.random() - 0.5) * 2 * RANGE;

                // Avoid Center (Start Zone)
                if (Math.hypot(x, z) < 15) { attempts++; continue; }

                // Check distance
                if (usedPositions.every(u => Math.hypot(u[0] - x, u[1] - z) > MIN_DIST)) {
                    pos = [x, 0, z];
                }
                attempts++;
            }
            // Fallback grid if random fails
            if (!pos) {
                const angle = (usedPositions.length / projects.length) * Math.PI * 2;
                const radius = 60 + (usedPositions.length * 5);
                pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
            }

            usedPositions.push(pos);
            items.push({ type: 'project', data: p, pos });
        });

        // 2. Add Decorative Buildings
        for (let i = 0; i < 30; i++) {
            let pos;
            let attempts = 0;
            while (!pos && attempts < 50) {
                const x = (Math.random() - 0.5) * 2 * RANGE;
                const z = (Math.random() - 0.5) * 2 * RANGE;
                if (Math.hypot(x, z) < 15) { attempts++; continue; }
                if (usedPositions.every(u => Math.hypot(u[0] - x, u[1] - z) > 10)) { // Smaller buffer for deco
                    pos = [x, 0, z];
                }
                attempts++;
            }
            if (pos) {
                usedPositions.push(pos);
                items.push({ type: 'deco', pos, scale: 0.5 + Math.random(), height: 5 + Math.random() * 10 });
            }
        }

        return items;
    }, []);

    return (
        <group>
            {/* Roads */}
            <Road position={[0, 0, 0]} length={250} width={10} />
            <Road position={[0, 0, 0]} rotation={Math.PI / 2} length={250} width={10} />

            {/* Start Circle */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[12, 32]} />
                <meshStandardMaterial color="#e0c0ff" />
            </mesh>

            {/* Render Items */}
            {layout.map((item, i) => {
                if (item.type === 'project') {
                    return <ProjectZone key={item.data.id} position={item.pos} project={item.data} onEnter={onEnterProject} />;
                } else {
                    return (
                        <group key={'deco' + i} position={item.pos}>
                            <mesh position={[0, item.height / 2, 0]}>
                                <boxGeometry args={[item.scale * 3, item.height, item.scale * 3]} />
                                <meshStandardMaterial color="#eee" />
                            </mesh>
                            <mesh position={[0, item.height + item.scale, 0]} rotation={[0, Math.PI / 4, 0]}>
                                <coneGeometry args={[item.scale * 2, item.scale * 2, 4]} />
                                <meshStandardMaterial color={`hsl(${Math.random() * 360}, 60%, 80%)`} />
                            </mesh>
                        </group>
                    );
                }
            })}
        </group>
    );
};

const FullScreenGallery = ({ images, initialIndex = 0, onClose }) => {
    // ... (Same as before)
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

// Ball Thrower Logic Component (Inside Canvas)
const BallThrower = ({ setBalls, playerRef }) => {
    const { camera } = useThree();
    useEffect(() => {
        const handleDown = (e) => {
            if (e.key.toLowerCase() === 'f') {
                if (playerRef.current) {
                    const startPos = playerRef.current.position ? playerRef.current.position.clone() : new THREE.Vector3(0, 0, 0);
                    startPos.y += 1.5; // From head/shoulder

                    const dir = new THREE.Vector3();
                    camera.getWorldDirection(dir);

                    const vel = dir.multiplyScalar(25); // Speed
                    vel.y += 5; // Slight arc up

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

const GameLogic = ({ playerRef, collectedIds, setCollectedIds, totalBucks, setDiscoMode }) => {
    // ... (Keep existing logic)
    const BEAR_BUCK_LOCATIONS = [
        [0, 2, 0], [20, 2, 20], [-20, 2, -20], [30, 2, -10], [-10, 2, 30]
    ];
    // Need to export/move locations to be accessible? 
    // I'll redefine them inside or move to constants. 
    // To match previous use, I will redefine here or pass them.
    // The previous implementation defined them outside. I need to be careful.
    return null;
};

// --- MAIN COMPONENT ---
const GalleryScene = () => {
    const navigate = useNavigate();
    const playerRef = useRef();
    const audioRef = useRef(null);
    const [activeProject, setActiveProject] = useState(null);
    const [galleryState, setGalleryState] = useState({ isOpen: false, index: 0 });
    const [isMuted, setIsMuted] = useState(false);

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

    // ... Audio Effects (Same as Step 557) ...
    // Audio Mute Listener
    useEffect(() => {
        if (audioRef.current) audioRef.current.muted = isMuted;
    }, [isMuted]);

    // Audio Player Logic
    useEffect(() => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        if (currentDance && currentDance.audio) {
            const audio = new Audio(currentDance.audio);
            audio.loop = true; audio.volume = 0.4; audio.muted = isMuted;
            audio.play().catch(e => console.warn("Audio play blocked:", e));
            audioRef.current = audio;
        }
    }, [currentDance]);

    // Toggle Dance Menu
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

                    {/* Dance Menu (Same as Step 557) */}
                    {showDanceMenu && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.9)', padding: '20px', borderRadius: '20px',
                            border: '2px solid #ff00ff', zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '10px',
                            minWidth: '300px', textAlign: 'center'
                        }}>
                            <div style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px', textTransform: 'uppercase', borderBottom: '1px solid #ff00ff', paddingBottom: '10px' }}>Choose Your Vibe</div>
                            <button onClick={() => { setCurrentDance({ id: 'dance1', name: 'Boom Dance', file: '/assets/animations/Meshy_AI_Animation_Boom_Dance_withSkin.glb', audio: '/assets/music/bass.mp3' }); setShowDanceMenu(false); }} style={{ padding: '12px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>Boom Dance</button>
                            <button onClick={() => { setCurrentDance({ id: 'dance3', name: 'Gangnam Style', file: '/assets/animations/Meshy_AI_Animation_Gangnam_Groove_withSkin.glb', audio: '/assets/music/gangnam.mp3' }); setShowDanceMenu(false); }} style={{ padding: '12px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>Gangnam Style</button>
                            <button onClick={() => { setCurrentDance(null); setShowDanceMenu(false); }} style={{ padding: '12px', background: '#333', border: '1px solid #888', color: '#ccc', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>STOP DANCING</button>
                        </div>
                    )}
                </>
            )}

            <MobileControls />

            <div style={{ position: 'absolute', bottom: 30, left: 30, color: 'rgba(100,100,100,0.8)', zIndex: 10, fontFamily: 'Exo 2', pointerEvents: 'none' }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{activeProject ? activeProject.title : "PORTFOLIO CITY"}</div>
            </div>

            <Canvas camera={{ position: [0, 10, 20], fov: 60 }} gl={{ antialias: true }}>
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
                                    <ambientLight intensity={1.0} color="#fff" />
                                    <directionalLight position={[20, 50, 20]} intensity={1.5} color="#fff" />
                                    <Sparkles count={100} scale={100} size={8} speed={0.4} opacity={0.5} color="#fff" />
                                </>
                            )}

                            <Player ref={playerRef} position={[0, 0, 8]} isDancing={!!currentDance} danceUrl={currentDance?.file} />
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

                            {/* Render Tennis Balls */}
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
                        </>
                    ) : (
                        <>
                            <color attach="background" args={['#222']} />
                            <ProjectInterior project={activeProject} onExit={() => setActiveProject(null)} onImageClick={(idx) => setGalleryState({ isOpen: true, index: idx })} />
                        </>
                    )}
                </Suspense>
            </Canvas>

            <button onClick={() => setIsMuted(!isMuted)} style={{ position: 'absolute', top: 20, right: 100, zIndex: 20, padding: '10px', background: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

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
