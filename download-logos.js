const https = require('https');
const fs = require('fs');

function download(fileUrl, dest) {
  const file = fs.createWriteStream(dest);
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
  };
  https.get(fileUrl, options, function(response) {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      const redirectUrl = new URL(response.headers.location, fileUrl).href;
      console.log('Redirecting to: ' + redirectUrl);
      return download(redirectUrl, dest);
    }
    response.pipe(file);
    file.on('finish', function() {
      file.close(); 
      console.log('Downloaded ' + dest);
    });
  }).on('error', function(err) {
    fs.unlinkSync(dest);
    console.error(err.message);
  });
}

download('https://upload.wikimedia.org/wikipedia/commons/a/a9/Escudo_del_Club_Atl%C3%A9tico_River_Plate.svg', 'public/teams/river-plate.svg');
