import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html, Image as DreiImage, Text, Float } from '@react-three/drei';
import Player from './Player';

// --- ASSETS ---
const Frame = ({ url, position, rotation, scale = [3, 2, 1], color = 'black' }) => {
    const [hovered, setHover] = useState(false);
    return (
        <group position={position} rotation={rotation}>
            {/* Frame Border */}
            <mesh
                position={[0, 0, -0.05]}
                scale={[scale[0] + 0.2, scale[1] + 0.2, 0.1]}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry />
                <meshStandardMaterial color={hovered ? '#555' : color} roughness={0.5} />
            </mesh>
            {/* Image */}
            <DreiImage url={url} scale={scale} toneMapped={false} />
        </group>
    );
};

const Room = ({ width = 20, height = 8, depth = 20, color = '#fff' }) => {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#333" roughness={0.8} />
            </mesh>
            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#fff" emissive="#333" />
            </mesh>
            {/* Back Wall (North) */}
            <mesh position={[0, height / 2, -depth / 2]}>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Front Wall (South) - with Door gap? For now just solid wall behind camera */}
            <mesh position={[0, height / 2, depth / 2]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Left Wall (West) */}
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[depth, height]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Right Wall (East) */}
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[depth, height]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
};

const ProjectInterior = ({ project, onExit }) => {
    const playerRef = useRef();

    // Process Images
    const images = useMemo(() => {
        const imgs = project.gallery && project.gallery.length > 0
            ? project.gallery
            : (project.image ? [project.image] : []);
        return imgs;
    }, [project]);

    // Layout Logic: Place images on walls
    // Wall North (-Z), Wall East (+X), Wall West (-X)
    // We fit max 3 per wall?

    const frames = useMemo(() => {
        const f = [];
        let wallIndex = 0; // 0=North, 1=East, 2=West
        const walls = [
            { pos: [0, 3, -9.9], rot: [0, 0, 0], offset: [-5, 0, 5] }, // North Wall positions
            { pos: [9.9, 3, 0], rot: [0, -Math.PI / 2, 0], offset: [-5, 0, 5] }, // East 
            { pos: [-9.9, 3, 0], rot: [0, Math.PI / 2, 0], offset: [-5, 0, 5] }, // West
        ];

        images.forEach((url, i) => {
            if (wallIndex > 2) return; // Full room

            const wall = walls[wallIndex];
            // Cycle positions on the wall: -5, 0, 5
            const subPos = i % 3;

            let x = wall.pos[0];
            let z = wall.pos[2];

            // Adjust X/Z based on subPos offset along the wall
            if (wallIndex === 0) x += (subPos - 1) * 6; // Spread along X for North wall
            else z += (subPos - 1) * 6; // Spread along Z for side walls

            f.push(
                <Frame
                    key={i}
                    url={url}
                    position={[x, 3, z]}
                    rotation={wall.rot}
                    color={project.color}
                />
            );

            if (subPos === 2) wallIndex++; // Next wall after 3 images
        });
        return f;
    }, [images, project]);

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <pointLight position={[0, 7, 0]} intensity={1.5} />

            {/* Room Geometry */}
            <Room color="#f0f0f0" />

            {/* Art Frames */}
            {frames}

            {/* Title / Description Text in 3D */}
            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2} position={[0, 5, -8]}>
                <Text
                    color={project.color}
                    fontSize={1}
                    maxWidth={10}
                    textAlign="center"
                    anchorY="middle"
                >
                    {project.title}
                </Text>
            </Float>
            <Text
                position={[0, 3.5, -8]}
                color="#333"
                fontSize={0.4}
                maxWidth={12}
                textAlign="center"
                anchorY="top"
            >
                {project.description}
            </Text>

            {/* Exit Door */}
            <group position={[0, 0, 9.5]} onClick={onExit}>
                <mesh position={[0, 2, 0]}>
                    <boxGeometry args={[3, 4, 0.2]} />
                    <meshStandardMaterial color="#ff4444" />
                </mesh>
                <Text position={[0, 3, 0.2]} fontSize={0.5} color="white">EXIT</Text>
            </group>

            {/* Player */}
            <Player ref={playerRef} position={[0, 0, 5]} />
        </>
    );
};

export default ProjectInterior;
