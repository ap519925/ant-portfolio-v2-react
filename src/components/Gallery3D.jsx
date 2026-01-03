import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Html, OrbitControls, Image as DreiImage } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';
import SpotifyWidget3D from './SpotifyWidget3D';
import * as THREE from 'three';
import { projects } from '../data/projects';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// 3D Logo Component - Creates unique 3D logos for each project
const Project3DLogo = ({ project }) => {
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    // Create different logo shapes based on project
    if (project.id === 'capframe') {
        // Video capture app - Camera/Frame shape
        return (
            <group ref={meshRef}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[2, 1.5, 0.5]} />
                    <meshStandardMaterial color={project.color} metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0.6, 0.4, 0.3]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                    <meshStandardMaterial color="#333" metalness={0.9} />
                </mesh>
            </group>
        );
    } else if (project.category.includes('Mobile')) {
        // Phone shape
        return (
            <group ref={meshRef}>
                <mesh>
                    <boxGeometry args={[1, 2, 0.2]} />
                    <meshStandardMaterial color={project.color} metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
        );
    } else if (project.category.includes('Crypto') || project.category.includes('Finance')) {
        // Coin shape
        return (
            <group ref={meshRef}>
                <mesh>
                    <cylinderGeometry args={[1.2, 1.2, 0.3, 32]} />
                    <meshStandardMaterial color={project.color} metalness={1} roughness={0} />
                </mesh>
            </group>
        );
    } else if (project.id === 'ibew-union') {
        // Lightning bolt for electrical workers
        return (
            <group ref={meshRef}>
                <mesh>
                    <boxGeometry args={[0.3, 2, 0.3]} />
                    <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0.4, -0.5, 0]} rotation={[0, 0, -0.5]}>
                    <boxGeometry args={[0.8, 0.3, 0.3]} />
                    <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.5} />
                </mesh>
            </group>
        );
    } else {
        // Default - Abstract cube logo
        return (
            <group ref={meshRef}>
                <mesh>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial color={project.color} metalness={0.7} roughness={0.3} />
                </mesh>
            </group>
        );
    }
};

// Project Zone Component with 3D Logo
const ProjectZone = ({ position, project, playerPosition, isViewing }) => {
    const [hovered, setHovered] = useState(false);

    // Check distance to player
    const distance = playerPosition ?
        Math.sqrt(
            Math.pow(playerPosition.x - position[0], 2) +
            Math.pow(playerPosition.z - position[2], 2)
        ) : 999;

    const isNear = distance < 8;

    return (
        <group position={position}>
            {/* Platform */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[6, 6, 0.2, 32]} />
                <meshStandardMaterial
                    color={project.color}
                    emissive={project.color}
                    emissiveIntensity={isNear ? 0.4 : 0.15}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* 3D Logo */}
            <group position={[0, 3, 0]}>
                <Project3DLogo project={project} />
            </group>

            {/* Project Title */}
            <Html position={[0, 6.5, 0]} center>
                <div style={{
                    color: project.color,
                    fontSize: '32px',
                    fontWeight: 'bold',
                    textShadow: `0 0 30px ${project.color}, 3px 3px 6px rgba(0,0,0,0.9)`,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                }}>
                    {project.title}
                </div>
            </Html>

            {/* Interaction Prompt */}
            {isNear && !isViewing && (
                <Html position={[0, 8, 0]} center>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        padding: '15px 30px',
                        borderRadius: '20px',
                        border: `3px solid ${project.color}`,
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        animation: 'pulse 2s infinite',
                        boxShadow: `0 0 30px ${project.color}60`,
                    }}>
                        Press <span style={{ color: project.color, fontSize: '22px' }}>F</span> to enter project
                    </div>
                </Html>
            )}

            {/* Glow Ring */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[6, 7, 32]} />
                <meshBasicMaterial color={project.color} transparent opacity={isNear ? 0.3 : 0.1} />
            </mesh>

            {/* Sparkles */}
            <Sparkles count={30} scale={10} size={5} speed={0.4} color={project.color} />

            {/* Point Light */}
            <pointLight position={[0, 5, 0]} color={project.color} intensity={isNear ? 8 : 4} distance={20} />
        </group>
    );
};

