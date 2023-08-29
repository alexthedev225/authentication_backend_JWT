const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Fonction de création d'utilisateur
exports.createUser = (req, res) => {
    bcrypt.hash(req.body.password, 10) // Hashage du mot de passe
        .then(hash => {
            const user = new User({
                username: req.body.username,
                password: hash,
                name: req.body.name,
                imageProfil: req.file.path // Chemin du fichier téléchargé
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'Utilisateur créé avec succès',
                        user: result
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
        });
};

// Fonction de connexion de l'utilisateur
exports.loginUser = (req, res) => {
    let fetchedUser;
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Authentification échouée'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Authentification échouée'
                });
            }
            const token = jwt.sign(
                { username: fetchedUser.username, userId: fetchedUser._id },
                JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(error => {
            return res.status(401).json({
                message: 'Authentification échouée'
            });
        });
};
