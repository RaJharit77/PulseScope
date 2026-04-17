'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
    const ref = useRef<THREE.Points>(null)

    const count = 2000
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10
            positions[i + 1] = (Math.random() - 0.5) * 10
            positions[i + 2] = (Math.random() - 0.5) * 10
        }
        return positions
    }, [])

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.getElapsedTime() * 0.05
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.1
        }
    })

    return (
        <Points ref={ref} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#6C63FF"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    )
}

function FloatingShapes() {
    const groupRef = useRef<THREE.Group>(null)

    const geometries = [
        new THREE.IcosahedronGeometry(0.5),
        new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8),
        new THREE.OctahedronGeometry(0.4),
        new THREE.DodecahedronGeometry(0.35),
    ]

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
        }
    })

    return (
        <group ref={groupRef}>
            {geometries.map((geometry, index) => (
                <mesh
                    key={index}
                    geometry={geometry}
                    position={[
                        Math.sin(index * Math.PI * 0.5) * 2,
                        Math.cos(index * Math.PI * 0.5) * 2,
                        Math.sin(index * Math.PI * 0.3) * 2
                    ]}
                >
                    <meshPhongMaterial
                        color={`hsl(${index * 60 + 200}, 70%, 60%)`}
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            ))}
        </group>
    )
}

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF3366" />
                <ParticleField />
                <FloatingShapes />
            </Canvas>
        </div>
    )
}