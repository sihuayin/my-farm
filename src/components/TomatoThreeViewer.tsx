import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type DiseaseEffect = 'healthy' | 'dark-spots' | 'gray-mold' | 'yellow-mold' | 'curling' | 'chlorosis';
type Severity = 'mild' | 'moderate' | 'severe';

interface Props {
  modelState: string;
  diseaseEffect: DiseaseEffect | string;
  severity: Severity;
}

const stageScale: Record<string, number> = {
  seed: 0.12,
  sprout: 0.28,
  seedling: 0.48,
  vine: 0.78,
  flower: 0.9,
  'green-fruit': 1,
  'red-fruit': 1,
  aging: 0.96,
};

const severityValue: Record<Severity, number> = {
  mild: 0.45,
  moderate: 0.72,
  severe: 1,
};

const babyTomatoModelPath = `${import.meta.env.BASE_URL}models/baby_tomato_plant_scan_low_poly.glb`;
const fruitingTomatoModelPath = `${import.meta.env.BASE_URL}models/tomato_plant.glb`;

function getModelPath(modelState: string) {
  if (['green-fruit', 'red-fruit', 'aging'].includes(modelState)) return fruitingTomatoModelPath;
  return babyTomatoModelPath;
}

export default function TomatoThreeViewer({ modelState, diseaseEffect, severity }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0fdf4);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(2.8, 1.75, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.1, 0);
    controls.minDistance = 1.5;
    controls.maxDistance = 7;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x7c4a24, 2.1));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(4, 6, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const root = new THREE.Group();
    scene.add(root);

    let disposed = false;
    const loader = new GLTFLoader();
    addEnvironment(root);
    loader.load(
      getModelPath(modelState),
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        prepareScannedModel(model, modelState, diseaseEffect, severity);
        root.add(model);
      },
      undefined,
      () => {
        if (!disposed) buildTomatoPlant(root, modelState, diseaseEffect, severity, false);
      }
    );

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      root.rotation.y += 0.0016;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      disposeObject(scene);
      container.removeChild(renderer.domElement);
    };
  }, [modelState, diseaseEffect, severity]);

  return <div ref={containerRef} className="tomato-three-viewer" aria-label="本地Three.js番茄3D模型" />;
}

function prepareScannedModel(model: THREE.Group, modelState: string, diseaseEffect: string, severity: Severity) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  const baseScale = 2.4 / maxDimension;
  const stageFactor = stageScale[modelState] || 1;
  model.scale.setScalar(baseScale * Math.max(stageFactor, 0.32));
  model.position.sub(center.multiplyScalar(baseScale * Math.max(stageFactor, 0.32)));
  model.position.y += 0.55;

  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((item) => {
      if (!(item instanceof THREE.MeshStandardMaterial) && !(item instanceof THREE.MeshPhysicalMaterial)) return;
      item.roughness = Math.max(item.roughness, 0.72);
      if (diseaseEffect === 'chlorosis' || diseaseEffect === 'yellow-mold') {
        item.color.lerp(new THREE.Color(0xd8c74a), 0.28 * severityValue[severity]);
      }
      if (modelState === 'aging') {
        item.color.lerp(new THREE.Color(0x9a7b2f), 0.22);
      }
    });
  });

  if (diseaseEffect !== 'healthy') {
    addDiseaseMarkers(model, diseaseEffect, severity);
  }
}

