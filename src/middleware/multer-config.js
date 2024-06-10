const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${name}_${Date.now()}.${extension}`);
    }
});

const upload = multer({ storage }).single('image');

const compressImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path;
    const outputFilePath = path.join('public/images', `compressed_${req.file.filename}`);
    const originalFileName = req.file.filename;

    try {
        await sharp(filePath)
            .resize({ width: 800, height: 800, fit: 'contain' })
            .toFormat('webp')
            .webp({ quality: 80 }) 
            .toFile(outputFilePath)

        req.file.path = outputFilePath;
        req.file.filename = `compressed_${req.file.filename}`;

        await fs.promises.unlink(path.join(__dirname, "..", "..", "public", "images", originalFileName));
    } catch (e) {
        console.error(e)
    }

    return next();
};

module.exports = { upload, compressImage };
