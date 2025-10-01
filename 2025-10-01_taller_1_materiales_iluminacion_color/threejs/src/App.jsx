// src/App.jsx
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef, forwardRef } from 'react'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

// Modelo con forwardRef para usar ref
const Modelo = forwardRef(({ path, position=[0,0,0], scale=1, damero=false }, ref) => {
  const { scene } = useGLTF(path)

  scene.traverse((child) => {
    if (child.isMesh) {
      if (!child.userData.originalMaterial) child.userData.originalMaterial = child.material
      if (damero) {
        const size = 512, divisions = 8
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = size
        const ctx = canvas.getContext('2d')
        for (let y = 0; y < divisions; y++)
          for (let x = 0; x < divisions; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#000000'
            ctx.fillRect((x*size)/divisions, (y*size)/divisions, size/divisions, size/divisions)
          }
        const checkerTexture = new THREE.CanvasTexture(canvas)
        checkerTexture.wrapS = checkerTexture.wrapT = THREE.RepeatWrapping
        checkerTexture.repeat.set(4,4)
        child.material = child.material.clone()
        child.material.map = checkerTexture
        child.material.roughness = 0.5
        child.material.metalness = 0.1
      } else child.material = child.userData.originalMaterial
    }
  })

  scene.scale.set(scale, scale, scale)
  scene.position.set(...position)
  if (ref) ref.current = scene
  return <primitive object={scene} />
})

// Control de cámara
function CameraController({ mode }) {
  const { camera, set, size } = useThree()
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    let newCamera
    if (mode === 'perspective') {
      newCamera = new THREE.PerspectiveCamera(50, size.width/size.height, 0.1, 1000)
      newCamera.position.set(6,10,15)
    } else if (mode === 'orthographic') {
      const aspect = size.width/size.height
      const frustum = 10
      newCamera = new THREE.OrthographicCamera(
        -frustum*aspect, frustum*aspect, frustum, -frustum, 0.1, 1000
      )
      newCamera.position.set(0,50,0)
    } else if (mode === 'recorrido') {
      newCamera = new THREE.PerspectiveCamera(50, size.width/size.height, 0.1, 1000)
      newCamera.position.set(-15,10,15)
    }
    set({ camera: newCamera })
  }, [mode, set, size])

  useFrame(() => {
    if (mode === 'recorrido') {
      const radius = 15
      const speed = 0.02
      setAngle(a => {
        const newAngle = a + speed
        camera.position.x = Math.cos(newAngle) * radius
        camera.position.z = Math.sin(newAngle) * radius
        camera.position.y = 10
        camera.lookAt(0,0,0)
        return newAngle < Math.PI ? newAngle : Math.PI
      })
    }
  })

  return null
}

// Monk animado con luz
function AnimatedMonk({ damero, jump, onJumpEnd }) {
  const monkRef = useRef()
  const lightRef = useRef()
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (jump) {
      timeRef.current += delta * 5
      const y = Math.abs(Math.sin(timeRef.current)) * 2
      if (monkRef.current) monkRef.current.position.y = 4.7 + y

      if (lightRef.current) {
        lightRef.current.position.y = 6 + y
        lightRef.current.intensity = 2 + Math.sin(timeRef.current * 4) * 0.5
      }

      if (timeRef.current >= Math.PI) {
        if (monkRef.current) monkRef.current.position.y = 4.7
        if (lightRef.current) {
          lightRef.current.position.y = 6
          lightRef.current.intensity = 2
        }
        timeRef.current = 0
        onJumpEnd()
      }
    }
  })

  return (
    <>
      <Suspense fallback={null}>
        <Modelo ref={monkRef} path="/glb_models/monk_character.glb" position={[-2,4.7,3]} scale={1} damero={damero} />
      </Suspense>
      <pointLight ref={lightRef} position={[-2,6,3]} intensity={2} color="yellow" distance={10} decay={2} />
    </>
  )
}

export default function App() {
  const [preset, setPreset] = useState('dia')
  const [dameroOn, setDameroOn] = useState(false)
  const [cameraMode, setCameraMode] = useState('perspective')
  const [jump, setJump] = useState(false)
  const sceneRef = useRef()

  const presets = {
    dia: { ambient: 0.5, keyColor:'white', keyIntensity:1, fillColor:'#a0cfff', fillIntensity:0.5, rimColor:'white', rimIntensity:0.8 },
    atardecer: { ambient:0.3, keyColor:'#ffb870', keyIntensity:1, fillColor:'#7fa1ff', fillIntensity:0.4, rimColor:'#ffcfa0', rimIntensity:0.7 }
  }
  const light = presets[preset]

  // Función para exportar escena completa a .glb
  function exportScene() {
  if (!sceneRef.current) return
  const exporter = new GLTFExporter()
  exporter.parse(
    sceneRef.current,
    (result) => {
      let blob
      if (result instanceof ArrayBuffer) {
        // caso binario .glb
        blob = new Blob([result], { type: 'model/gltf-binary' })
      } else {
        // caso JSON .gltf
        const output = JSON.stringify(result, null, 2)
        blob = new Blob([output], { type: 'text/plain' })
      }
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'escena.glb'
      link.click()
    },
    { binary: true } // exporta en binario .glb
  )
}


  return (
    <>
      <div style={{
        position:'absolute', top:20, left:20, zIndex:10,
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px',
        padding:'10px', background:'rgba(0,0,0,0.5)', borderRadius:'8px'
      }}>
        <button onClick={() => setPreset(preset === 'dia' ? 'atardecer' : 'dia')}>
          {preset === 'dia' ? 'Cambiar a Atardecer' : 'Cambiar a Día'}
        </button>
        <button onClick={()=>setDameroOn(!dameroOn)}>{dameroOn?'Quitar Damero':'Poner Damero'}</button>
        <button onClick={()=>setCameraMode('perspective')}>Cámara Perspectiva</button>
        <button onClick={()=>setCameraMode('orthographic')}>Cámara Ortográfica</button>
        <button onClick={()=>setCameraMode('recorrido')}>Iniciar Recorrido</button>
        <button onClick={()=>setJump(true)}>Saltar Monk</button>
        <button onClick={exportScene}>Exportar Escena (.glb)</button>
      </div>

      <Canvas shadows style={{ width:'100vw', height:'100vh' }}>
        <CameraController mode={cameraMode} />

        <ambientLight intensity={light.ambient} />
        <directionalLight position={[10,10,10]} intensity={light.keyIntensity} color={light.keyColor} castShadow />
        <directionalLight position={[-10,5,5]} intensity={light.fillIntensity} color={light.fillColor} />
        <directionalLight position={[0,10,-10]} intensity={light.rimIntensity} color={light.rimColor} />

        <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.1,0]} receiveShadow>
          <planeGeometry args={[50,50]} />
          <meshStandardMaterial color="blue" />
        </mesh>

        <Suspense fallback={null}>
          {/* Aquí envolvemos todo en un grupo para exportar */}
          <group ref={sceneRef}>
            <Modelo path="/glb_models/throne_of_rock.glb" position={[-2,4.3,2.6]} scale={0.008} damero={dameroOn}/>
            <Modelo path="/glb_models/medieval_fantasy_-_large_island.glb" position={[17,0,18]} scale={0.4} damero={dameroOn}/>
            <AnimatedMonk jump={jump} onJumpEnd={()=>setJump(false)} />
          </group>
        </Suspense>

        <OrbitControls />
      </Canvas>

    </>
  )
}