function buildTomatoPlant(root: THREE.Group, modelState: string, diseaseEffect: string, severity: Severity, includeEnvironment = true) {
  const scale = stageScale[modelState] || 1;
  const isSeed = modelState === 'seed';
  const isSprout = modelState === 'sprout';
  const isSeedling = modelState === 'seedling';
  const hasFlowers = ['flower', 'green-fruit', 'red-fruit', 'aging'].includes(modelState);
  const hasFruit = ['green-fruit', 'red-fruit', 'aging'].includes(modelState);
  const hasRedFruit = ['red-fruit', 'aging'].includes(modelState);
  const aging = modelState === 'aging';

  if (includeEnvironment) addEnvironment(root);

  if (isSeed) {
    addSeed(root);
    return;
  }

  const plant = new THREE.Group();
  plant.scale.setScalar(scale);
  root.add(plant);

  const stemMaterial = material(aging ? 0x556b2f : 0x238b45, 0.45, 0.65);
  const leafMaterial = material(getLeafColor(diseaseEffect, aging), 0.62, 0.72);
  const darkLeafMaterial = material(getLeafColor(diseaseEffect, aging, true), 0.7, 0.62);
  const flowerMaterial = material(0xfacc15, 0.45, 0.75);
  const fruitMaterial = material(hasRedFruit ? 0xdc2626 : 0x22c55e, 0.5, 0.68);

  const height = isSprout ? 0.72 : isSeedling ? 1.35 : 2.85;
  addCylinder(plant, 0.045, height, [0, height / 2, 0], stemMaterial, true);

  const branchLevels = isSprout ? [0.62] : isSeedling ? [0.72, 1.08] : [0.52, 0.78, 1.04, 1.3, 1.58, 1.86, 2.14, 2.42];
  branchLevels.forEach((y, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    addBranch(plant, y, side, index, stemMaterial, leafMaterial, darkLeafMaterial, diseaseEffect, severity, isSprout);
  });

  if (!isSprout) {
    addCompoundLeaf(plant, [0.06, height + 0.02, -0.05], 0.74, leafMaterial, darkLeafMaterial, diseaseEffect, severity, 0, 0.2);
  }

  if (hasFlowers) {
    addFlowerCluster(plant, [-0.35, 2.3, 0.1], flowerMaterial);
    addFlowerCluster(plant, [0.42, 2.05, -0.05], flowerMaterial);
  }

  if (hasFruit) {
    addFruit(plant, [-0.42, 1.35, 0.18], 0.18, fruitMaterial, diseaseEffect, severity);
    addFruit(plant, [0.38, 1.65, -0.1], 0.14, fruitMaterial, diseaseEffect, severity);
    addFruit(plant, [0.18, 2.02, 0.22], 0.12, fruitMaterial, diseaseEffect, severity);
    addFruit(plant, [-0.18, 1.82, -0.26], 0.13, fruitMaterial, diseaseEffect, severity);
    addFruit(plant, [0.52, 1.12, 0.18], 0.16, fruitMaterial, diseaseEffect, severity);
  }

  if (diseaseEffect !== 'healthy') {
    addDiseaseMarkers(plant, diseaseEffect, severity);
  }
}

function addEnvironment(root: THREE.Group) {
  const potMaterial = material(0x9a3412, 0.55, 0.5);
  const soilMaterial = material(0x3f2414, 0.88, 0.38);
  const groundMaterial = material(0xd9f99d, 0.8, 0.5);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.6, 64), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  root.add(ground);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.94, 0.54, 48, 1, true), potMaterial);
  pot.position.y = 0.22;
  pot.castShadow = true;
  pot.receiveShadow = true;
  root.add(pot);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 48), soilMaterial);
  soil.position.y = 0.51;
  soil.receiveShadow = true;
  root.add(soil);
}

function addSeed(root: THREE.Group) {
  const seedMaterial = material(0x92400e, 0.68, 0.5);
  const seed = new THREE.Mesh(new THREE.SphereGeometry(0.13, 32, 16), seedMaterial);
  seed.scale.set(1.5, 0.55, 0.95);
  seed.position.set(0, 0.58, 0);
  seed.castShadow = true;
  root.add(seed);
}

