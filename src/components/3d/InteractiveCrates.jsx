import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

const InteractiveCrates = ({ count = 20, playerRef }) => {
    // Generate random positions
    const [crates] = useState(() => {
        return Array.from({ length: count }).map(() => ({
            position: [
                (Math.random() - 0.5) * 100,
                0.5 + Math.random() * 2, // Random starting heights
                (Math.random() - 0.5) * 100
            ],
            color: `hsl(${Math.random() * 360}, 60%, 60%)`,
            scale: 0.5 + Math.random(),
            velocity: [0, 0, 0],
            id: Math.random()
        }));
    });

    return (
        <group>
            {crates.map((crate, i) => (
                <Crate key={i} {...crate} playerRef={playerRef} />
            ))}
        </group>
    );
};

const Crate = ({ position: initialPos, color, scale, playerRef }) => {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);
    const velocity = useRef([0, 0, 0]);
    const position = useRef([...initialPos]);

    useFrame(() => {
        if (!meshRef.current || !playerRef.current) return;

        // 1. Gravity
        if (position.current[1] > scale / 2) {
            velocity.current[1] -= 0.02; // Gravity
        } else if (position.current[1] <= scale / 2 && velocity.current[1] < 0) {
            // Bounce
            velocity.current[1] = -velocity.current[1] * 0.6;

            // Friction
            velocity.current[0] *= 0.95;
            velocity.current[2] *= 0.95;
        }

        // 2. Player Collision (Kick)
        const playerPos = playerRef.current.position;
        const dx = position.current[0] - playerPos.x;
        const dz = position.current[2] - playerPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 2 + scale) {
            // Kick vector
            const force = 0.5;
            velocity.current[0] += (dx / dist) * force;
            velocity.current[2] += (dz / dist) * force;
            velocity.current[1] += 0.2; // Tiny hop
        }

        // 3. Update Position
        position.current[0] += velocity.current[0];
        position.current[1] += velocity.current[1];
        position.current[2] += velocity.current[2];

        // Floor constraint
        if (position.current[1] < scale / 2) {
            position.current[1] = scale / 2;
        }

        // Apply to mesh
        meshRef.current.position.set(position.current[0], position.current[1], position.current[2]);
        meshRef.current.rotation.x += velocity.current[2] * 0.1;
        meshRef.current.rotation.z -= velocity.current[0] * 0.1;
    });

    return (
        <RoundedBox
            ref={meshRef}
            args={[scale, scale, scale]} // Width, Height, Depth
            radius={0.1}
            smoothness={4}
            position={initialPos}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={() => {
                velocity.current[1] = 1.0; // Mega Jump on Click
                velocity.current[0] = (Math.random() - 0.5) * 1;
                velocity.current[2] = (Math.random() - 0.5) * 1;
            }}
        >
            <meshStandardMaterial
                color={hovered ? 'white' : color}
                emissive={hovered ? color : 'black'}
                emissiveIntensity={0.5}
                roughness={0.2}
            />
        </RoundedBox>
    );
};

export default InteractiveCrates;
