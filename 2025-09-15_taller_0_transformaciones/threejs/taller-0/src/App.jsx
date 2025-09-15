import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

function CuboCircular() {
  const meshRef = useRef();
  let t = 0;

  useFrame((state, delta) => {
    t += delta;

    // Movimiento circular
    meshRef.current.position.x = 3 * Math.cos(t);
    meshRef.current.position.z = 3 * Math.sin(t);

    // Rotación sobre su propio eje
    meshRef.current.rotation.x += 0.02;
    meshRef.current.rotation.y += 0.02;

    // Escalado suave
    const scale = 1 + 0.3 * Math.sin(state.clock.elapsedTime);
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }} // <-- Fullscreen
      camera={{ position: [0, 5, 10], fov: 75 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <CuboCircular />
      <OrbitControls /> {/* Permite rotar, acercar y mover la cámara */}
    </Canvas>
  );
}
