const express = require('express');
const router = express();
const dogs = require("./dogsRoute");
const temperamento = require("./temperamentRoute");

// Rutas principales
router.use("/dogs", dogs)
router.use("/temperament", temperamento)




module.exports = router;
