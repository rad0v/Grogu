"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.2, 8.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-0.16, 0.18, -0.08);
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xaaa3d4, 2.6);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xf4efff, 4.4);
    keyLight.position.set(-3, 4, 6);
    scene.add(keyLight);
    const violetLight = new THREE.PointLight(0x7b3fe4, 18, 10);
    violetLight.position.set(2, -1, 4);
    scene.add(violetLight);

    const blockGeometry = new THREE.BoxGeometry(1.25, 1.25, 1.25);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x7c45db, roughness: 0.26, metalness: 0.15 }),
      new THREE.MeshStandardMaterial({ color: 0xd0c8ef, roughness: 0.3, metalness: 0.08 }),
      new THREE.MeshStandardMaterial({ color: 0x29223e, roughness: 0.32, metalness: 0.25 }),
    ];
    const blocks = [
      { position: [-1.75, 0.85, 0.2], scale: 0.72, material: 0 },
      { position: [0.15, 1.05, -0.1], scale: 1.1, material: 1 },
      { position: [1.65, 0.35, 0.25], scale: 0.62, material: 0 },
      { position: [-0.95, -1.1, 0.1], scale: 0.82, material: 2 },
      { position: [1.05, -1.2, -0.25], scale: 0.52, material: 1 },
    ];

    const meshes = blocks.map(({ position, scale, material }, index) => {
      const mesh = new THREE.Mesh(blockGeometry, materials[material]);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.scale.setScalar(scale);
      mesh.rotation.set(index * 0.12, index * -0.22, index * 0.08);
      mesh.userData.baseY = position[1];
      mesh.userData.phase = index * 0.9;
      group.add(mesh);
      return mesh;
    });

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xbeb6e8, transparent: true, opacity: 0.26 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.012, 8, 96), ringMaterial);
    ring.rotation.set(1.14, 0.2, 0.2);
    ring.position.z = -0.7;
    group.add(ring);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.009, 8, 96), ringMaterial.clone());
    innerRing.material.opacity = 0.18;
    innerRing.rotation.set(1.08, -0.4, 0.45);
    innerRing.position.z = -0.65;
    group.add(innerRing);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(90 * 3);
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (Math.random() - 0.5) * 7;
      starPositions[index + 1] = (Math.random() - 0.5) * 5.5;
      starPositions[index + 2] = -1.7 - Math.random() * 2;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xaaa1d1, size: 0.018, transparent: true, opacity: 0.7 }),
    );
    group.add(stars);

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y += (pointer.x * 0.08 - group.rotation.y + 0.18) * 0.018;
      group.rotation.x += (-pointer.y * 0.045 - group.rotation.x + -0.16) * 0.018;
      meshes.forEach((mesh, index) => {
        mesh.position.y = mesh.userData.baseY + Math.sin(elapsed * 0.8 + mesh.userData.phase) * 0.08;
        mesh.rotation.x += 0.0012 + index * 0.0002;
        mesh.rotation.y -= 0.0015;
      });
      ring.rotation.z += 0.0015;
      innerRing.rotation.z -= 0.001;
      stars.rotation.y = elapsed * 0.008;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      blockGeometry.dispose();
      materials.forEach((material) => material.dispose());
      ring.geometry.dispose();
      ringMaterial.dispose();
      innerRing.geometry.dispose();
      (innerRing.material as THREE.Material).dispose();
      starGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className="absolute inset-0" />;
}