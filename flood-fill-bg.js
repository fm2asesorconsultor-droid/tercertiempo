const jimp = require('jimp');

async function floodFillRemoveBg() {
  try {
    const inputPath = 'x:\\TERCERTIEMPO\\tercer-tiempo\\public\\ChatGPT Image 1 jul 2026, 23_50_43.png';
    const outPath = 'x:\\TERCERTIEMPO\\tercer-tiempo\\public\\fans-transparent.png';
    console.log('Reading image...', inputPath);
    
    const JimpClass = jimp.Jimp || jimp;
    const image = await JimpClass.read(inputPath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Background color from top-left
    const bgR = image.bitmap.data[0];
    const bgG = image.bitmap.data[1];
    const bgB = image.bitmap.data[2];
    const targetColor = {r: bgR, g: bgG, b: bgB};
    
    console.log(`Background color detected: RGB(${bgR}, ${bgG}, ${bgB})`);
    
    // Strict tolerance to prevent leaking into white shirts
    const tolerance = 15; 
    const colorDist = (r, g, b, t) => Math.sqrt((r-t.r)**2 + (g-t.g)**2 + (b-t.b)**2);

    const visited = new Uint8Array(width * height);
    const queue = [{x: 0, y: 0}, {x: width-1, y: 0}, {x: 0, y: height-1}, {x: width-1, y: height-1}];
    
    // Mark corners as visited
    visited[0] = 1;
    visited[width-1] = 1;
    visited[(height-1)*width] = 1;
    visited[(height-1)*width + width - 1] = 1;

    let head = 0;
    while(head < queue.length) {
      const {x, y} = queue[head++];
      const idx = (y * width + x) * 4;
      
      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx+1];
      const b = image.bitmap.data[idx+2];
      
      if (colorDist(r, g, b, targetColor) <= tolerance) {
        // Set transparent
        image.bitmap.data[idx+3] = 0;
        
        // Add neighbors
        const neighbors = [
          {nx: x+1, ny: y}, {nx: x-1, ny: y},
          {nx: x, ny: y+1}, {nx: x, ny: y-1}
        ];
        
        for (const n of neighbors) {
          if (n.nx >= 0 && n.nx < width && n.ny >= 0 && n.ny < height) {
            const vIdx = n.ny * width + n.nx;
            if (visited[vIdx] === 0) {
              visited[vIdx] = 1;
              queue.push({x: n.nx, y: n.ny});
            }
          }
        }
      }
    }

    // Secondary pass for anti-aliasing edges (soften the hard pixels left behind)
    image.scan(0, 0, width, height, function (x, y, idx) {
      if (this.bitmap.data[idx+3] !== 0) {
        const r = this.bitmap.data[idx];
        const g = this.bitmap.data[idx+1];
        const b = this.bitmap.data[idx+2];
        const dist = colorDist(r, g, b, targetColor);
        // If it's very close to background but wasn't caught by flood fill (anti-aliased edge)
        // We make it semi-transparent
        if (dist < tolerance + 30 && y < height * 0.8) {
             const alpha = Math.floor(((dist - tolerance) / 30) * 255);
             if(alpha < this.bitmap.data[idx+3]) {
                 this.bitmap.data[idx+3] = alpha;
             }
        }
      }
    });

    await new Promise((resolve, reject) => {
      image.write(outPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Flood fill background removed. Saved to', outPath);
  } catch(e) {
    console.error('Error:', e);
  }
}

floodFillRemoveBg();
