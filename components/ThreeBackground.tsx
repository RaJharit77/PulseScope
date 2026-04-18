'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current

        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#0A0A0A')

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404060)
        scene.add(ambientLight)
        const dirLight = new THREE.DirectionalLight(0xff3366, 0.5)
        dirLight.position.set(-1, 2, 4)
        scene.add(dirLight)
        const dirLight2 = new THREE.DirectionalLight(0x6c63ff, 0.5)
        dirLight2.position.set(1, -1, -2)
        scene.add(dirLight2)

        // Particle system (Stars)
        const particlesGeo = new THREE.BufferGeometry()
        const particlesCount = 3000
        const posArray = new Float32Array(particlesCount * 3)
        for (let i = 0; i < particlesCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 20
            posArray[i + 1] = (Math.random() - 0.5) * 20
            posArray[i + 2] = (Math.random() - 0.5) * 20
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
        const particlesMat = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x6c63ff,
            transparent: true,
            blending: THREE.AdditiveBlending,
        })
        const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
        scene.add(particlesMesh)

        // Floating shapes
        const shapes: THREE.Mesh[] = []
        const geometries = [
            new THREE.IcosahedronGeometry(0.5),
            new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8),
            new THREE.OctahedronGeometry(0.4),
            new THREE.DodecahedronGeometry(0.35),
        ]
        geometries.forEach((geo, i) => {
            const mat = new THREE.MeshPhongMaterial({
                color: `hsl(${i * 60 + 200}, 70%, 60%)`,
                wireframe: true,
                transparent: true,
                opacity: 0.3,
            })
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(
                Math.sin(i * Math.PI * 0.5) * 2,
                Math.cos(i * Math.PI * 0.5) * 2,
                Math.sin(i * Math.PI * 0.3) * 2
            )
            scene.add(mesh)
            shapes.push(mesh) })

        // Animation
        let animationId: number
        const clock = new THREE.Clock()
        const animate = () => {
            const elapsedTime = clock.getElapsedTime()

            particlesMesh.rotation.x = elapsedTime * 0.05
            particlesMesh.rotation.y = elapsedTime * 0.1

            shapes.forEach((mesh) => {
                mesh.rotation.x = elapsedTime * 0.2
                mesh.rotation.y = elapsedTime * 0.3
            })

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
        }
        animate()

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)
            renderer.dispose()
            if (container) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [])

    return <div ref={containerRef} className="fixed inset-0 -z-10" />
}