// Importation des dépendances
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/userRoute");

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Routes
app.get("/", (req, res) => {
  res.send("Bienvenue sur votre serveur Express.js !");
});
app.use("/users", userRoute);

// Démarrage du serveur
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Serveur démarré sur le port http://localhost:${port}`)
);

module.exports = app;