function addBranch(
  plant: THREE.Group,
  y: number,
  side: number,
  index: number,
  stemMaterial: THREE.Material,
  leafMaterial: THREE.Material,
  darkLeafMaterial: THREE.Material,
  diseaseEffect: string,
  severity: Severity,
  small = false
) {
  const branch = new THREE.Group();
  branch.position.set(0, y, 0);
  branch.rotation.z = side * (-0.34 - index * 0.035);
  branch.rotation.y = side * (0.42 + (index % 3) * 0.18);
  branch.rotation.x = (index % 2 === 0 ? 1 : -1) * 0.1;
  plant.add(branch);

  const length = small ? 0.42 : 0.74 + (index % 3) * 0.12;
  const zOffset = (index % 2 === 0 ? 1 : -1) * 0.1;
  const cylinder = cylinderBetween([0, 0, 0], [side * length, 0.16, zOffset], 0.022, stemMaterial);
  branch.add(cylinder);

  addCompoundLeaf(
    branch,
    [side * (length + 0.04), 0.16, zOffset],
    small ? 0.42 : 0.58 + (index % 2) * 0.08,
    leafMaterial,
    darkLeafMaterial,
    diseaseEffect,
    severity,
    side,
    index * 0.22
  );

  if (!small && index % 2 === 0) {
    addCompoundLeaf(
      branch,
      [side * (length * 0.56), 0.06, zOffset * -0.5],
      0.42,
      leafMaterial,
      darkLeafMaterial,
      diseaseEffect,
      severity,
      -side,
      index * 0.18
    );
  }
}

function addCompoundLeaf(
  parent: THREE.Group,
  position: number[],
  scale: number,
  leafMaterial: THREE.Material,
  darkLeafMaterial: THREE.Material,
  diseaseEffect: string,
  severity: Severity,
  side: number,
  twist = 0
) {
  const cluster = new THREE.Group();
  cluster.position.set(position[0], position[1], position[2]);
  cluster.scale.setScalar(scale);
  cluster.rotation.y = side * 0.45 + twist;
  cluster.rotation.z = side * -0.18;
  cluster.rotation.x = 0.22;
  parent.add(cluster);

  const rachis = cylinderBetween([0, -0.26, 0], [0, 0.34, 0], 0.01, darkLeafMaterial);
  cluster.add(rachis);

  const leafletPositions = [
    [0, 0.36, 0.02, 0, 0.86],
    [-0.16, 0.22, 0.04, -0.7, 0.72],
    [0.16, 0.2, -0.04, 0.7, 0.72],
    [-0.2, 0.04, 0.04, -0.52, 0.66],
    [0.2, 0.02, -0.04, 0.52, 0.66],
    [-0.15, -0.14, 0.03, -0.34, 0.54],
    [0.15, -0.16, -0.03, 0.34, 0.54],
    [-0.08, -0.29, 0.02, -0.16, 0.42],
    [0.08, -0.3, -0.02, 0.16, 0.42],
  ];

  leafletPositions.forEach(([x, y, z, rotation, leafScale], index) => {
    const leaf = new THREE.Mesh(createTomatoLeafGeometry(), index % 2 ? darkLeafMaterial : leafMaterial);
    leaf.scale.set(leafScale * 0.86, leafScale * 1.08, leafScale);
    leaf.position.set(x, y, z);
    leaf.rotation.z = rotation;
    leaf.rotation.x = 0.35;
    leaf.rotation.y = rotation * 0.28;
    leaf.castShadow = true;
    cluster.add(leaf);
  });

  if (['dark-spots', 'yellow-mold', 'gray-mold'].includes(diseaseEffect)) {
    const count = diseaseEffect === 'gray-mold' ? 2 : 3;
    for (let i = 0; i < count; i += 1) {
      const spot = new THREE.Mesh(
        new THREE.SphereGeometry(0.026 + severityValue[severity] * 0.018, 12, 8),
        material(diseaseEffect === 'gray-mold' ? 0xcbd5e1 : 0x78350f, 0.5, 0.4)
      );
      spot.scale.set(1.4, 0.18, 1);
      spot.position.set(-0.08 + i * 0.08, 0.03 - i * 0.05, 0.1);
      cluster.add(spot);
    }
  }
}

function addFlowerCluster(parent: THREE.Group, position: number[], flowerMaterial: THREE.Material) {
  const cluster = new THREE.Group();
  cluster.position.set(position[0], position[1], position[2]);
  parent.add(cluster);

  for (let i = 0; i < 5; i += 1) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 8), flowerMaterial);
    const angle = (i / 5) * Math.PI * 2;
    petal.position.set(Math.cos(angle) * 0.065, Math.sin(angle) * 0.065, 0);
    petal.scale.set(1.25, 0.52, 0.32);
    cluster.add(petal);
  }

  const center = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 8), material(0xa16207, 0.45, 0.55));
  center.position.z = 0.02;
  cluster.add(center);
}

