import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Pause,
  Play,
  RotateCw,
  Info,
  Maximize2,
  Minimize2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { getTranslation } from '../../i18n/translations';

export interface CircularStage {
  id: string;
  step: number;
  label: string;
  sublabel: string;
  description: string;
  metric: string;
  color: string;
}

export const CIRCULAR_STAGES: CircularStage[] = [
  {
    id: 'collect',
    step: 1,
    label: 'Collect',
    sublabel: 'Informal Gathering',
    description: 'Informal collectors in Nashik aggregate discarded electronics, circuit boards, and cables with direct livelihood protection.',
    metric: '1,284 Active Collectors',
    color: '#10b981', // emerald
  },
  {
    id: 'classify',
    step: 2,
    label: 'Classify',
    sublabel: 'AI Computer Vision',
    description: 'Gemini multimodal AI identifies material categories, component densities, and hazard ratings from a single photograph.',
    metric: '91.4% Accuracy',
    color: '#06b6d4', // cyan
  },
  {
    id: 'value',
    step: 3,
    label: 'Value',
    sublabel: 'Fair Price Engine',
    description: 'Deterministic price discovery computes fair lot value using live authorized industrial bids (+₹350 formal gain).',
    metric: '+₹350 Net Advantage',
    color: '#3b82f6', // blue
  },
  {
    id: 'match',
    step: 4,
    label: 'Match',
    sublabel: 'Authorized Recyclers',
    description: 'Weighted algorithmic matching pairs lots with verified MPCB/CPCB recyclers based on pricing, proximity, and pickup.',
    metric: '48 Verified Facilities',
    color: '#8b5cf6', // purple
  },
  {
    id: 'handover',
    step: 5,
    label: 'Handover',
    sublabel: 'Digital Custody Record',
    description: 'Calibrated scale verification and cryptographic QR tokens generate a tamper-evident digital receipt with instant UPI.',
    metric: '100% Weight Audited',
    color: '#f59e0b', // amber
  },
  {
    id: 'recycle',
    step: 6,
    label: 'Recycle',
    sublabel: 'Eco-Compliant Treatment',
    description: 'Authorized facilities dismantle, shred, and neutralize toxics in compliance with national EPR mandates without open burning.',
    metric: '0 kg Toxic Open Burn',
    color: '#14b8a6', // teal
  },
  {
    id: 'recover',
    step: 7,
    label: 'Recover',
    sublabel: 'Urban Mineral Mining',
    description: 'High-purity gold (99.9%), electrolytic copper, palladium, and lithium are recovered and returned to electronics manufacturing.',
    metric: '218.4 T Materials Diverted',
    color: '#eab308', // yellow-gold
  },
];

interface CircularEconomy3DSceneProps {
  language?: AppLanguage;
  onExploreStage?: (stageId: string) => void;
  className?: string;
  compact?: boolean;
}

