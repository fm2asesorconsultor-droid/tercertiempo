const jimp = require('jimp');

async function smartRemoveBg() {
  try {
    const filePath = 'x:\\TERCERTIEMPO\\tercer-tiempo\\public\\fans-transparent.png';
    console.log('Reading image...', filePath);
    
    const JimpClass = jimp.Jimp || jimp;
    const image = await JimpClass.read(filePath);
    
    // Auto-detect background color from the top-left pixel
    const bgRed = image.bitmap.data[0];
    const bgGreen = image.bitmap.data[1];
    const bgBlue = image.bitmap.data[2];
    const targetColor = { r: bgRed, g: bgGreen, b: bgBlue };
    
    console.log(`Detected background color: RGB(${bgRed}, ${bgGreen}, ${bgBlue})`);
    
    const colorDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
    
    // Since ChatGPT usually generates images with white or off-white backgrounds for isolation,
    // we use a tolerance of 30. If it's a pure white background, this will perfectly slice it.
    const tolerance = 40; 

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      const dist = colorDistance({r: red, g: green, b: blue}, targetColor);
      
      if (dist < tolerance) {
        this.bitmap.data[idx + 3] = 0; // Transparent
      } else if (dist < tolerance + 20) {
        // Soft edge
        const alpha = Math.floor(((dist - tolerance) / 20) * 255);
        this.bitmap.data[idx + 3] = alpha;
      }
    });

    await new Promise((resolve, reject) => {
      image.write(filePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Background removed. Saved to', filePath);
  } catch(e) {
    console.error('Error:', e);
  }
}

smartRemoveBg();
