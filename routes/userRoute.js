const express = require('express')
const router = express.Router()
const multer = require('multer');
const userController = require('../controllers/userController')

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('imageProfil'),userController.createUser)

module.exports = router