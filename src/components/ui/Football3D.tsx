"use client"

import React, { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, useTexture, Decal } from '@react-three/drei'
import * as THREE from 'three'

// Vertex shader: pasa posición normalizada, normal y posición de vista
const vertexShader = `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vPos     = normalize(position);
    vNormal  = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`

const decalVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const decalFragmentShader = `
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(map, vUv);
    float coreAlpha = tex.a;
    
    // Blur simple para crear el brillo alrededor del logo
    vec2 texel = vec2(1.0 / 400.0, 1.0 / 120.0);
    float glow = 0.0;
    float count = 0.0;
    for(float x = -3.0; x <= 3.0; x += 1.0) {
      for(float y = -3.0; y <= 3.0; y += 1.0) {
        glow += texture2D(map, vUv + vec2(x, y) * texel).a;
        count += 1.0;
      }
    }
    glow /= count;
    
    // Intensificar y expandir el glow
    glow = smoothstep(0.0, 0.4, glow);
    
    // Color del borde neón (Naranja del botón: #FF4500 -> 1.0, 0.27, 0.0)
    vec3 glowColor = vec3(1.0, 0.27, 0.0) * 2.5; 
    
    // Color del centro (Negro mate)
    vec3 coreColor = vec3(0.02, 0.02, 0.02);
    
    // Si el alfa original es alto, mostramos el centro negro.
    // Si es bajo pero el glow es alto, mostramos el borde neón.
    float mixFactor = smoothstep(0.2, 0.6, coreAlpha);
    vec3 finalColor = mix(glowColor, coreColor, mixFactor);
    
    float finalAlpha = clamp(glow + coreAlpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

// Fragment shader: patrón correcto de balón de fútbol (20 hex + 12 pent)
// usando los centros exactos del icosaedro truncado
const fragmentShader = `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 p = normalize(vPos);

    // ── Constantes del icosaedro truncado ─────────────────────────────
    float PHI = 1.6180339887;

    // 12 CENTROS DE PENTÁGONO = vértices del icosaedro normalizados
    vec3 penta[12];
    penta[0]  = normalize(vec3( 0.0,  1.0,  PHI));
    penta[1]  = normalize(vec3( 0.0, -1.0,  PHI));
    penta[2]  = normalize(vec3( 0.0,  1.0, -PHI));
    penta[3]  = normalize(vec3( 0.0, -1.0, -PHI));
    penta[4]  = normalize(vec3( 1.0,  PHI,  0.0));
    penta[5]  = normalize(vec3(-1.0,  PHI,  0.0));
    penta[6]  = normalize(vec3( 1.0, -PHI,  0.0));
    penta[7]  = normalize(vec3(-1.0, -PHI,  0.0));
    penta[8]  = normalize(vec3( PHI,  0.0,  1.0));
    penta[9]  = normalize(vec3(-PHI,  0.0,  1.0));
    penta[10] = normalize(vec3( PHI,  0.0, -1.0));
    penta[11] = normalize(vec3(-PHI,  0.0, -1.0));

    // 20 CENTROS DE HEXÁGONO = vértices del dodecaedro (duales del icosaedro)
    // Magnitud de todos = sqrt(3), ya normalizados
    float a = 0.57735027;   // 1/sqrt(3)
    float b = 0.93417236;   // φ/sqrt(3)   ← valor MAYOR
    float c = 0.35682209;   // 1/(φ·sqrt(3)) ← valor MENOR

    vec3 hexa[20];
    // Grupo A: (±a, ±a, ±a)
    hexa[0]  = vec3( a,  a,  a);
    hexa[1]  = vec3(-a,  a,  a);
    hexa[2]  = vec3( a, -a,  a);
    hexa[3]  = vec3(-a, -a,  a);
    hexa[4]  = vec3( a,  a, -a);
    hexa[5]  = vec3(-a,  a, -a);
    hexa[6]  = vec3( a, -a, -a);
    hexa[7]  = vec3(-a, -a, -a);
    // Grupo B: (0, ±b, ±c)  ← b en Y, c en Z
    hexa[8]  = vec3( 0.0,  b,  c);
    hexa[9]  = vec3( 0.0, -b,  c);
    hexa[10] = vec3( 0.0,  b, -c);
    hexa[11] = vec3( 0.0, -b, -c);
    // Grupo C: (±c, 0, ±b)  ← c en X, b en Z
    hexa[12] = vec3( c,  0.0,  b);
    hexa[13] = vec3(-c,  0.0,  b);
    hexa[14] = vec3( c,  0.0, -b);
    hexa[15] = vec3(-c,  0.0, -b);
    // Grupo D: (±b, ±c, 0)  ← b en X, c en Y
    hexa[16] = vec3( b,  c,  0.0);
    hexa[17] = vec3(-b,  c,  0.0);
    hexa[18] = vec3( b, -c,  0.0);
    hexa[19] = vec3(-b, -c,  0.0);

    // ── Voronoi esférico: encontrar las 2 facetas más cercanas ────────
    float d1 = 99.0, d2 = 99.0;
    bool closestIsPenta = false;

    for (int i = 0; i < 12; i++) {
      float d = acos(clamp(dot(p, penta[i]), -1.0, 1.0));
      if (d < d1) { d2 = d1; d1 = d; closestIsPenta = true; }
      else if (d < d2) { d2 = d; }
    }
    for (int i = 0; i < 20; i++) {
      float d = acos(clamp(dot(p, hexa[i]), -1.0, 1.0));
      if (d < d1) { d2 = d1; d1 = d; closestIsPenta = false; }
      else if (d < d2) { d2 = d; }
    }

    // ── Costuras nítidas ──────────────────────────────────────────────
    float seamW = 0.018;
    float seam  = 1.0 - smoothstep(0.0, seamW, (d2 - d1));

    // ── Colores: balón tradicional (hexágonos blancos, pentágonos negros) ──
    vec3 hexColor  = vec3(1.0, 1.0, 1.0);      // Blanco puro
    vec3 pentColor = vec3(0.06, 0.06, 0.07);   // Pentágonos negros
    vec3 seamColor = vec3(0.12, 0.12, 0.14);   // Costuras oscuras

    vec3 panelColor = closestIsPenta ? pentColor : hexColor;
    vec3 color = mix(panelColor, seamColor, seam);

    // ── Iluminación Blinn-Phong ─────────────────────
    vec3  lightDir  = normalize(vec3(3.0, 6.0, 5.0));
    vec3  halfVec   = normalize(lightDir + vViewDir);

    float ambient   = 0.45; // Aumentamos la luz ambiente base (antes 0.18)
    float diff      = max(dot(vNormal, lightDir), 0.0) * 0.75; // Aumentamos la luz directa (antes 0.55)
    float spec      = 0.0; // Brillo especular apagado temporalmente

    // Luz de relleno suave (ambiente cálido desde abajo)
    vec3  fillDir   = normalize(vec3(-1.5, -3.0, 2.0));
    float fill      = max(dot(vNormal, fillDir), 0.0) * 0.15;

    // Calculamos el color final, asegurando que no pase de 1.0 (sobreexposición extrema)
    color = min(color * (ambient + diff + fill), 1.0); 

    gl_FragColor = vec4(color, 1.0);
  }
