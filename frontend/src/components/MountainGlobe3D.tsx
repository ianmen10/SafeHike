import { useEffect, useRef } from 'react';
import * as THREE from 'three';


export default function MountainGlobe3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Create Wireframe / Mesh Mountain Terrain 3D Geometry
    const terrainGeo = new THREE.PlaneGeometry(5, 5, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2.3);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Create multi-peak mountain height distribution using sine waves
      const distFromCenter = Math.sqrt(x * x + y * y);
      const peakHeight = Math.max(
        0,
        Math.cos(distFromCenter * 1.2) * 1.6 +
        Math.sin(x * 2.5) * 0.4 +
        Math.cos(y * 2.5) * 0.4
      );
      posAttr.setZ(i, peakHeight);
    }
    terrainGeo.computeVertexNormals();

    // Cyber Mountain Material (Emerald & Electric Blue Wireframe + Solid Glow)
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x059669, // Emerald green
      wireframe: true,
      emissive: 0x10b981,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.8,
    });
    const mountainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    mountainMesh.position.y = -0.5;
    scene.add(mountainMesh);

    // 2. Add Floating Glowing Orbit Ring / Atmosphere
    const ringGeo = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // 3. Add Floating Particle Stars (Mountain Atmosphere Particles)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particleCoords[i] = (Math.random() - 0.5) * 8;
      particleCoords[i + 1] = Math.random() * 4 - 0.5;
      particleCoords[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b, // Amber glowing particles
      size: 0.04,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Mouse Interaction for 3D Camera Orbiting
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / windowHalfX;
      mouseY = (e.clientY - windowHalfY) / windowHalfY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow 3D Rotation
      mountainMesh.rotation.z = elapsedTime * 0.15;
      ringMesh.rotation.z = -elapsedTime * 0.25;
      particleSystem.rotation.y = elapsedTime * 0.05;

      // Mouse Smooth Drag Reaction
      targetRotationY = mouseX * 0.5;
      targetRotationX = mouseY * 0.3;

      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center overflow-hidden rounded-3xl bg-slate-950/60 border border-emerald-500/20 backdrop-blur-2xl shadow-2xl">
      {/* Background Holographic Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-sky-500/10 pointer-events-none" />
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        VISUALISASI TERRAIN 3D
      </div>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
