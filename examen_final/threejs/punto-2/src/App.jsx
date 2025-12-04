import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Piso con textura
function Floor({ textureUrl }) {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Cubo animado
function TexturedCube({ position, textureUrl }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.015;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Esfera animada
function TexturedSphere({ position, textureUrl }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  useFrame(() => {
    ref.current.position.y = 0.7 + Math.sin(Date.now() * 0.002) * 0.3;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Cilindro animado
function TexturedCylinder({ position, textureUrl }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  useFrame(() => {
    ref.current.rotation.x += 0.005;
    ref.current.rotation.z += 0.01;
  });
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.6, 0.6, 1.5, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Tetraedro animado
function TexturedTetra({ position, textureUrl }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  useFrame(() => {
    ref.current.rotation.x -= 0.015;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref} position={position}>
      <tetrahedronGeometry args={[0.9]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function App() {
  const [cameraPos, setCameraPos] = useState([8, 8, 8]);
  const [cameraTarget, setCameraTarget] = useState([0, 0.5, 0]);
  const controlsRef = useRef();

  // Función para cambiar cámara
  const changeCamera = (view) => {
    switch (view) {
      case "frontal":
        setCameraPos([8, 8, 8]);
        setCameraTarget([0, 0.5, 0]);
        break;
      case "lateral":
        setCameraPos([0, 5, 12]);
        setCameraTarget([0, 0.5, 0]);
        break;
      case "aerial":
        setCameraPos([0, 12, 0.01]);
        setCameraTarget([0, 0.5, 0]);
        break;
      default:
        break;
    }
  };

  // Aplicar cambios de cámara en OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(...cameraPos);
      controlsRef.current.target.set(...cameraTarget);
      controlsRef.current.update();
    }
  }, [cameraPos, cameraTarget]);

  return (
    <>
      {/* Botones para cambiar cámaras */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <button onClick={() => changeCamera("frontal")}>Frontal</button>
        <button onClick={() => changeCamera("lateral")}>Ortogonal</button>
        <button onClick={() => changeCamera("aerial")}>Aérea</button>
      </div>

      <Canvas
        camera={{ position: cameraPos, fov: 60 }}
        style={{ width: "100vw", height: "100vh", background: "#202020" }}
      >
        {/* Luces */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <pointLight position={[0, 1, -2]} intensity={5} color="red" />
        <pointLight position={[0, 1, 2]} intensity={5} color="white" />

        {/* OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.7}
          zoomSpeed={0.7}
          minDistance={5}
          maxDistance={20}
          target={cameraTarget}
        />

        {/* Axes Helper */}
        <primitive object={new THREE.AxesHelper(5)} />

        {/* Piso */}
        <Floor textureUrl="/textures/floor.jpg" />

        {/* Objetos animados */}
        <TexturedCube position={[-2, 1, 0]} textureUrl="/textures/metal.jpg" />
        <TexturedSphere position={[0, 1, 2]} textureUrl="/textures/marble.jpg" />
        <TexturedCylinder position={[2, 1, 0]} textureUrl="/textures/metal.jpg" />
        <TexturedTetra position={[0, 1, -2]} textureUrl="/textures/marble.jpg" />
      </Canvas>
    </>
  );
}
