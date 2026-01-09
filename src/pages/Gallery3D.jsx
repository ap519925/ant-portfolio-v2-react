import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import './ProjectPage.css'; // Shared styles for gallery
import { Float, Sparkles, Html, Image as DreiImage, Text, useGLTF, Clone, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from '../components/3d/Player';
import * as THREE from 'three';
import { projects } from '../data/projects';
import SpotifyWidget3D from '../components/3d/SpotifyWidget3D';
import ProjectInterior from '../components/3d/ProjectInterior';
import BearBuck from '../components/3d/BearBuck';
import TennisBall from '../components/3d/TennisBall';
import SunMoon from '../components/3d/SunMoon';
import InteractiveCrates from '../components/3d/InteractiveCrates';
import MobileControls from '../components/3d/MobileControls';
import { Rain, Snow } from '../components/3d/WeatherEffects';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

const BUILDING_MODELS = [
    '/assets/models/one_world_trade_center.glb',
    '/assets/models/empire_state_building.glb',
    '/assets/models/chrysler_building.glb',
    '/assets/models/free__la_tour_eiffel.glb',
    '/assets/models/shanghai_tower.glb',
    '/assets/models/free__burj_khalifa_dubai.glb',
    '/assets/models/lotte_world_tower.glb',
    '/assets/models/one_vanderbilt.glb',
    '/assets/models/petronas_twin_tower.glb',
    '/assets/models/willis_tower_-_sears_tower.glb'
];

// Preload models
BUILDING_MODELS.forEach(url => useGLTF.preload(url));

// --- HELPERS ---
const CityFloor = () => (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        {/* Main Asphalt */}
        <mesh>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
        {/* Grid Lines (Street Pattern) */}
        <gridHelper args={[1000, 50, '#555', '#333']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} />
        <fog attach="fog" args={['#050510', 20, 400]} />
    </group>
);

const Road = ({ position, rotation, length, width = 8 }) => (
    <mesh rotation={[-Math.PI / 2, 0, rotation || 0]} position={[position[0], 0.01, position[2]]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#d8b4fe" roughness={0.8} />
    </mesh>
);

// --- DAY/NIGHT & LIGHTING ---
const DayNightCycle = ({ time, weather, discoMode }) => {
    // time: 0=Dawn, 0.25=Noon, 0.5=Dusk, 0.75=Midnight
    // weather: 'clear', 'rain', 'clouds', 'snow'

    // Calculate ambient color based on time
    const ambientInfo = useMemo(() => {
        if (discoMode) return { color: "#ff00ff", intensity: 0.5, bg: "#220033" };

        const t = time;
        let color = new THREE.Color();
        let bg = new THREE.Color();
        let intensity = 0.5;

        if (t < 0.2) { // Dawn to Noon
            color.setHSL(0.08, 0.8, 0.7); // Orange-ish
            bg.setHSL(0.6, 0.5, 0.8 + (t * 0.5)); // Blueish Getting brighter
            intensity = 0.4 + (t * 2);
        } else if (t < 0.4) { // Noon
            color.setHSL(0.1, 0.1, 1.0); // White
            bg.setHSL(0.6, 0.6, 0.9); // Sky Blue
            intensity = 0.8;
        } else if (t < 0.6) { // Sunset
            color.setHSL(0.05, 0.8, 0.6); // Red/Orange
            bg.setHSL(0.9, 0.8, 0.5); // Purple Sky
            intensity = 0.6;
        } else { // Night
            color.setHSL(0.66, 0.8, 0.2); // Blue dark
            bg.setHSL(0.66, 0.8, 0.05); // Dark blue/black
            intensity = 0.3;
        }

        // Apply Weather Overrides
        if (weather === 'rain') {
            bg.lerp(new THREE.Color('#444455'), 0.8);
            intensity *= 0.7; // Darker
        } else if (weather === 'clouds') {
            bg.lerp(new THREE.Color('#aaaaaa'), 0.5);
        } else if (weather === 'snow') {
            bg.lerp(new THREE.Color('#ddeeff'), 0.3); // Brighter/Whiter
            intensity *= 1.1;
        }

        return { color, bg, intensity };
    }, [time, discoMode, weather]);

    return (
        <>
            <color attach="background" args={[ambientInfo.bg]} />
            <ambientLight intensity={ambientInfo.intensity} color={ambientInfo.color} />

            {/* Sun/Moon Light */}
            {!discoMode && <directionalLight
                position={[
                    -Math.sin((time - 0.25) * Math.PI * 2) * 50,
                    Math.cos((time - 0.25) * Math.PI * 2) * 50,
                    20
                ]}
                intensity={time > 0.6 || time < 0.9 ? 0.2 : 1.5} // Dim at night
                castShadow
                shadow-mapSize={[2048, 2048]}
            />}
        </>
    );
};

// --- BUILDING COMPONENTS ---

const Billboard = ({ project }) => {
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlide((prev) => (prev + 1) % 2);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 30, 0]}>
            <group scale={1.8}>
                {/* Frame */}
                <mesh>
                    <boxGeometry args={[3.2, 2.2, 0.2]} />
                    <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Content - Front */}
                <group position={[0, 0, 0.11]}>
                    {slide === 0 ? (
                        <DreiImage url={project.image} scale={[3, 2]} transparent />
                    ) : (
                        <group>
                            {/* Dark background for text readability */}
                            <mesh position={[0, 0, -0.01]}>
                                <planeGeometry args={[3, 2]} />
                                <meshBasicMaterial color="#1a1a1a" />
                            </mesh>
                            <Text
                                fontSize={0.18}
                                color="white"
                                maxWidth={2.8}
                                textAlign="center"
                                anchorY="middle"
                                font="https://fonts.gstatic.com/s/exo2/v10/7cH1v4okm5zmbhtOdCfB.woff"
                            >
                                {project.description}
                            </Text>
                        </group>
                    )}
                </group>

                {/* Back Image (Static Logo/Image) */}
                <DreiImage url={project.image} position={[0, 0, -0.11]} scale={[3, 2]} rotation={[0, Math.PI, 0]} />

                {/* Glow effect behind */}
                <mesh position={[0, 0, -0.2]}>
                    <planeGeometry args={[3.5, 2.5]} />
                    <meshBasicMaterial color={project.color || 'white'} transparent opacity={0.3} />
                </mesh>
            </group>
        </Float>
    );
};

