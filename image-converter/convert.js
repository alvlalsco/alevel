const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './image-original';
const outputDir = './image-optimized';

// Check if output directory exists, if not, create it
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Maximum width for your website images
const MAX_WIDTH = 1200;

fs.readdirSync(inputDir).forEach(file => {
    // Only process jpg, jpeg, and png files
    if (file.match(/\.(jpe?g|png)$/i)) {
        const inputPath = path.join(inputDir, file);
        const fileName = path.parse(file).name;

        // 1. Convert to AVIF (Shrinks width, converts format, compresses)
        sharp(inputPath)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .avif({ quality: 80 })
            .toFile(path.join(outputDir, `${fileName}.avif`))
            .then(() => console.log(`✅ Success: ${fileName}.avif`))
            .catch(err => console.error(`❌ Error on ${file}:`, err));
    }
});