`

function PremiumBall() {
  const groupRef  = useRef<THREE.Group>(null)
  const logoTexture = useTexture('/logo.png')

  // Geometría de esfera de alta densidad (agrandada 20%)
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(3.024, 128, 128), [])
  
  // Halos para el efecto Neón
  const haloGeoTight = useMemo(() => new THREE.SphereGeometry(3.2, 32, 32), [])
  const haloGeoSoft  = useMemo(() => new THREE.SphereGeometry(3.8, 32, 32), [])

  // ShaderMaterial con el patrón del balón calculado en 3D
  const ballMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    polygonOffset: true,
    polygonOffsetFactor: 1,
  }), [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>

        {/* Halo Neón Exterior (Suave) */}
        <mesh geometry={haloGeoSoft}>
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Halo Neón Interior (Intenso) */}
        <mesh geometry={haloGeoTight}>
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.4}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Balón con shader de patrón en 3D */}
        <mesh geometry={sphereGeo} material={ballMat}>
          {/* Logo Frontal */}
          <Decal
            position={[0, 0, 3.024]}
            rotation={[0, 0, 0]}
            scale={[2.592, 0.7776, 1]}
          >
            <shaderMaterial
              uniforms={{ map: { value: logoTexture } }}
              vertexShader={decalVertexShader}
              fragmentShader={decalFragmentShader}
              transparent={true}
              depthWrite={false}
              polygonOffset={true}
              polygonOffsetFactor={-1}
            />
          </Decal>

          {/* Logo Trasero */}
          <Decal
            position={[0, 0, -3.024]}
            rotation={[0, Math.PI, 0]}
            scale={[2.592, 0.7776, 1]}
          >
            <shaderMaterial
              uniforms={{ map: { value: logoTexture } }}
              vertexShader={decalVertexShader}
              fragmentShader={decalFragmentShader}
              transparent={true}
              depthWrite={false}
              polygonOffset={true}
              polygonOffsetFactor={-1}
            />
          </Decal>
        </mesh>

      </Float>
    </group>
  )
}

export function Football3D() {
  return (
    // Contenedor ensanchado (w-[140%]) y centrado (-ml-[20%]) para evitar cualquier recorte en monitores estrechos.
    // Desplazado 25px a la izquierda con translate-x. El contenedor padre maneja los z-index.
    <div className="w-[140%] h-full min-h-[500px] lg:min-h-[600px] relative -ml-[20%] translate-x-[-25px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
        <Suspense fallback={null}>
          <PremiumBall />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  )
}
