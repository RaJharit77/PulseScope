'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
    variant?: 'default' | 'stars' | 'waves' | 'grid';
    primaryColor?: string;
    secondaryColor?: string;
}

export default function ThreeBackground({
    variant = 'default',
    primaryColor = '#FF3366',
    secondaryColor = '#6C63FF',
}: ThreeBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0A0A0A');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404060);
        scene.add(ambientLight);
        const dirLight1 = new THREE.DirectionalLight(primaryColor, 0.6);
        dirLight1.position.set(-1, 2, 4);
        scene.add(dirLight1);
        const dirLight2 = new THREE.DirectionalLight(secondaryColor, 0.6);
        dirLight2.position.set(1, -1, -2);
        scene.add(dirLight2);
        const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
        dirLight3.position.set(0, 0, 5);
        scene.add(dirLight3);

        const objects: THREE.Object3D[] = [];

        // Helper: create a particle field
        const createParticleField = (
            count: number,
            palette: string[],
            size: number,
            spread: number,
            yOffset = 0
        ) => {
            const geo = new THREE.BufferGeometry();
            const posArray = new Float32Array(count * 3);
            const colorArray = new Float32Array(count * 3);
            const colors = palette.map(c => new THREE.Color(c));
            for (let i = 0; i < count * 3; i += 3) {
                posArray[i] = (Math.random() - 0.5) * spread;
                posArray[i + 1] = (Math.random() - 0.5) * spread + yOffset;
                posArray[i + 2] = (Math.random() - 0.5) * spread;
                const color = colors[Math.floor(Math.random() * colors.length)];
                colorArray[i] = color.r;
                colorArray[i + 1] = color.g;
                colorArray[i + 2] = color.b;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            const mat = new THREE.PointsMaterial({
                size,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            return new THREE.Points(geo, mat);
        };

        const paletteMix = [primaryColor, secondaryColor, '#33FF66', '#8A2BE2', '#66FF66', '#66B2FF', '#DDA0DD'];

        if (variant === 'stars') {
            const stars = createParticleField(5000, [primaryColor, secondaryColor, '#ffffff', '#66B2FF', '#DDA0DD'], 0.05, 30);
            scene.add(stars);
            objects.push(stars);

            const dust = createParticleField(300, ['#FF3366', '#6C63FF', '#33FF66'], 0.08, 25);
            scene.add(dust);
            objects.push(dust);
        } else if (variant === 'waves') {
            const streamsCount = 5;
            for (let s = 0; s < streamsCount; s++) {
                const pointsCount = 200;
                const geo = new THREE.BufferGeometry();
                const positions = new Float32Array(pointsCount * 3);
                const colors = new Float32Array(pointsCount * 3);
                const color1 = new THREE.Color(primaryColor);
                const color2 = new THREE.Color(secondaryColor);
                for (let i = 0; i < pointsCount; i++) {
                    const t = i / pointsCount;
                    const x = (t - 0.5) * 12;
                    const y = Math.sin(t * Math.PI * 4 + s) * 2;
                    const z = (s - 2) * 1.5;
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = z;
                    const mixed = color1.clone().lerp(color2, t);
                    colors[i * 3] = mixed.r;
                    colors[i * 3 + 1] = mixed.g;
                    colors[i * 3 + 2] = mixed.b;
                }
                geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                const mat = new THREE.PointsMaterial({
                    size: 0.08,
                    vertexColors: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                const line = new THREE.Points(geo, mat);
                scene.add(line);
                objects.push(line);
            }
            const bgParticles = createParticleField(1000, paletteMix, 0.04, 20);
            scene.add(bgParticles);
            objects.push(bgParticles);
        } else { // default / grid -> flux de données abstrait
            const bgStars = createParticleField(4000, paletteMix, 0.04, 25);
            scene.add(bgStars);
            objects.push(bgStars);

            const swirlCount = 3;
            for (let s = 0; s < swirlCount; s++) {
                const count = 300;
                const geo = new THREE.BufferGeometry();
                const positions = new Float32Array(count * 3);
                const colors = new Float32Array(count * 3);
                const color1 = new THREE.Color(primaryColor);
                const color2 = new THREE.Color(secondaryColor);
                for (let i = 0; i < count; i++) {
                    const t = i / count;
                    const angle = t * Math.PI * 6 + s * 2;
                    const radius = 2 + t * 1.5;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle * 2) * 1.5;
                    const z = Math.sin(angle) * radius;
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = z;
                    const mixed = color1.clone().lerp(color2, t);
                    colors[i * 3] = mixed.r;
                    colors[i * 3 + 1] = mixed.g;
                    colors[i * 3 + 2] = mixed.b;
                }
                geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                const mat = new THREE.PointsMaterial({
                    size: 0.06,
                    vertexColors: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                const swirl = new THREE.Points(geo, mat);
                scene.add(swirl);
                objects.push(swirl);
            }

            const dust = createParticleField(600, [primaryColor, secondaryColor, '#33FF66', '#8A2BE2'], 0.05, 15, 1);
            scene.add(dust);
            objects.push(dust);
        }

        // Animation
        const timer = new THREE.Timer();
        const animate = () => {
            const elapsedTime = timer.getElapsed();
            objects.forEach((obj) => {
                if (obj instanceof THREE.Points) {
                    obj.rotation.y += 0.0002;
                    obj.rotation.x += 0.0001;
                }
            });
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [variant, primaryColor, secondaryColor]);

    return <div ref={containerRef} className="fixed inset-0 -z-10" />;
}