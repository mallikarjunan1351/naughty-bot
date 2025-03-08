'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  theme?: 'dark' | 'light';
  intensity?: 'high' | 'low';
}

export default function AnimatedBackground({ 
  theme = 'dark', 
  intensity = 'high' 
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Use state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to true when component mounts on client
    setIsMounted(true);
    
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    // Reduce particle count for low intensity
    const particlesCount = intensity === 'high' ? 2000 : 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Set particle color based on theme
    const particleColor = theme === 'dark' 
      ? '#3b82f6' // Blue for dark theme
      : '#93c5fd'; // Lighter blue for light theme
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: intensity === 'high' ? 0.005 : 0.003, // Smaller particles for low intensity
      color: new THREE.Color(particleColor),
      transparent: true,
      opacity: intensity === 'high' ? 1 : 0.5, // Lower opacity for low intensity
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Position camera
    camera.position.z = 2;

    // Animation
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Slower rotation for low intensity
      const rotationSpeed = intensity === 'high' ? 0.0005 : 0.0002;
      particlesMesh.rotation.x += rotationSpeed;
      particlesMesh.rotation.y += rotationSpeed;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [theme, intensity]);

  // Get background gradient based on theme and intensity
  const getBackgroundClass = () => {
    if (theme === 'dark') {
      return intensity === 'high'
        ? "absolute inset-0 bg-gradient-to-br from-gray-900 to-blue-900"
        : "absolute inset-0 bg-gradient-to-br from-gray-900/90 to-blue-900/70";
    } else {
      return intensity === 'high'
        ? "absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"
        : "absolute inset-0 bg-gradient-to-br from-blue-50/90 to-indigo-100/70";
    }
  };

  // Return a simple div during server-side rendering
  if (!isMounted) {
    return <div ref={containerRef} className={getBackgroundClass()} />;
  }

  return <div ref={containerRef} className={getBackgroundClass()} />;
} 