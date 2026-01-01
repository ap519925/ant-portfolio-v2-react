import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';

const Wall = (props) => {
    return (
        <mesh {...props} receiveShadow>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
        </mesh>
    );
};

const Floor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.2} />
            <gridHelper args={[50, 50, '#333', '#111']} rotation={[-Math.PI / 2, 0, 0]} />
        </mesh>
    );
};

const Painting = ({ position, rotation, color, label, id, navigate }) => {
    const [hovered, setHover] = useState(false);

    return (
        <group position={position} rotation={rotation}>
            {/* Spotlight */}
            <spotLight position={[0, 3, 2]} intensity={5} angle={0.5} penumbra={1} castShadow />

            {/* Frame */}
            <mesh position={[0, 1.5, 0.1]}>
                <boxGeometry args={[3.2, 2.2, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Canvas/Art */}
            <mesh
                position={[0, 1.5, 0.25]}
                onClick={() => navigate(`/project/${id}`)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[3, 2, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? '#a855f7' : color}
                    emissive={hovered ? color : '#000'}
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Label */}
            <mesh position={[0, 0, 0.15]}>
                <boxGeometry args={[1.5, 0.4, 0.05]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
    );
};

const GalleryScene = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            {/* Hints */}
            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'white', zIndex: 10,
                fontFamily: 'Exo 2', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px'
            }}>
                <div><b>WASD</b> to Move • <b>Mouse</b> to Click Art</div>
            </div>

            <Canvas shadows>
                <ambientLight intensity={0.4} />
                <pointLight position={[0, 10, 0]} intensity={0.5} />

                {/* The Player (Third Person) */}
                <Player position={[0, 0, 8]} />

                {/* Room Structure */}
                <Floor />
                <Wall position={[0, 2.5, -10]} width={20} height={10} /> {/* Back */}
                <Wall position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} /> {/* Left */}
                <Wall position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} /> {/* Right */}
                <Wall position={[0, 2.5, 10]} width={20} height={10} /> {/* Front / Entry */}

                {/* Exhibits */}
                <Painting
                    position={[0, 0, -9.5]}
                    color="cyan"
                    label="Project 1"
                    id="1"
                    navigate={navigate}
                />
                <Painting
                    position={[-9.5, 0, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    color="purple"
                    label="Project 2"
                    id="2"
                    navigate={navigate}
                />
                <Painting
                    position={[9.5, 0, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                    color="orange"
                    label="Project 3"
                    id="3"
                    navigate={navigate}
                />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />
            </Canvas>

            {/* Exit Button */}
            <button
                style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 20,
                    padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white', borderRadius: '4px', cursor: 'pointer', backdropFilter: 'blur(5px)'
                }}
                onClick={() => navigate('/')}
            >
                Exit Gallery
            </button>
        </div>
    );
};

export default GalleryScene;