function addFruit(parent: THREE.Group, position: number[], radius: number, fruitMaterial: THREE.Material, diseaseEffect: string, severity: Severity) {
  const fruit = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), fruitMaterial);
  fruit.position.set(position[0], position[1], position[2]);
  fruit.scale.set(1, 0.92, 1.05);
  fruit.castShadow = true;
  parent.add(fruit);

  const calyx = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.48, radius * 0.18, 6), material(0x166534, 0.6, 0.5));
  calyx.position.set(position[0], position[1] + radius * 0.9, position[2]);
  calyx.rotation.x = Math.PI;
  parent.add(calyx);

  if (['gray-mold', 'dark-spots'].includes(diseaseEffect)) {
    const lesion = new THREE.Mesh(
      new THREE.SphereGeometry(radius * (0.26 + severityValue[severity] * 0.22), 16, 8),
      material(diseaseEffect === 'gray-mold' ? 0x94a3b8 : 0x78350f, 0.55, 0.36)
    );
    lesion.scale.set(1, 0.18, 0.8);
    lesion.position.set(position[0] + radius * 0.45, position[1] - radius * 0.18, position[2] + radius * 0.82);
    parent.add(lesion);
  }
}

function addDiseaseMarkers(parent: THREE.Group, diseaseEffect: string, severity: Severity) {
  if (!['curling', 'chlorosis'].includes(diseaseEffect)) return;
  const color = diseaseEffect === 'curling' ? 0x7f1d1d : 0xfacc15;
  const markerMaterial = material(color, 0.58, 0.42);
  const positions = [[-0.35, 1.9, 0.14], [0.45, 1.55, -0.08], [0.1, 2.45, 0.08]];
  positions.forEach((position) => {
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.08 * severityValue[severity], 16, 8), markerMaterial);
    marker.scale.set(1.4, 0.22, 1);
    marker.position.set(position[0], position[1], position[2]);
    parent.add(marker);
  });
}

function createTomatoLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.17);
  shape.bezierCurveTo(-0.09, 0.16, -0.17, 0.08, -0.2, 0.01);
  shape.lineTo(-0.14, -0.02);
  shape.bezierCurveTo(-0.22, -0.07, -0.21, -0.16, -0.1, -0.17);
  shape.lineTo(-0.05, -0.11);
  shape.bezierCurveTo(-0.02, -0.2, 0.07, -0.2, 0.08, -0.1);
  shape.lineTo(0.12, -0.16);
  shape.bezierCurveTo(0.22, -0.12, 0.21, -0.04, 0.13, -0.01);
  shape.lineTo(0.2, 0.03);
  shape.bezierCurveTo(0.16, 0.1, 0.1, 0.16, 0, 0.17);
  return new THREE.ShapeGeometry(shape, 16);
}

function addCylinder(parent: THREE.Group, radius: number, height: number, position: number[], mat: THREE.Material, shadow = false) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.18, height, 24), mat);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = shadow;
  mesh.receiveShadow = shadow;
  parent.add(mesh);
}

function cylinderBetween(start: number[], end: number[], radius: number, mat: THREE.Material) {
  const startVector = new THREE.Vector3(start[0], start[1], start[2]);
  const endVector = new THREE.Vector3(end[0], end[1], end[2]);
  const mid = startVector.clone().add(endVector).multiplyScalar(0.5);
  const direction = endVector.clone().sub(startVector);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 16), mat);
  mesh.position.copy(mid);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  return mesh;
}

function getLeafColor(diseaseEffect: string, aging: boolean, dark = false) {
  if (diseaseEffect === 'chlorosis' || diseaseEffect === 'yellow-mold') return dark ? 0xa3a317 : 0xd9d640;
  if (aging) return dark ? 0x8a6f16 : 0xc7a928;
  return dark ? 0x166534 : 0x2f9e44;
}

function material(color: number, roughness: number, metalness: number) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: metalness * 0.08 });
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const materialLike = mesh.material;
    if (Array.isArray(materialLike)) {
      materialLike.forEach((item) => item.dispose());
    } else if (materialLike) {
      materialLike.dispose();
    }
  });
}
