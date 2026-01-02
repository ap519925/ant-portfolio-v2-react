import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

// Simple Sound Manager Hook
export const useSoundManager = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const soundsRef = useRef({});

    useEffect(() => {
        // Background ambient music - using a free ambient loop
        // Note: For production, replace with your own audio files
        soundsRef.current.bgMusic = new Howl({
            src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'], // Placeholder - replace with ambient music
            loop: true,
            volume: 0.2,
            html5: true, // Better for streaming
        });

        // Footstep sound - simple step sound
        soundsRef.current.footstep = new Howl({
            src: ['https://actions.google.com/sounds/v1/foley/footsteps_on_concrete_fast.ogg'],
            volume: 0.3,
            html5: true,
        });

        // Collection sound - nice chime
        soundsRef.current.collect = new Howl({
            src: ['https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'],
            volume: 0.5,
            html5: true,
        });

        // Particle ambient sound - soft sparkle
        soundsRef.current.ambient = new Howl({
            src: ['https://actions.google.com/sounds/v1/alarms/beep_short.ogg'],
            volume: 0.1,
            loop: true,
            html5: true,
        });

        return () => {
            // Cleanup on unmount
            Object.values(soundsRef.current).forEach(sound => {
                if (sound) sound.unload();
            });
        };
    }, []);

    // Play background music
    useEffect(() => {
        if (musicEnabled && soundEnabled && soundsRef.current.bgMusic) {
            soundsRef.current.bgMusic.play();
        } else if (soundsRef.current.bgMusic) {
            soundsRef.current.bgMusic.pause();
        }
    }, [musicEnabled, soundEnabled]);

    // Play ambient particles sound
    useEffect(() => {
        if (soundEnabled && soundsRef.current.ambient) {
            soundsRef.current.ambient.play();
        } else if (soundsRef.current.ambient) {
            soundsRef.current.ambient.pause();
        }
    }, [soundEnabled]);

    const playSound = (soundName) => {
        if (soundEnabled && soundsRef.current[soundName]) {
            soundsRef.current[soundName].play();
        }
    };

    const toggleSound = () => setSoundEnabled(!soundEnabled);
    const toggleMusic = () => setMusicEnabled(!musicEnabled);

    return {
        soundEnabled,
        musicEnabled,
        playSound,
        toggleSound,
        toggleMusic,
    };
};
