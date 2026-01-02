import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sky, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Player from './Player';

const Wall = (props) => {
    return (
        <mesh {...props} receiveShadow>
            <boxGeometry args={[props.width, props.height, 0.5]} />
            <meshStandardMaterial color="#222" roughness={0.5} />
        </mesh>
    );
};

const VastFloor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#050505" roughness={1} />
            <gridHelper args={[1000, 200, '#333', '#000']} rotation={[-Math.PI / 2, 0, 0]} />
        </mesh>
    );
};

const Painting = ({ position, rotation, color, label, id, navigate }) => {
    const [hovered, setHover] = useState(false);
    return (
        <group position={position} rotation={rotation}>
            {/* Spotlight */}
            <spotLight position={[0, 4, 3]} intensity={6} angle={0.4} penumbra={0.5} castShadow />
            {/* Frame */}
            <mesh position={[0, 1.5, 0.1]}>
                <boxGeometry args={[3.2, 2.2, 0.2]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Canvas */}
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
        </group>
    );
};

const GalleryScene = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            <div style={{
                position: 'absolute', bottom: 30, left: 30, color: 'rgba(255,255,255,0.7)', zIndex: 10,
                fontFamily: 'Exo 2', pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '1.2em' }}>EXPLORE</div>
                <div style={{ fontSize: '0.9em' }}>WASD to Move • Shift to Run</div>
            </div>

            <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
                <fog attach="fog" args={['#000', 10, 50]} /> {/* Fade into distance */}

                {/* Global Lighting */}
                <ambientLight intensity={0.2} />
                <directionalLight position={[50, 50, 25]} intensity={0.5} castShadow />

                {/* Sky/Atmosphere */}
                {/* Using Sky with low inclination for a 'Dusk' feel */}
                <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                {/* The Player */}
                <Player position={[0, 0, 8]} />

                {/* The World */}
                <VastFloor />

                {/* The Gallery Building */}
                <group position={[0, 0, 0]}>
                    <Wall position={[0, 2.5, -10]} width={20} height={10} /> {/* Back */}
                    <Wall position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={20} height={10} /> {/* Left */}
                    <Wall position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} height={10} /> {/* Right */}

                    {/* Front Walls with Entry Gap */}
                    <Wall position={[-6, 2.5, 10]} width={8} height={10} />
                    <Wall position={[6, 2.5, 10]} width={8} height={10} />

                    {/* Roof */}
                    {/* <mesh position={[0, 5.25, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow>
                        <planeGeometry args={[20, 20]} />
                        <meshStandardMaterial color="#111" />
                    </mesh> */}

                    {/* Artworks */}
                    <Painting position={[0, 0, -9.5]} color="cyan" label="Project 1" id="1" navigate={navigate} />
                    <Painting position={[-9.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="purple" label="Project 2" id="2" navigate={navigate} />
                    <Painting position={[9.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="orange" label="Project 3" id="3" navigate={navigate} />
                </group>

            </Canvas>

            <button
                style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 20,
                    padding: '10px 20px', background: 'white', border: 'none',
                    color: 'black', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold'
                }}
                onClick={() => navigate('/')}
            >
                EXIT
            </button>
        </div>
    );
};

export default GalleryScene;
