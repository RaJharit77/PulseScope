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
        // Lumière supplémentaire pour mieux révéler les couleurs
        const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
        dirLight3.position.set(0, 0, 5);
        scene.add(dirLight3);

        const objects: THREE.Object3D[] = [];

        if (variant === 'stars') {
            // Particules étoilées
            const particlesGeo = new THREE.BufferGeometry();
            const count = 4000;
            const posArray = new Float32Array(count * 3);
            const colorArray = new Float32Array(count * 3);
            const colorsPalette = [
                new THREE.Color('#FF3366'), // rouge
                new THREE.Color('#3366FF'), // bleu
                new THREE.Color('#33FF66'), // vert
                new THREE.Color('#4B0082'), // indigo
                new THREE.Color('#8A2BE2'), // violet
                new THREE.Color('#66B2FF'), // bleu clair
                new THREE.Color('#DDA0DD'), // violet clair
                new THREE.Color('#66FF66'), // vert clair
            ];
            for (let i = 0; i < count * 3; i += 3) {
                posArray[i] = (Math.random() - 0.5) * 30;
                posArray[i + 1] = (Math.random() - 0.5) * 30;
                posArray[i + 2] = (Math.random() - 0.5) * 30;
                const color = colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
                colorArray[i] = color.r;
                colorArray[i + 1] = color.g;
                colorArray[i + 2] = color.b;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            const particlesMat = new THREE.PointsMaterial({
                size: 0.04,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
            });
            const particles = new THREE.Points(particlesGeo, particlesMat);
            scene.add(particles);
            objects.push(particles);
        } else if (variant === 'waves') {
            // Grille ondulante
            const gridHelper = new THREE.GridHelper(20, 40, primaryColor, secondaryColor);
            gridHelper.position.y = -2;
            scene.add(gridHelper);
            objects.push(gridHelper);

            const planeGeo = new THREE.PlaneGeometry(15, 15, 64, 64);
            const planeMat = new THREE.MeshPhongMaterial({
                color: primaryColor,
                wireframe: true,
                transparent: true,
                opacity: 0.15,
            });
            const plane = new THREE.Mesh(planeGeo, planeMat);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = -1;
            scene.add(plane);
            objects.push(plane);
        } else {
            // Formes flottantes (par défaut) – désormais enrichies avec beaucoup de couleurs
            const geometries = [
                new THREE.IcosahedronGeometry(0.6),
                new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8),
                new THREE.OctahedronGeometry(0.5),
                new THREE.DodecahedronGeometry(0.45),
                new THREE.SphereGeometry(0.4, 32, 32),
                new THREE.ConeGeometry(0.4, 0.8, 32),
                new THREE.TorusGeometry(0.5, 0.2, 16, 32),
                new THREE.TetrahedronGeometry(0.5),
                new THREE.IcosahedronGeometry(0.4),
                new THREE.OctahedronGeometry(0.35),
            ];

            // Palette de couleurs claires et vives demandées
            const colorPalette = [
                '#FF3366', // rouge vif
                '#3366FF', // bleu
                '#33FF66', // vert
                '#4B0082', // indigo
                '#8A2BE2', // violet
                '#66B2FF', // bleu clair
                '#FF6666', // rouge clair
                '#66FF66', // vert clair
                '#7B68EE', // indigo clair
                '#DDA0DD', // violet clair
            ];

            geometries.forEach((geo, i) => {
                const color = colorPalette[i % colorPalette.length];
                const mat = new THREE.MeshPhongMaterial({
                    color,
                    wireframe: i % 2 === 0,
                    transparent: true,
                    opacity: i % 2 === 0 ? 0.25 : 0.4,
                });
                const mesh = new THREE.Mesh(geo, mat);

                // Répartition en cercle avec un léger offset vertical
                const angle = (i / geometries.length) * Math.PI * 2;
                const radius = 2.5;
                mesh.position.x = Math.cos(angle) * radius;
                mesh.position.y = Math.sin(i * 1.2) * 1.5;
                mesh.position.z = Math.sin(angle) * radius;
                scene.add(mesh);
                objects.push(mesh);
            });

            // Ajout de quelques petites sphères lumineuses au centre
            const centerGlowGeo = new THREE.SphereGeometry(0.15, 16, 16);
            for (let j = 0; j < 6; j++) {
                const color = colorPalette[j % colorPalette.length];
                const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
                const glow = new THREE.Mesh(centerGlowGeo, mat);
                const angle = (j / 6) * Math.PI * 2;
                glow.position.set(Math.cos(angle) * 1.2, Math.sin(j * 0.7) * 0.8, Math.sin(angle) * 1.2);
                scene.add(glow);
                objects.push(glow);
            }
        }

        // Animation
        const clock = new THREE.Clock();
        let animationId: number;
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            objects.forEach((obj) => {
                if (obj instanceof THREE.Points) {
                    obj.rotation.y = elapsedTime * 0.03;
                    obj.rotation.x = elapsedTime * 0.01;
                } else if (obj instanceof THREE.GridHelper) {
                    obj.position.z = Math.sin(elapsedTime * 0.2) * 2;
                } else if (obj instanceof THREE.Mesh) {
                    // Rotation individuelle plus dynamique
                    obj.rotation.x = elapsedTime * 0.15 * (obj.position.y > 0 ? 1 : -1);
                    obj.rotation.y = elapsedTime * 0.25 * (obj.position.x > 0 ? 1 : -1);
                }
            });

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
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
            cancelAnimationFrame(animationId);
            renderer.dispose();
            if (container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [variant, primaryColor, secondaryColor]);

    return <div ref={containerRef} className="fixed inset-0 -z-10" />;
}