// One-off dev script: renders the real Football3D ball (same shaders/geometry/decals
// as src/components/ui/Football3D.tsx) from 60 horizontal angles using a headless
// Chromium (Playwright) and composites the frames into public/ball-sprite.png.
// This script is NOT part of the production build/runtime. Run manually:
//   npm install --no-save playwright && npx playwright install chromium
//   node generate-ball-frames.js
//   npm uninstall playwright
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const { Jimp } = require('jimp');
const sharp = require('sharp');

const FRAME_COUNT = 24;
const FRAME_SIZE = 260; // px per frame, square (~1x the 256px CSS display size)
const GRID_COLS = 6;
const GRID_ROWS = Math.ceil(FRAME_COUNT / GRID_COLS);
const OUT_PATH = path.join(__dirname, 'public', 'ball-sprite.webp');
const PORT = 45231;

const THREE_MODULE = fs.readFileSync(
  path.join(__dirname, 'node_modules/three/build/three.module.min.js'),
  'utf8'
);
const THREE_CORE = fs.readFileSync(
  path.join(__dirname, 'node_modules/three/build/three.core.min.js'),
  'utf8'
);
const DECAL_GEOMETRY = fs.readFileSync(
  path.join(__dirname, 'node_modules/three/examples/jsm/geometries/DecalGeometry.js'),
  'utf8'
);
const LOGO_PNG = fs.readFileSync(path.join(__dirname, 'public/logo.png'));

// Shaders copied verbatim from src/components/ui/Football3D.tsx
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
`;

const decalVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const decalFragmentShader = `
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(map, vUv);
    float coreAlpha = tex.a;
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
    glow = smoothstep(0.0, 0.4, glow);
    vec3 glowColor = vec3(1.0, 0.27, 0.0) * 2.5;
    vec3 coreColor = vec3(0.02, 0.02, 0.02);
    float mixFactor = smoothstep(0.2, 0.6, coreAlpha);
    vec3 finalColor = mix(glowColor, coreColor, mixFactor);
    float finalAlpha = clamp(glow + coreAlpha, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

const fragmentShader = `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 p = normalize(vPos);
    float PHI = 1.6180339887;

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

    float a = 0.57735027;
    float b = 0.93417236;
    float c = 0.35682209;

    vec3 hexa[20];
    hexa[0]  = vec3( a,  a,  a);
    hexa[1]  = vec3(-a,  a,  a);
    hexa[2]  = vec3( a, -a,  a);
    hexa[3]  = vec3(-a, -a,  a);
    hexa[4]  = vec3( a,  a, -a);
    hexa[5]  = vec3(-a,  a, -a);
    hexa[6]  = vec3( a, -a, -a);
    hexa[7]  = vec3(-a, -a, -a);
    hexa[8]  = vec3( 0.0,  b,  c);
    hexa[9]  = vec3( 0.0, -b,  c);
    hexa[10] = vec3( 0.0,  b, -c);
    hexa[11] = vec3( 0.0, -b, -c);
    hexa[12] = vec3( c,  0.0,  b);
    hexa[13] = vec3(-c,  0.0,  b);
    hexa[14] = vec3( c,  0.0, -b);
    hexa[15] = vec3(-c,  0.0, -b);
    hexa[16] = vec3( b,  c,  0.0);
    hexa[17] = vec3(-b,  c,  0.0);
    hexa[18] = vec3( b, -c,  0.0);
    hexa[19] = vec3(-b, -c,  0.0);

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

    float seamW = 0.018;
    float seam  = 1.0 - smoothstep(0.0, seamW, (d2 - d1));

    vec3 hexColor  = vec3(1.0, 1.0, 1.0);
    vec3 pentColor = vec3(0.06, 0.06, 0.07);
    vec3 seamColor = vec3(0.12, 0.12, 0.14);

    vec3 panelColor = closestIsPenta ? pentColor : hexColor;
    vec3 color = mix(panelColor, seamColor, seam);

    vec3  lightDir  = normalize(vec3(3.0, 6.0, 5.0));
    vec3  halfVec   = normalize(lightDir + vViewDir);

    float ambient   = 0.45;
    float diff      = max(dot(vNormal, lightDir), 0.0) * 0.75;
    float spec      = 0.0;

    vec3  fillDir   = normalize(vec3(-1.5, -3.0, 2.0));
    float fill      = max(dot(vNormal, fillDir), 0.0) * 0.15;

    color = min(color * (ambient + diff + fill), 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const sceneScript = `
import * as THREE from 'three';
import { DecalGeometry } from '/vendor/DecalGeometry.js';

const vertexShader = ${JSON.stringify(vertexShader)};
const fragmentShader = ${JSON.stringify(fragmentShader)};
const decalVertexShader = ${JSON.stringify(decalVertexShader)};
const decalFragmentShader = ${JSON.stringify(decalFragmentShader)};

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(${FRAME_SIZE}, ${FRAME_SIZE}, false);
renderer.setClearColor(0x000000, 0);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(0, 0, 9);

const scene = new THREE.Scene();
const group = new THREE.Group();
scene.add(group);

const sphereGeo = new THREE.SphereGeometry(3.024, 128, 128);
const haloGeoTight = new THREE.SphereGeometry(3.2, 32, 32);
const haloGeoSoft = new THREE.SphereGeometry(3.8, 32, 32);

const ballMat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, polygonOffset: true, polygonOffsetFactor: 1 });