const ComplexBuilding = ({ project, hovered, index, showObservationDeck }) => {
    // Select model based on index
    const modelUrl = BUILDING_MODELS[index % BUILDING_MODELS.length];
    const { scene } = useGLTF(modelUrl);

    // Automatic Scaling & Centering
    const { scale, yOffset } = useMemo(() => {
        // Clone to avoid modifying the cached scene during calculation (though simple bounds check is safe)
        const bbox = new THREE.Box3().setFromObject(scene);
        const size = bbox.getSize(new THREE.Vector3());

        // Target height ~25 units for gameplay consistency
        const targetHeight = 25;

        // Avoid division by zero
        const effectiveHeight = size.y || 1;
        const scaleFactor = targetHeight / effectiveHeight;

        // Calculate offset to place the bottom of the model exactly on y=0
        const yOff = -bbox.min.y * scaleFactor;

        return { scale: scaleFactor, yOffset: yOff };
    }, [scene]);

    return (
        <group>
            {/* The Building Model */}
            <group position={[0, yOffset, 0]} scale={[scale, scale, scale]}>
                <Clone object={scene} />
            </group>

            {/* Simple base because models might float or be thin */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
                <cylinderGeometry args={[6, 7, 0.5, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Floating Slideshow Billboard - Only visible on hover */}
            {hovered && <Billboard project={project} />}
        </group>
    );
};


const DOOR_MODEL = '/assets/models/minecraft_wooden_door.glb';
useGLTF.preload(DOOR_MODEL);

const DoorModel = ({ onClick, label }) => {
    const { scene } = useGLTF(DOOR_MODEL);
    const clone = useMemo(() => {
        const c = scene.clone();
        c.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        return c;
    }, [scene]);

    // Hover effect
    const [hovered, setHover] = useState(false);

    return (
        <group onClick={onClick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <primitive object={clone} scale={1.5} rotation={[0, Math.PI / 2, 0]} />

            {/* Glowing Frame/Indicator */}
            {hovered && (
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[1.2, 2.2, 0.2]} />
                    <meshBasicMaterial color="gold" opacity={0.3} transparent />
                </mesh>
            )}

            {/* Label */}
            <group position={[0, 2.5, 0]}>
                <Text fontSize={0.3} color="white" anchorY="bottom">{label}</Text>
            </group>
        </group>
    );
};

const ProjectZone = ({ position, project, index, onEnter }) => {
    const [hovered, setHover] = useState(false);
    const height = 25; // Standardized height
    const color = project.color || '#888';

    return (
        <group position={position} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>

            {/* Ground Interaction Area - Only standard click enters project */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} onClick={(e) => { e.stopPropagation(); onEnter(project); }}>
                <ringGeometry args={[6, 7, 32]} />
                <meshBasicMaterial color={project.color || 'white'} opacity={0.6} transparent />
            </mesh>

            {/* Title Label - Only visible on hover */}
            {hovered && (
                <Html position={[0, height + 5, 0]} center transform sprite zIndexRange={[100, 0]} distanceFactor={40}>
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
            <ComplexBuilding project={project} hovered={hovered} index={index} />

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

const Village = ({ onEnterProject, onPlatformsUpdate, playerRef, layout }) => {
    // Calculate Platforms
    useEffect(() => {
        if (onPlatformsUpdate && layout) {
            const platforms = layout
                .filter(item => item.type === 'project')
                .map(item => ({
                    pos: [item.pos[0], 25, item.pos[2]], // Top of building
                    size: [16, 16], // Generous radius for top
                    height: 25.5 // Slightly above visual floor
                }));
            onPlatformsUpdate(platforms);
        }
    }, [layout, onPlatformsUpdate]);


    return (
        <group>
            {/* Roads */}
            <Road position={[0, 0, 0]} length={1000} width={20} />
            <Road position={[0, 0, 0]} rotation={Math.PI / 2} length={1000} width={20} />

            {/* Center Plaza */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[25, 32]} />
                <meshStandardMaterial color="#444" roughness={0.4} />
            </mesh>

            {layout && layout.map((item, i) => {
                if (item.type === 'project') {
                    // PASS POSITION to onEnterProject
                    return <ProjectZone key={item.data.id} position={item.pos} project={item.data} index={i} onEnter={(proj) => onEnterProject(proj, item.pos)} playerRef={playerRef} />;
                } else {
                    // Decorative Skyscrapers using high-res models
                    return (
                        <group key={'deco' + i} position={item.pos}>
                            <ComplexBuilding index={i + 13} hovered={false} project={null} showObservationDeck={false} />
                        </group>
                    );
                }
            })}
        </group>
    );
};

const FullScreenGallery = ({ images, initialIndex = 0, onClose }) => {
    const [index, setIndex] = useState(initialIndex);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [mouseDownX, setMouseDownX] = useState(null);

    const handleNext = (e) => {
        e && e.stopPropagation();
        setIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        e && e.stopPropagation();
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleMouseDown = (e) => {
        setMouseDownX(e.clientX);
    };

    const handleMouseUp = (e) => {
        if (mouseDownX === null) return;
        const distance = mouseDownX - e.clientX;
        if (distance > 50) handleNext();
        if (distance < -50) handlePrev();
        setMouseDownX(null);
    };

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
        <div
            className="lightbox-overlay"
            onClick={onClose}
            style={{ zIndex: 10000 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <button className="lightbox-close" onClick={onClose}>
                <X size={32} />
            </button>

            <button className="lightbox-nav prev" onClick={handlePrev}>
                <ChevronLeft size={40} />
            </button>

            <img
                key={index}
                src={images[index]}
                alt="Full size"
                className="lightbox-img"
                onClick={(e) => e.stopPropagation()}
            />

            <button className="lightbox-nav next" onClick={handleNext}>
                <ChevronRight size={40} />
            </button>

            <div className="lightbox-counter">
                {index + 1} / {images.length}
            </div>
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
    const [activeProjectPosition, setActiveProjectPosition] = useState(null); // Track building location
    const [galleryState, setGalleryState] = useState({ isOpen: false, index: 0 });

    // Platform State (from Village)
    const [platforms, setPlatforms] = useState([]);

    // 1. Generate STABLE City Layout at Top Level
    const cityLayout = useMemo(() => {
        const items = [];
        const usedPositions = [];
        const MIN_DIST = 70;
        const RANGE = 200;

        // 1. Map ALL Projects
        projects.forEach((p) => {
            let pos;
            let attempts = 0;
            while (!pos && attempts < 100) {
                const x = (Math.random() - 0.5) * 2 * RANGE;
                const z = (Math.random() - 0.5) * 2 * RANGE;
                if (Math.hypot(x, z) < 40) { attempts++; continue; }
                if (usedPositions.every(u => Math.hypot(u[0] - x, u[1] - z) > MIN_DIST)) {
                    pos = [x, 0, z];
                }
                attempts++;
            }
            if (!pos) {
                const angle = (usedPositions.length / projects.length) * Math.PI * 2;
                const radius = 120 + (usedPositions.length * 15);
                pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
            }
            usedPositions.push(pos);
            items.push({ type: 'project', data: p, pos });
        });

        // 2. Add Decorative Skyscrapers
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

    // Roof Access Handler
    const handleGoToRoof = () => {
        if (activeProjectPosition) {
            setActiveProject(null); // Exit interior
            // Teleport player to roof
            // Roof height is approx 25 + offset
            if (playerRef.current) {
                // Determine roof height based on `ComplexBuilding` scaling logic (approx 25)
                const roofY = 26;
                playerRef.current.setTranslation({ x: activeProjectPosition[0], y: roofY, z: activeProjectPosition[2] }, true);
                playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            }
        }
    };

    // Enhanced Enter Handler
    const handleEnterProject = (project, position) => {
        setActiveProject(project);
        setActiveProjectPosition(position);
    };



    // Audio State
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.4);

    // Game
    const [collectedBucks, setCollectedBucks] = useState([]);
    const [discoMode, setDiscoMode] = useState(false);
    const [currentDance, setCurrentDance] = useState(null);
    const [showDanceMenu, setShowDanceMenu] = useState(false);

    // WEATHER & TIME
    const [time, setTime] = useState(0.25); // Default Noon
    const [weather, setWeather] = useState('clear');
    const [userLocation, setUserLocation] = useState(null);

    // FETCH REAL WORLD DATA
    useEffect(() => {
        // Time Update Logic (Smooth movement)
        const updateTime = () => {
            const now = new Date();
            const decimalHour = now.getHours() + (now.getMinutes() / 60);

            let gameTime = 0.25;
            if (decimalHour < 6) { // Midnight to Dawn
                gameTime = 0.75 + (decimalHour / 24);
            } else {
                gameTime = (decimalHour - 6) / 24;
            }
            setTime(gameTime);
        };

        // 1. Initial Time Set
        updateTime();

        // 2. Start Timer
        const interval = setInterval(updateTime, 60000); // Update every minute

        // 3. Get Location & Weather
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                try {
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
                    const data = await response.json();

                    if (data && data.current_weather) {
                        const wCode = data.current_weather.weathercode;
                        let wType = 'clear';
                        if (wCode >= 51 && wCode <= 67) wType = 'rain';
                        else if (wCode >= 71 && wCode <= 77) wType = 'snow';
                        else if (wCode >= 1 && wCode <= 3) wType = 'clouds';
                        setWeather(wType);
                    }
                } catch (e) {
                    console.error("Failed to fetch weather:", e);
                }
            }, (err) => {
                console.log("Geolocation blocked or failed, using default time.");
            });
        }

        return () => clearInterval(interval);
    }, []);

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

    // Manual Weather Toggle for Testing
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'g') {
                setWeather(prev => {
                    const types = ['clear', 'rain', 'snow', 'clouds'];
                    const nextIndex = (types.indexOf(prev) + 1) % types.length;
                    return types[nextIndex];
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handlePickupBall = (id) => {
        setBalls(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'black', overflow: 'hidden' }}>
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
                            <b>Tip:</b> Press 'F' to Throw Tennis Balls! 🎾<br />
                            <b>Tip:</b> Press 'G' to Change Weather! 🌦
                        </div>
                    </div>

                    <div style={{ position: 'absolute', top: 90, left: 20, zIndex: 10, padding: '10px 15px', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', color: 'gold', fontWeight: 'bold', border: '2px solid gold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                        <span>🐶 Bear Bucks: {collectedBucks.length} / {totalBucks}</span>
                    </div>

                    {/* Time & Weather Indicator */}
                    <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 15px', borderRadius: '15px' }}>
                        {userLocation ? (
                            <>
                                <span>{weather === 'rain' ? '🌧️' : weather === 'snow' ? '❄️' : weather === 'clouds' ? '☁️' : '☀️'} {weather.toUpperCase()}</span>
                                <span style={{ margin: '0 10px' }}>|</span>
                                <span>{time < 0.25 ? "🌅 Morning" : time < 0.5 ? "☀️ Day" : time < 0.75 ? "🌇 Evening" : "🌙 Night"}</span>
                            </>
                        ) : (
                            <span>Simulated Time</span>
                        )}
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
                            {/* Day/Night Cycle Manager */}
                            <DayNightCycle time={time} weather={weather} discoMode={discoMode} />
                            <Environment preset="city" />

                            {!discoMode && <SunMoon time={time} radius={300} />}

                            {/* Weather Effects */}
                            {weather === 'rain' && <Rain />}
                            {weather === 'snow' && <Snow />}
                            {(weather === 'clear' || weather === 'clouds') && (
                                <Sparkles
                                    count={100}
                                    scale={100}
                                    size={8}
                                    speed={0.4}
                                    opacity={0.5}
                                    color={time > 0.6 ? "white" : "yellow"}
                                />
                            )}

                            <Player ref={playerRef} position={[0, 0, 8]} isDancing={!!currentDance} danceUrl={currentDance?.file} activeAnimationName={currentDance?.animationName} platforms={platforms} />
                            <CityFloor />

                            <Village onEnterProject={handleEnterProject} onPlatformsUpdate={setPlatforms} playerRef={playerRef} layout={cityLayout} />

                            <SpotifyWidget3D position={[-12, 4, 12]} />
                            <InteractiveCrates count={15} playerRef={playerRef} />

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
                                platforms={platforms}
                            />

                        </>
                    ) : (
                        <>
                            <color attach="background" args={['#222']} />
                            <ProjectInterior
                                project={activeProject}
                                onExit={() => setActiveProject(null)}
                                onGoToRoof={handleGoToRoof}
                                onImageClick={(idx) => setGalleryState({ isOpen: true, index: idx })}
                            />
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
