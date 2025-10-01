// src/App.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Suspense, useState } from 'react'

function Modelo({ path, position = [0,0,0], scale = 1, pbr = false }) {
  const { scene } = useGLTF(path)

  // Si es PBR, aplicamos material a todos los meshes
  if (pbr) {
    const normalMap = useTexture('/textures/normal_island.jpg') // mapa normal de la isla
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.roughness = 0.3      // rugosidad
        child.material.metalness = 0.2      // poco metálico
        

      }
    })
  }

  scene.scale.set(scale, scale, scale)
  scene.position.set(...position)
  return <primitive object={scene} />
}

export default function App() {
  const [preset, setPreset] = useState('dia') // 'dia' o 'atardecer'

  const presets = {
    dia: {
      ambient: 0.5,
      keyColor: 'white',
      keyIntensity: 1,
      fillColor: '#a0cfff',
      fillIntensity: 0.5,
      rimColor: 'white',
      rimIntensity: 0.8
    },
    atardecer: {
      ambient: 0.3,
      keyColor: '#ffb870',
      keyIntensity: 1,
      fillColor: '#7fa1ff',
      fillIntensity: 0.4,
      rimColor: '#ffcfa0',
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
        <directionalLight position={[10, 10, 10]} intensity={light.keyIntensity} color={light.keyColor} castShadow />
        <directionalLight position={[-10, 5, 5]} intensity={light.fillIntensity} color={light.fillColor} />
        <directionalLight position={[0, 10, -10]} intensity={light.rimIntensity} color={light.rimColor} />

        {/* Suelo */}
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.1,0]} receiveShadow>
          <planeGeometry args={[50,50]} />
          <meshStandardMaterial color="lightgray" />
        </mesh>

        {/* Modelos */}
        <Suspense fallback={null}>
          <Modelo path="/glb_models/throne_of_rock.glb" position={[-2, 4.3, 2.6]} scale={0.008} pbr={true}/>
          <Modelo path="/glb_models/medieval_fantasy_-_large_island.glb" position={[17, 0, 18]} scale={0.4} pbr={true} />
          <Modelo path="/glb_models/monk_character.glb" position={[-2, 4.7, 3]} scale={1} pbr={true}/>
        </Suspense>

        <OrbitControls />
      </Canvas>
    </>
  )
}