const haloSoft = new THREE.Mesh(haloGeoSoft, new THREE.MeshBasicMaterial({
  color: '#FF4500', transparent: true, opacity: 0.15, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
}));
const haloTight = new THREE.Mesh(haloGeoTight, new THREE.MeshBasicMaterial({
  color: '#FF4500', transparent: true, opacity: 0.4, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
}));
group.add(haloSoft, haloTight);

const ballMesh = new THREE.Mesh(sphereGeo, ballMat);
group.add(ballMesh);

const loader = new THREE.TextureLoader();
loader.load('/logo.png', (logoTexture) => {
  const decalFront = new THREE.Mesh(
    new DecalGeometry(ballMesh, new THREE.Vector3(0, 0, 3.024), new THREE.Euler(0, 0, 0), new THREE.Vector3(2.592, 0.7776, 1)),
    new THREE.ShaderMaterial({
      uniforms: { map: { value: logoTexture } },
      vertexShader: decalVertexShader,
      fragmentShader: decalFragmentShader,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  );
  const decalBack = new THREE.Mesh(
    new DecalGeometry(ballMesh, new THREE.Vector3(0, 0, -3.024), new THREE.Euler(0, Math.PI, 0), new THREE.Vector3(2.592, 0.7776, 1)),
    new THREE.ShaderMaterial({
      uniforms: { map: { value: logoTexture } },
      vertexShader: decalVertexShader,
      fragmentShader: decalFragmentShader,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  );
  group.add(decalFront, decalBack);
  window.__sceneReady = true;
});

window.__renderFrame = (angleRad) => {
  group.rotation.y = angleRad;
  renderer.render(scene, camera);
};
`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script type="importmap">{"imports": {"three": "/vendor/three.module.js"}}</script>
</head>
<body style="margin:0;background:transparent;">
<canvas id="c" width="${FRAME_SIZE}" height="${FRAME_SIZE}"></canvas>
<script type="module">${sceneScript}</script>
</body>
</html>`;

function startServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else if (req.url === '/vendor/three.module.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(THREE_MODULE);
    } else if (req.url === '/vendor/three.core.min.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(THREE_CORE);
    } else if (req.url === '/vendor/DecalGeometry.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(DECAL_GEOMETRY);
    } else if (req.url === '/logo.png') {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(LOGO_PNG);
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'],
  });
  const page = await browser.newPage({ viewport: { width: FRAME_SIZE, height: FRAME_SIZE } });
  page.on('console', (msg) => console.log('[page]', msg.text()));
  page.on('pageerror', (err) => console.error('[pageerror]', err));

  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForFunction('window.__sceneReady === true', { timeout: 15000 });

  // Warm-up renders: the first WebGL frames after page load can trigger a
  // transient context-lost/restored cycle (or just a slow shader-compile/GPU
  // pipeline warm-up under swiftshader) in headless Chromium, which can leave
  // the canvas blank even though no error is thrown. Render a batch of
  // throwaway frames first, and additionally verify + retry every real
  // capture below — belt and suspenders, since a silent blank frame here
  // ships as a visible "gap" in the sprite.
  for (let w = 0; w < 8; w++) {
    await page.evaluate(() => window.__renderFrame(0));
    await page.waitForTimeout(150);
  }

  const sheet = new Jimp({ width: GRID_COLS * FRAME_SIZE, height: GRID_ROWS * FRAME_SIZE, color: 0x00000000 });
  const canvasHandle = page.locator('#c');

  // A real ball frame has a large solid disc of opaque pixels (ball + halo).
  // A corrupted/blank capture is almost entirely transparent. Flag anything
  // under 20% opaque coverage as bad and re-render before accepting it.
  async function isBlank(buf) {
    const img = await Jimp.fromBuffer(buf);
    const { data } = img.bitmap;
    let opaque = 0;
    const totalPixels = img.bitmap.width * img.bitmap.height;
    for (let p = 3; p < data.length; p += 4) {
      if (data[p] > 128) opaque++;
    }
    return opaque / totalPixels < 0.2;
  }

  for (let i = 0; i < FRAME_COUNT; i++) {
    const angle = (i / FRAME_COUNT) * Math.PI * 2;
    let buf;
    let attempt = 0;
    while (true) {
      attempt++;
      await page.evaluate((a) => window.__renderFrame(a), angle);
      await page.waitForTimeout(30);
      buf = await canvasHandle.screenshot({ type: 'png', omitBackground: true });
      if (!(await isBlank(buf))) break;
      if (attempt >= 5) throw new Error(`Frame ${i} kept coming back blank after ${attempt} attempts`);
      console.log(`\nFrame ${i} looked blank (attempt ${attempt}), retrying...`);
      await page.waitForTimeout(200);
    }
    const frame = await Jimp.fromBuffer(buf);
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    sheet.composite(frame, col * FRAME_SIZE, row * FRAME_SIZE);
    process.stdout.write(`\rFrame ${i + 1}/${FRAME_COUNT}`);
  }
  console.log('\nCompositing done, encoding to WebP...');

  const pngBuffer = await sheet.getBuffer('image/png');
  const webpBuffer = await sharp(pngBuffer).webp({ quality: 85, alphaQuality: 90 }).toBuffer();
  fs.writeFileSync(OUT_PATH, webpBuffer);

  await browser.close();
  server.close();

  const stats = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${(stats.size / 1024).toFixed(1)} KB), grid ${GRID_COLS}x${GRID_ROWS}, frame ${FRAME_SIZE}px`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
