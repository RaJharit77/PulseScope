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
        // Fond très sombre, quasi-noir avec une légère teinte bleue/violette
        scene.background = new THREE.Color('#050508');
        // Brouillard subtil pour accentuer l'effet de profondeur
        scene.fog = new THREE.FogExp2('#050508', 0.03);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        // Caméra légèrement au-dessus du plan miroir
        camera.position.y = 0.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Activer les ombres pour plus de profondeur
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Couleurs très sombres (désaturées à ~15% de leur valeur d'origine)
        const dimColor = (hex: string, factor = 0.15): string => {
            const c = new THREE.Color(hex);
            c.multiplyScalar(factor);
            return `#${c.getHexString()}`;
        };

        const dimPrimary = dimColor(primaryColor, 0.2);
        const dimSecondary = dimColor(secondaryColor, 0.2);

        // Lumières très tamisées
        const ambientLight = new THREE.AmbientLight(0x05050a, 1.0);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(primaryColor, 0.08);
        dirLight1.position.set(-1, 2, 4);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(secondaryColor, 0.08);
        dirLight2.position.set(1, -1, -2);
        scene.add(dirLight2);

        const objects: THREE.Object3D[] = [];
        const mirrorObjects: THREE.Object3D[] = [];

        // Plan miroir horizontal (une surface réfléchissante sombre)
        const mirrorGeometry = new THREE.PlaneGeometry(60, 60);
        const mirrorMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#0a0a12'),
            metalness: 0.95,
            roughness: 0.05,
            envMapIntensity: 1.0,
            transparent: true,
            opacity: 0.7,
        });
        const mirrorPlane = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirrorPlane.rotation.x = -Math.PI / 2;
        mirrorPlane.position.y = -3;
        scene.add(mirrorPlane);

        // Helper: créer un champ de particules
        const createParticleField = (
            count: number,
            palette: string[],
            size: number,
            spread: number,
            yOffset = 0,
            dimFactor = 1.0
        ) => {
            const geo = new THREE.BufferGeometry();
            const posArray = new Float32Array(count * 3);
            const colorArray = new Float32Array(count * 3);
            const colors = palette.map(c => {
                const col = new THREE.Color(c);
                col.multiplyScalar(dimFactor);
                return col;
            });
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
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            return new THREE.Points(geo, mat);
        };

        // Helper: créer l'image miroir d'un objet (symétrie Y autour du plan miroir)
        const createMirror = (original: THREE.Points, mirrorY = -3): THREE.Points => {
            const origGeo = original.geometry as THREE.BufferGeometry;
            const origPos = origGeo.attributes.position.array as Float32Array;
            const origColor = origGeo.attributes.color.array as Float32Array;

            const mirrorGeo = new THREE.BufferGeometry();
            const mirrorPos = new Float32Array(origPos.length);
            const mirrorColor = new Float32Array(origColor.length);

            for (let i = 0; i < origPos.length; i += 3) {
                mirrorPos[i] = origPos[i];
                // Réflexion par rapport au plan miroir
                mirrorPos[i + 1] = 2 * mirrorY - origPos[i + 1];
                mirrorPos[i + 2] = origPos[i + 2];
                // Couleurs plus sombres pour le reflet
                mirrorColor[i] = origColor[i] * 0.4;
                mirrorColor[i + 1] = origColor[i + 1] * 0.4;
                mirrorColor[i + 2] = origColor[i + 2] * 0.4;
            }

            mirrorGeo.setAttribute('position', new THREE.BufferAttribute(mirrorPos, 3));
            mirrorGeo.setAttribute('color', new THREE.BufferAttribute(mirrorColor, 3));

            const origMat = original.material as THREE.PointsMaterial;
            const mirrorMat = new THREE.PointsMaterial({
                size: origMat.size * 0.7,
                vertexColors: true,
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });

            return new THREE.Points(mirrorGeo, mirrorMat);
        };

        const paletteMix = [dimPrimary, dimSecondary, '#0a2010', '#100820', '#0a0a1a', '#0a1020', '#141020'];

        if (variant === 'stars') {
            const stars = createParticleField(
                5000,
                [primaryColor, secondaryColor, '#ffffff', '#66B2FF', '#DDA0DD'],
                0.04, 30, 0, 0.12
            );
            scene.add(stars);
            objects.push(stars);

            const mirrorStars = createMirror(stars);
            scene.add(mirrorStars);
            mirrorObjects.push(mirrorStars);

            const dust = createParticleField(300, [primaryColor, secondaryColor, '#33FF66'], 0.06, 25, 0, 0.1);
            scene.add(dust);
            objects.push(dust);

            const mirrorDust = createMirror(dust);
            scene.add(mirrorDust);
            mirrorObjects.push(mirrorDust);

        } else if (variant === 'waves') {
            const streamsCount = 5;
            for (let s = 0; s < streamsCount; s++) {
                const pointsCount = 200;
                const geo = new THREE.BufferGeometry();
                const positions = new Float32Array(pointsCount * 3);
                const colors = new Float32Array(pointsCount * 3);
                const color1 = new THREE.Color(primaryColor).multiplyScalar(0.18);
                const color2 = new THREE.Color(secondaryColor).multiplyScalar(0.18);
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
                    size: 0.06,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.7,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                const wave = new THREE.Points(geo, mat);
                scene.add(wave);
                objects.push(wave);

                // Reflet miroir de la vague
                const mirrorGeo = new THREE.BufferGeometry();
                const mirrorPos = new Float32Array(pointsCount * 3);
                const mirrorColors = new Float32Array(pointsCount * 3);
                const mirrorY = -3;
                for (let i = 0; i < pointsCount * 3; i += 3) {
                    mirrorPos[i] = positions[i];
                    mirrorPos[i + 1] = 2 * mirrorY - positions[i + 1];
                    mirrorPos[i + 2] = positions[i + 2];
                    mirrorColors[i] = colors[i] * 0.35;
                    mirrorColors[i + 1] = colors[i + 1] * 0.35;
                    mirrorColors[i + 2] = colors[i + 2] * 0.35;
                }
                mirrorGeo.setAttribute('position', new THREE.BufferAttribute(mirrorPos, 3));
                mirrorGeo.setAttribute('color', new THREE.BufferAttribute(mirrorColors, 3));
                const mirrorMat = new THREE.PointsMaterial({
                    size: 0.04,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.2,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                const mirrorWave = new THREE.Points(mirrorGeo, mirrorMat);
                scene.add(mirrorWave);
                mirrorObjects.push(mirrorWave);
            }

            const bgParticles = createParticleField(1000, paletteMix, 0.04, 20, 0, 1.0);
            scene.add(bgParticles);
            objects.push(bgParticles);

        } else {
            // default — flux de données abstrait avec spirales
            const bgStars = createParticleField(4000, paletteMix, 0.035, 25, 0, 1.0);
            scene.add(bgStars);
            objects.push(bgStars);

            const mirrorBg = createMirror(bgStars);
            scene.add(mirrorBg);
            mirrorObjects.push(mirrorBg);

            const swirlCount = 3;
            for (let s = 0; s < swirlCount; s++) {
                const count = 300;
                const geo = new THREE.BufferGeometry();
                const positions = new Float32Array(count * 3);
                const colors = new Float32Array(count * 3);
                const color1 = new THREE.Color(primaryColor).multiplyScalar(0.15);
                const color2 = new THREE.Color(secondaryColor).multiplyScalar(0.15);
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
                    size: 0.05,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.75,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                const swirl = new THREE.Points(geo, mat);
                scene.add(swirl);
                objects.push(swirl);

                // Reflet spirale
                const mirrorGeo = new THREE.BufferGeometry();
                const mirrorPos = new Float32Array(count * 3);
                const mirrorColors = new Float32Array(count * 3);
                const mirrorY = -3;
                for (let i = 0; i < count * 3; i += 3) {
                    mirrorPos[i] = positions[i];
                    mirrorPos[i + 1] = 2 * mirrorY - positions[i + 1];
                    mirrorPos[i + 2] = positions[i + 2];
                    mirrorColors[i] = colors[i] * 0.4;
                    mirrorColors[i + 1] = colors[i + 1] * 0.4;
                    mirrorColors[i + 2] = colors[i + 2] * 0.4;
                }
                mirrorGeo.setAttribute('position', new THREE.BufferAttribute(mirrorPos, 3));
                mirrorGeo.setAttribute('color', new THREE.BufferAttribute(mirrorColors, 3));
                const mirrorMat = new THREE.PointsMaterial({
                    size: 0.035,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.2,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                const mirrorSwirl = new THREE.Points(mirrorGeo, mirrorMat);
                scene.add(mirrorSwirl);
                mirrorObjects.push(mirrorSwirl);
            }

            const dust = createParticleField(600, [dimPrimary, dimSecondary, '#051005', '#080520'], 0.045, 15, 1, 1.0);
            scene.add(dust);
            objects.push(dust);
        }

        // Ligne de séparation miroir (fine ligne lumineuse sur le plan)
        const lineGeo = new THREE.BufferGeometry();
        const linePoints = [];
        for (let i = -25; i <= 25; i += 0.2) {
            linePoints.push(i, -3, 0);
        }
        lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePoints), 3));
        const lineMat = new THREE.PointsMaterial({
            color: new THREE.Color(primaryColor).multiplyScalar(0.3),
            size: 0.02,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const horizLine = new THREE.Points(lineGeo, lineMat);
        scene.add(horizLine);

        // Animation
        let animId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            objects.forEach((obj, i) => {
                if (obj instanceof THREE.Points) {
                    obj.rotation.y += 0.00015;
                    obj.rotation.x += 0.00008;
                }
            });

            // Les reflets suivent exactement les objets originaux (même rotation)
            mirrorObjects.forEach((obj, i) => {
                if (obj instanceof THREE.Points && objects[i] instanceof THREE.Points) {
                    obj.rotation.y = objects[i].rotation.y;
                    obj.rotation.x = -objects[i].rotation.x; // inversé pour l'effet miroir
                }
            });

            // Légère oscillation verticale de la caméra
            camera.position.y = 0.5 + Math.sin(elapsed * 0.15) * 0.1;

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [variant, primaryColor, secondaryColor]);

    return (
        <>
            <div ref={containerRef} className="fixed inset-0 -z-10" />
            {/* Overlay gradient pour accentuer l'effet miroir/sombre */}
            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.04) 0%, transparent 60%),
                        radial-gradient(ellipse at 50% 100%, rgba(255,51,102,0.03) 0%, transparent 60%),
                        linear-gradient(to bottom,
                            rgba(5,5,8,0.0) 0%,
                            rgba(5,5,8,0.3) 45%,
                            rgba(8,8,14,0.85) 55%,
                            rgba(5,5,8,0.95) 100%
                        )
                    `,
                }}
            />
        </>
    );
}