// 3D Info Panel - Displayed when viewing a project
const ProjectInfoPanel = ({ project, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <group>
            {/* Left Panel - Gallery */}
            <Html position={[-8, 0, 0]} transform distanceFactor={1.5}>
                <div style={{
                    width: '600px',
                    height: '700px',
                    background: 'rgba(10,10,10,0.95)',
                    borderRadius: '20px',
                    border: `4px solid ${project.color}`,
                    padding: '20px',
                    boxShadow: `0 0 50px ${project.color}80`,
                }}>
                    <div style={{
                        width: '100%',
                        height: '550px',
                        background: '#000',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        <img
                            src={images[currentImageIndex]}
                            alt={project.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    style={{
                                        position: 'absolute',
                                        left: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(0,0,0,0.8)',
                                        border: `2px solid ${project.color}`,
                                        borderRadius: '50%',
                                        width: '50px',
                                        height: '50px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    style={{
                                        position: 'absolute',
                                        right: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(0,0,0,0.8)',
                                        border: `2px solid ${project.color}`,
                                        borderRadius: '50%',
                                        width: '50px',
                                        height: '50px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '15px',
                            overflowX: 'auto',
                            padding: '5px',
                        }}>
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    style={{
                                        width: '90px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: currentImageIndex === idx ? `3px solid ${project.color}` : '3px solid transparent',
                                        opacity: currentImageIndex === idx ? 1 : 0.5,
                                        transition: 'all 0.3s',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Html>

            {/* Right Panel - Info */}
            <Html position={[8, 0, 0]} transform distanceFactor={1.5}>
                <div style={{
                    width: '500px',
                    height: '700px',
                    background: 'rgba(10,10,10,0.95)',
                    borderRadius: '20px',
                    border: `4px solid ${project.color}`,
                    padding: '40px',
                    boxShadow: `0 0 50px ${project.color}80`,
                    overflowY: 'auto',
                    color: 'white',
                }}>
                    <h1 style={{
                        color: project.color,
                        fontSize: '48px',
                        margin: '0 0 15px 0',
                        textShadow: `0 0 20px ${project.color}`,
                    }}>
                        {project.title}
                    </h1>

                    <div style={{
                        display: 'inline-block',
                        background: project.color,
                        padding: '10px 25px',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '30px',
                    }}>
                        {project.category}
                    </div>

                    <p style={{
                        fontSize: '18px',
                        lineHeight: '1.8',
                        color: '#ddd',
                        marginBottom: '30px',
                    }}>
                        {project.description}
                    </p>

                    {project.content?.overview && (
                        <div style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: project.color, fontSize: '22px', marginBottom: '10px' }}>Overview</h3>
                            <p style={{ color: '#bbb', lineHeight: '1.6' }}>{project.content.overview}</p>
                        </div>
                    )}

                    {project.content?.contributions && (
                        <div style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: project.color, fontSize: '22px', marginBottom: '10px' }}>Key Contributions</h3>
                            <ul style={{ color: '#bbb', lineHeight: '1.8', paddingLeft: '20px' }}>
                                {project.content.contributions.map((contrib, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>{contrib}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: project.color, fontSize: '22px', marginBottom: '10px' }}>Technologies</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {project.tags.map(tag => (
                                <span key={tag} style={{
                                    background: `${project.color}30`,
                                    color: project.color,
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    border: `2px solid ${project.color}60`,
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {project.link && project.link !== '#' && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: project.color,
                                color: 'white',
                                padding: '15px 30px',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                boxShadow: `0 0 20px ${project.color}60`,
                            }}
                        >
                            Visit Project <ExternalLink size={20} />
                        </a>
                    )}
                </div>
            </Html>

            {/* Close Button */}
            <Html position={[0, 5, 0]} center>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(0,0,0,0.9)',
                        border: `3px solid ${project.color}`,
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: `0 0 30px ${project.color}`,
                    }}
                >
                    <X size={30} />
                </button>
                <div style={{
                    marginTop: '10px',
                    color: 'white',
                    fontSize: '14px',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}>
                    Press ESC to exit
                </div>
            </Html>
        </group>
    );
};

// Main Scene
const DreamFloor = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#eecbf2" />
    </mesh>
);

// Player Position Tracker - Must be inside Canvas
const PlayerPositionTracker = ({ playerRef, onPositionUpdate }) => {
    useFrame(() => {
        if (playerRef.current?.position) {
            onPositionUpdate({
                x: playerRef.current.position.x,
                y: playerRef.current.position.y,
                z: playerRef.current.position.z,
            });
        }
    });
    return null;
};

// Camera Controller - Handles zoom animation when viewing projects
const CameraController = ({ viewingProject, projectPosition }) => {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3());
    const targetLookAt = useRef(new THREE.Vector3());

    useFrame(() => {
        if (viewingProject && projectPosition) {
            // Zoom into project - first person view
            targetPos.current.set(
                projectPosition[0],
                projectPosition[1] + 3,
                projectPosition[2] + 10
            );
            targetLookAt.current.set(projectPosition[0], projectPosition[1] + 2, projectPosition[2]);

            // Smooth camera movement and rotation
            camera.position.lerp(targetPos.current, 0.1);
            camera.lookAt(targetLookAt.current);
        }
    });

    return null;
};

const GalleryScene = () => {
    const navigate = useNavigate();
    const playerRef = useRef();
    const [viewingProject, setViewingProject] = useState(null);
    const [viewingPosition, setViewingPosition] = useState(null);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 8 });

    // Keyboard interaction (F to view, ESC to exit)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'f' || e.key === 'F') {
                if (!viewingProject) {
                    // Find nearest project
                    let nearestProject = null;
                    let nearestPosition = null;
                    let nearestDistance = 8;

                    projectLayout.forEach(({ project, position }) => {
                        const distance = Math.sqrt(
                            Math.pow(playerPosition.x - position[0], 2) +
                            Math.pow(playerPosition.z - position[2], 2)
                        );
                        if (distance < nearestDistance) {
                            nearestDistance = distance;
                            nearestProject = project;
                            nearestPosition = position;
                        }
                    });

                    if (nearestProject) {
                        setViewingProject(nearestProject);
                        setViewingPosition(nearestPosition);
                    }
                }
            } else if (e.key === 'Escape') {
                setViewingProject(null);
                setViewingPosition(null);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [playerPosition, viewingProject]);

    // Project layout - Grid formation
    const projectLayout = useMemo(() => {
        const layout = [];
        const gridSize = 4; // 4x4 grid (16 spots for 14 projects)
        const spacing = 25;

        projects.forEach((project, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const x = (col - gridSize / 2 + 0.5) * spacing;
            const z = (row - gridSize / 2 + 0.5) * spacing;

            layout.push({
                project,
                position: [x, 0, z]
            });
        });

        return layout;
    }, []);

    const teleportTo = (x, z) => {
        if (playerRef.current?.position) {
            playerRef.current.position.x = x;
            playerRef.current.position.z = z;
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffe4e1', overflow: 'hidden' }}>
            {/* HUD - Hide when viewing project */}
            {!viewingProject && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        zIndex: 100,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        maxWidth: '600px',
                    }}>
                        <button onClick={() => teleportTo(0, 8)} style={hudBtn}>🏠 Center</button>
                        {projectLayout.slice(0, 6).map(({ project, position }, idx) => (
                            <button
                                key={idx}
                                onClick={() => teleportTo(position[0], position[2])}
                                style={hudBtn}
                            >
                                {project.title.substring(0, 10)}
                            </button>
                        ))}
                    </div>

                    <div style={{
                        position: 'absolute',
                        bottom: 30,
                        left: 30,
                        color: 'rgba(100,100,100,0.8)',
                        zIndex: 10,
                        fontFamily: 'Exo 2',
                        pointerEvents: 'none',
                    }}>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>PORTFOLIO GALLERY</div>
                        <div style={{ marginTop: '10px' }}>
                            <div>WASD - Move | Shift - Sprint | Space - Jump</div>
                            <div style={{ color: '#a855f7', fontWeight: 'bold' }}>F - Enter Project</div>
                        </div>
                    </div>

                    {/* Exit Button */}
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            zIndex: 100,
                            padding: '10px 20px',
                            background: 'rgba(168, 85, 247, 0.8)',
                            border: '2px solid white',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        🏠 Exit to Selection
                    </button>
                </>
            )}

            {/* Viewing Mode Indicator */}
            {viewingProject && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                    pointerEvents: 'none',
                    transition: 'opacity 0.5s',
                }}>
                    <div style={{
                        fontSize: '24px',
                        color: viewingProject.color,
                        fontWeight: 'bold',
                        textShadow: `0 0 30px ${viewingProject.color}, 3px 3px 6px rgba(0,0,0,0.9)`,
                        animation: 'fadeIn 0.5s',
                    }}>
                        {/* Placeholder for immersive transition */}
                    </div>
                </div>
            )}

            <Canvas camera={{ position: [0, 15, 25], fov: 60 }} gl={{ antialias: true }}>
                <color attach="background" args={['#ffe4e1']} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[20, 50, 20]} intensity={1.5} castShadow />
                <Sparkles count={150} scale={100} size={8} speed={0.3} opacity={0.4} color="#fff" />

                <PlayerPositionTracker playerRef={playerRef} onPositionUpdate={setPlayerPosition} />

                {/* Only show player when not viewing */}
                {!viewingProject && <Player ref={playerRef} position={[0, 0, 8]} />}

                {/* Camera Controller for viewing mode */}
                {viewingProject && viewingPosition && (
                    <CameraController
                        viewingProject={viewingProject}
                        projectPosition={viewingPosition}
                    />
                )}

                <DreamFloor />

                {/* All Projects */}
                {projectLayout.map(({ project, position }, idx) => (
                    <ProjectZone
                        key={idx}
                        position={position}
                        project={project}
                        playerPosition={playerPosition}
                        isViewing={viewingProject?.id === project.id}
                    />
                ))}

                {/* 3D Info Panel when viewing */}
                {viewingProject && viewingPosition && (
                    <group position={viewingPosition}>
                        <ProjectInfoPanel
                            project={viewingProject}
                            onClose={() => {
                                setViewingProject(null);
                                setViewingPosition(null);
                            }}
                        />
                    </group>
                )}

                {/* Spotify Widget */}
                <SpotifyWidget3D position={[0, 4, -60]} />
            </Canvas>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                }
            `}</style>
        </div>
    );
};

const hudBtn = {
    padding: '8px 15px',
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid #aaa',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
};

export default GalleryScene;
