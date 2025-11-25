const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const publicDir = path.join(__dirname, '..', 'public');
    const src = path.join(publicDir, 'logo1.png');
    if (!fs.existsSync(src)) {
      console.error('Source logo1.png not found at', src);
      process.exit(1);
    }

    const out192 = path.join(publicDir, 'logo-192.png');
    const out512 = path.join(publicDir, 'logo-512.png');

    await sharp(src).resize(192, 192, { fit: 'cover' }).toFile(out192);
    console.log('Wrote', out192);
    await sharp(src).resize(512, 512, { fit: 'cover' }).toFile(out512);
    console.log('Wrote', out512);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
