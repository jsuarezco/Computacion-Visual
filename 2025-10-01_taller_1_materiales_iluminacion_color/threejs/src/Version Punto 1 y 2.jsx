// src/App.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useState } from 'react'

function Modelo({ path, position = [0,0,0], scale = 1 }) {
  const { scene } = useGLTF(path)
  scene.scale.set(scale, scale, scale)
  scene.position.set(...position)
  return <primitive object={scene} />
}

export default function App() {
  const [preset, setPreset] = useState('dia') // 'dia' o 'atardecer'

  // Presets de iluminación
  const presets = {
    dia: {
      ambient: 0.5,
      keyColor: 'white',
      keyIntensity: 1,
      fillColor: '#a0cfff', // frío
      fillIntensity: 0.5,
      rimColor: 'white',
      rimIntensity: 0.8
    },
    atardecer: {
      ambient: 0.3,
      keyColor: '#ffb870', // cálido
      keyIntensity: 1,
      fillColor: '#7fa1ff', // frío suave
      fillIntensity: 0.4,
      rimColor: '#ffcfa0', // cálido
      rimIntensity: 0.7
    }
  }

  const light = presets[preset]

  return (
    <>
      <button 
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}
        onClick={() => setPreset(preset === 'dia' ? 'atardecer' : 'dia')}
      >
        Cambiar preset
      </button>

      <Canvas camera={{ position: [10, 5, 10], fov: 50 }} shadows style={{ width: '100vw', height: '100vh' }}>
        {/* Luces */}
        <ambientLight intensity={light.ambient} />
        {/* Key Light */}
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={light.keyIntensity} 
          color={light.keyColor} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        {/* Fill Light */}
        <directionalLight 
          position={[-10, 5, 5]} 
          intensity={light.fillIntensity} 
          color={light.fillColor} 
        />
        {/* Rim / Back Light */}
        <directionalLight 
          position={[0, 10, -10]} 
          intensity={light.rimIntensity} 
          color={light.rimColor} 
        />

        {/* Suelo */}
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0,-0.1,0]} receiveShadow>
          <planeGeometry args={[50,50]} />
          <meshStandardMaterial color="lightgray" />
        </mesh>

        {/* Modelos */}
        <Suspense fallback={null}>
          <Modelo path="/glb_models/throne_of_rock.glb" position={[-2, 4.3, 2.6]} scale={0.008} />
          <Modelo path="/glb_models/medieval_fantasy_-_large_island.glb" position={[17, 0, 18]} scale={0.4} />
          <Modelo path="/glb_models/monk_character.glb" position={[-2, 4.7, 3]} scale={1} />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </>
  )
}