export const CircularEconomy3DScene: React.FC<CircularEconomy3DSceneProps> = ({
  language = 'en',
  onExploreStage,
  className = '',
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [hoveredObjectLabel, setHoveredObjectLabel] = useState<string | null>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const isReducedMotionRef = useRef<boolean>(false);

  // Check WebGL availability
  const checkWebGL = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      isReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    if (!checkWebGL()) {
      setWebGlSupported(false);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 8.5);
    camera.lookAt(0, 0, 0);

    // 2. Renderer with performance optimizations
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio <= 1.5,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      rendererRef.current = renderer;
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 3. Lighting (Soft, climate-tech ambiance)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 1.6); // emerald
    dirLight1.position.set(6, 10, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.2); // cyan
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    const centralGlowLight = new THREE.PointLight(0x34d399, 2.0, 10);
    centralGlowLight.position.set(0, 0, 0);
    scene.add(centralGlowLight);

    // 4. Central Circular Structure (The Circular Hub)
    const hubGroup = new THREE.Group();
    scene.add(hubGroup);

    // Central circular core
    const coreGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.2, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x047857,
      emissiveIntensity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    hubGroup.add(coreMesh);

    // Inner glowing ring
    const innerRingGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x34d399,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, ringMat);
    innerRingMesh.rotation.x = Math.PI / 2;
    hubGroup.add(innerRingMesh);

    // Outer segmented orbital track
    const outerTrackGeo = new THREE.TorusGeometry(3.2, 0.025, 12, 64);
    const trackMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.45,
    });
    const outerTrackMesh = new THREE.Mesh(outerTrackGeo, trackMat);
    outerTrackMesh.rotation.x = Math.PI / 2;
    hubGroup.add(outerTrackMesh);

    // Secondary subtle orbit ring
    const secondaryTrackGeo = new THREE.TorusGeometry(4.0, 0.015, 8, 48);
    const secondaryTrackMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.25,
    });
    const secondaryTrackMesh = new THREE.Mesh(secondaryTrackGeo, secondaryTrackMat);
    secondaryTrackMesh.rotation.x = Math.PI / 2;
    hubGroup.add(secondaryTrackMesh);

    // 5. Stage Nodes on Orbit Track
    const stageNodesGroup = new THREE.Group();
    hubGroup.add(stageNodesGroup);
    const stageMeshes: THREE.Mesh[] = [];

    const numStages = CIRCULAR_STAGES.length;
    CIRCULAR_STAGES.forEach((stage, idx) => {
      const angle = (idx / numStages) * Math.PI * 2;
      const radius = 3.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const nodeGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(stage.color),
        emissive: new THREE.Color(stage.color),
        emissiveIntensity: 0.8,
        roughness: 0.3,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, 0, z);
      (nodeMesh as any).stageIndex = idx;
      stageMeshes.push(nodeMesh);
      stageNodesGroup.add(nodeMesh);
    });

    // 6. Floating Procedural E-Waste and Mineral Objects
    const floatingObjectsGroup = new THREE.Group();
    scene.add(floatingObjectsGroup);

    interface FloatingItem {
      mesh: THREE.Group | THREE.Mesh;
      baseAngle: number;
      orbitRadius: number;
      speed: number;
      rotSpeed: { x: number; y: number; z: number };
      floatOffset: number;
      name: string;
    }

    const floatingItems: FloatingItem[] = [];

    // Helper: Material palette
    const darkChassisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const pcbGreenMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.5, metalness: 0.3 });
    const silverPinMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const batteryYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.4, roughness: 0.4 });

    // 1) Smartphone Object
    const phoneGroup = new THREE.Group();
    const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.25, 0.08), darkChassisMat);
    const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 1.15), screenMat);
    phoneScreen.position.z = 0.045;
    const phoneCamera = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12), silverPinMat);
    phoneCamera.rotation.x = Math.PI / 2;
    phoneCamera.position.set(0.2, 0.45, -0.045);
    phoneGroup.add(phoneBody, phoneScreen, phoneCamera);
    floatingObjectsGroup.add(phoneGroup);
    floatingItems.push({
      mesh: phoneGroup,
      baseAngle: 0.2,
      orbitRadius: 2.2,
      speed: 0.28,
      rotSpeed: { x: 0.008, y: 0.012, z: 0.004 },
      floatOffset: 0,
      name: 'Smartphone (High Grade PCB & Cobalt)',
    });

    // 2) Laptop Object
    const laptopGroup = new THREE.Group();
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.8), darkChassisMat);
    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 0.05), darkChassisMat);
    laptopScreen.position.set(0, 0.36, -0.4);
    laptopScreen.rotation.x = -0.25;
    const laptopDisplay = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.65), screenMat);
    laptopDisplay.position.set(0, 0.36, -0.37);
    laptopDisplay.rotation.x = -0.25;
    laptopGroup.add(laptopBase, laptopScreen, laptopDisplay);
    floatingObjectsGroup.add(laptopGroup);
    floatingItems.push({
      mesh: laptopGroup,
      baseAngle: 1.4,
      orbitRadius: 2.7,
      speed: 0.22,
      rotSpeed: { x: 0.006, y: 0.009, z: 0.003 },
      floatOffset: 1.2,
      name: 'Laptop Chassis (Aluminum & Motherboard)',
    });

    // 3) Printed Circuit Board (PCB)
    const pcbGroup = new THREE.Group();
    const pcbBoard = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.8), pcbGreenMat);
    const chip1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.3), darkChassisMat);
    chip1.position.set(-0.25, 0.04, -0.15);
    const chip2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.25), darkChassisMat);
    chip2.position.set(0.25, 0.03, 0.15);
    const traceGold = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.08), goldMat);
    traceGold.rotation.x = -Math.PI / 2;
    traceGold.position.set(0, 0.03, 0);
    pcbGroup.add(pcbBoard, chip1, chip2, traceGold);
    floatingObjectsGroup.add(pcbGroup);
    floatingItems.push({
      mesh: pcbGroup,
      baseAngle: 2.6,
      orbitRadius: 2.3,
      speed: 0.32,
      rotSpeed: { x: 0.01, y: 0.014, z: 0.006 },
      floatOffset: 2.5,
      name: 'Populated PCB (Gold & Copper Traces)',
    });

    // 4) Cylindrical Battery Cell
    const batteryGroup = new THREE.Group();
    const batteryBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.8, 16), batteryYellowMat);
    const batteryCap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12), silverPinMat);
    batteryCap.position.y = 0.42;
    const batteryBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.04, 16), silverPinMat);
    batteryBottom.position.y = -0.4;
    batteryGroup.add(batteryBody, batteryCap, batteryBottom);
    floatingObjectsGroup.add(batteryGroup);
    floatingItems.push({
      mesh: batteryGroup,
      baseAngle: 3.8,
      orbitRadius: 2.5,
      speed: 0.25,
      rotSpeed: { x: 0.012, y: 0.008, z: 0.01 },
      floatOffset: 3.7,
      name: 'Lithium-Ion Cell (Cobalt, Lithium & Nickel)',
    });

    // 5) Integrated Circuit (IC Microchip)
    const icGroup = new THREE.Group();
    const icBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), darkChassisMat);
    // Silver pins along sides
    for (let p = -0.18; p <= 0.18; p += 0.09) {
      const pinL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.04), silverPinMat);
      pinL.position.set(-0.3, -0.02, p);
      const pinR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.04), silverPinMat);
      pinR.position.set(0.3, -0.02, p);
      icGroup.add(pinL, pinR);
    }
    icGroup.add(icBody);
    floatingObjectsGroup.add(icGroup);
    floatingItems.push({
      mesh: icGroup,
      baseAngle: 4.8,
      orbitRadius: 2.1,
      speed: 0.35,
      rotSpeed: { x: 0.015, y: 0.018, z: 0.005 },
      floatOffset: 4.8,
      name: 'Silicon IC Processor (Gold Wire Bonding)',
    });

    // 6) Recycled Copper Metal Ingot
    const copperIngot = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.25, 0.35), copperMat);
    floatingObjectsGroup.add(copperIngot);
    floatingItems.push({
      mesh: copperIngot,
      baseAngle: 5.6,
      orbitRadius: 2.6,
      speed: 0.26,
      rotSpeed: { x: 0.007, y: 0.011, z: 0.009 },
      floatOffset: 5.4,
      name: 'Recovered Electrolytic Copper Ingot',
    });

    // 7) Recycled Pure Gold Recovery Cube
    const goldCube = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), goldMat);
    floatingObjectsGroup.add(goldCube);
    floatingItems.push({
      mesh: goldCube,
      baseAngle: 0.9,
      orbitRadius: 2.8,
      speed: 0.3,
      rotSpeed: { x: 0.014, y: 0.014, z: 0.014 },
      floatOffset: 2.0,
      name: '99.9% Recovered Fine Gold Bullion',
    });

    // 7. Realistic Physical Material Particles (Copper fragments, PCB flakes, Aluminum, IC chips, Gold granules)
    const realisticParticlesGroup = new THREE.Group();
    const materialGeometries = [
      new THREE.BoxGeometry(0.06, 0.04, 0.02), // PCB fragment
      new THREE.TetrahedronGeometry(0.04), // Copper chunk
      new THREE.BoxGeometry(0.05, 0.05, 0.01), // Aluminum flake
      new THREE.BoxGeometry(0.07, 0.05, 0.03), // IC chip package
      new THREE.DodecahedronGeometry(0.035), // Recycled metal nugget
    ];

    const materialMats = [
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6, metalness: 0.2 }), // Dark green PCB
      new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.25, metalness: 0.85 }), // Reddish copper
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.9 }), // Aluminum
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.1 }), // IC chip black polymer
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95 }), // Recovered Gold
    ];

    const particleCount = compact ? 30 : 60;
    interface ParticleData {
      mesh: THREE.Mesh;
      orbitRadius: number;
      angle: number;
      speed: number;
      rotSpeed: { x: number; y: number; z: number };
      baseY: number;
      floatPhase: number;
    }
    const physicalParticles: ParticleData[] = [];

    for (let i = 0; i < particleCount; i++) {
      const geoIdx = Math.floor(Math.random() * materialGeometries.length);
      const pMesh = new THREE.Mesh(materialGeometries[geoIdx], materialMats[geoIdx]);
      pMesh.castShadow = true;

      const orbitRadius = 1.6 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const baseY = (Math.random() - 0.5) * 2.0;

      pMesh.position.set(
        Math.cos(angle) * orbitRadius,
        baseY,
        Math.sin(angle) * orbitRadius
      );
      pMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      realisticParticlesGroup.add(pMesh);
      physicalParticles.push({
        mesh: pMesh,
        orbitRadius,
        angle,
        speed: (0.15 + Math.random() * 0.3) * (Math.random() > 0.3 ? 1 : -1),
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.04,
          y: (Math.random() - 0.5) * 0.04,
          z: (Math.random() - 0.5) * 0.04,
        },
        baseY,
        floatPhase: Math.random() * Math.PI * 2,
      });
    }

    scene.add(realisticParticlesGroup);

    // 8. Mouse Parallax Handling
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.35;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.45;
      mouseY = y * 0.35;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 9. Raycasting for hover tooltip
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(stageMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as any;
        if (hit.stageIndex !== undefined) {
          setActiveStageIndex(hit.stageIndex);
        }
      }
    };

    canvas.addEventListener('mousemove', handlePointerMove);

    // 10. Visibility & Resize Observer
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width || 800;
        const newHeight = entry.contentRect.height || 450;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 11. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera tilt from mouse
      targetRotX = 0.35 + mouseY;
      targetRotY = mouseX;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;

      if (!isReducedMotionRef.current && isPlaying) {
        // Hub slow rotation
        hubGroup.rotation.y += 0.003;

        // Floating objects slow orbit
        floatingItems.forEach((item, idx) => {
          const currentAngle = item.baseAngle + elapsed * (item.speed * 0.4);
          const x = Math.cos(currentAngle) * item.orbitRadius;
          const z = Math.sin(currentAngle) * item.orbitRadius;
          const y = Math.sin(elapsed * 1.2 + item.floatOffset) * 0.35;

          item.mesh.position.set(x, y, z);
          item.mesh.rotation.x += item.rotSpeed.x;
          item.mesh.rotation.y += item.rotSpeed.y;
          item.mesh.rotation.z += item.rotSpeed.z;
        });

        // Realistic physical scrap particles orbital and tumbling motion
        physicalParticles.forEach((p) => {
          const currentAngle = p.angle + elapsed * (p.speed * 0.5);
          const x = Math.cos(currentAngle) * p.orbitRadius;
          const z = Math.sin(currentAngle) * p.orbitRadius;
          const y = p.baseY + Math.sin(elapsed * 1.5 + p.floatPhase) * 0.15;

          p.mesh.position.set(x, y, z);
          p.mesh.rotation.x += p.rotSpeed.x;
          p.mesh.rotation.y += p.rotSpeed.y;
          p.mesh.rotation.z += p.rotSpeed.z;
        });

        // Pulse the active stage node
        stageMeshes.forEach((mesh, idx) => {
          if (idx === activeStageIndex) {
            const scale = 1.0 + Math.sin(elapsed * 4) * 0.25;
            mesh.scale.set(scale, scale, scale);
          } else {
            mesh.scale.set(1, 1, 1);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [checkWebGL, compact, isPlaying, activeStageIndex]);

  // Fallback if WebGL is disabled or failed
  if (!webGlSupported) {
    return (
      <div className={`relative bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 overflow-hidden ${className}`}>
        <div className="text-center max-w-lg mx-auto space-y-4 py-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/80 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Circular Economy Visual System (Standard Mode)</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            From Collection to Circularity
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            E-Cycle Bridge creates a seamless bridge from informal collectors to verified MPCB/CPCB recyclers, recovering critical minerals and eliminating hazardous open burning.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
            {CIRCULAR_STAGES.slice(0, 4).map((s) => (
              <div key={s.id} className="bg-white/5 border border-white/10 p-3 rounded-xl text-left">
                <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold">
                  {s.label}
                </span>
                <span className="text-xs text-slate-300 mt-1 block">{s.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentStage = CIRCULAR_STAGES[activeStageIndex];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shadow-xs select-none ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating Controls & Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center space-x-2 bg-stone-900/90 border border-stone-700 text-stone-200 px-3 py-1 rounded-lg text-xs font-medium pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[11px] tracking-wide">Circular Custody Flow Model</span>
        </div>

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
            className="p-1.5 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            title="Toggle Stage Info Overlay"
            className="p-1.5 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stage Sequence Navigation Bar (Bottom Center) */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Stages Pill Strip */}
        <div className="flex items-center space-x-1 bg-stone-900/95 p-1 rounded-xl border border-stone-800 pointer-events-auto overflow-x-auto max-w-full">
          {CIRCULAR_STAGES.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => {
                setActiveStageIndex(idx);
                if (onExploreStage) onExploreStage(st.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeStageIndex === idx
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <span className="text-[10px] opacity-70">0{idx + 1}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Informative Stage Highlight Card */}
        {showTooltip && currentStage && (
          <div className="bg-stone-900/95 border border-stone-700 rounded-xl p-3 sm:p-4 text-white max-w-xs sm:max-w-sm pointer-events-auto shadow-md">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-400">
                Step 0{currentStage.step} • {currentStage.sublabel}
              </span>
              <span className="text-[10px] font-mono bg-stone-800 border border-stone-700 text-stone-300 px-2 py-0.5 rounded font-medium">
                {currentStage.metric}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              {currentStage.label}
            </h4>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed line-clamp-2">
              {currentStage.description}
            </p>
          </div>
        )}
      </div>

      {/* Subtle Hint */}
      <div className="absolute top-14 left-4 pointer-events-none hidden sm:block">
        <span className="text-[10px] text-stone-400 font-mono tracking-tight">
          Click stages or move mouse for parallax
        </span>
      </div>
    </div>
  );
};
