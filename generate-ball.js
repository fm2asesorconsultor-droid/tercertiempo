const fs = require('fs');
const path = require('path');
const THREE = require('three');
// Load ConvexGeometry
const { ConvexGeometry } = require('three/examples/jsm/geometries/ConvexGeometry.js');
const { OBJExporter } = require('three/examples/jsm/exporters/OBJExporter.js');

const phi = (1 + Math.sqrt(5)) / 2;

const vertices = [];
const add = (x, y, z) => {
  vertices.push(new THREE.Vector3(x, y, z));
};

const addPermutations = (x, y, z) => {
  // Even permutations
  add(x, y, z);
  add(y, z, x);
  add(z, x, y);
};

const signs = [
  [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
  [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
];

signs.forEach(([sx, sy, sz]) => {
  addPermutations(0, sx * 1, sz * 3 * phi);
  addPermutations(sx * 1, sy * (2 + phi), sz * 2 * phi);
  addPermutations(sx * phi, sy * 2, sz * (1 + 2 * phi));
});

// Create Geometry
const geometry = new ConvexGeometry(vertices);

// We want to scale it to radius 2
geometry.computeBoundingSphere();
const scale = 2 / geometry.boundingSphere.radius;
geometry.scale(scale, scale, scale);

const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

const exporter = new OBJExporter();
const obj = exporter.parse(mesh);

fs.writeFileSync(path.join(__dirname, 'public', 'soccerball.obj'), obj);
console.log('soccerball.obj generated successfully!');
