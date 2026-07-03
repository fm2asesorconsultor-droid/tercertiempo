const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('font-title')) {
        // Add font-black if not present
        if (!content.includes('font-black')) {
          content = content.replace(/font-title/g, 'font-title font-black');
          fs.writeFileSync(fullPath, content);
          console.log('Added font-black to: ' + fullPath);
        }
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Done.');
