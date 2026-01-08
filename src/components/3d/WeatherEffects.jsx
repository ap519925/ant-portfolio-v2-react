import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Rain = ({ count = 3000 }) => {
    const meshRef = useRef();

    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 200; // x spread wide
            pos[i * 3 + 1] = Math.random() * 60;      // y height
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200; // z spread wide
            vel[i] = 0.8 + Math.random() * 0.4;       // fall speed
        }

        return { positions: pos, velocities: vel };
    }, [count]);

    useFrame(() => {
        if (!meshRef.current) return;
        const geom = meshRef.current.geometry;
        const posAttr = geom.attributes.position;

        for (let i = 0; i < count; i++) {
            let y = posAttr.getY(i);
            y -= velocities[i];

            if (y < 0) {
                y = 60;
                // Optional: Randomize x/z on reset to prevent "lines" forming over time? 
                // Not strictly necessary if spread is high enough and loop is seamless.
            }
            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            {/* Blue-ish tint for rain */}
            <pointsMaterial
                color="#aaccff"
                size={0.15}
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
};

export const Snow = ({ count = 1500 }) => {
    const meshRef = useRef();

    const { positions, data } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const d = []; // Store random offsets for sine wave movement

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 200;
            pos[i * 3 + 1] = Math.random() * 60;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200;

            d.push({
                speed: 0.05 + Math.random() * 0.1,
                drift: Math.random() * Math.PI * 2,
                swaySpeed: 0.5 + Math.random() * 1.5
            });
        }
        return { positions: pos, data: d };
    }, [count]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const geom = meshRef.current.geometry;
        const posAttr = geom.attributes.position;
        const t = clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            let y = posAttr.getY(i);
            let x = posAttr.getX(i);
            let z = posAttr.getZ(i);

            // Fall down
            y -= data[i].speed;

            // Drift slightly in X/Z
            x += Math.sin(t * data[i].swaySpeed + data[i].drift) * 0.02;
            z += Math.cos(t * data[i].swaySpeed + data[i].drift) * 0.02;

            // Reset
            if (y < 0) {
                y = 60;
                // random reset to avoid clump
                x = (Math.random() - 0.5) * 200;
                z = (Math.random() - 0.5) * 200;
            }

            posAttr.setY(i, y);
            posAttr.setX(i, x);
            posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#ffffff"
                size={0.4}
                transparent
                opacity={0.9}
                sizeAttenuation
            />
        </points>
    );
};
