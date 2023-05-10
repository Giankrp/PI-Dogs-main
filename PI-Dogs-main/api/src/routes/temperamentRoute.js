const axios = require("axios");
const { Router } = require("express");
const router = Router();
const { Temperamento } = require("../db");
const {API_URL} = process.env;

// Get a /temperament
router.get("/", async (req, res) => {
    // Me traigo los Dogs de la api
    const resultado = await axios.get(`${API_URL}`);

    // Guardo en lista de temperamentos todos los resultados despues de aplicarle limpieza a cada uno
    const listaTemperamentos = resultado.data.map(dog => {
        // Si no viene un temperamento agrego undefined
        if(!dog.temperament) return dog.temperament = undefined;
        // A todos los demas los spliteo por ", " para añadirlos a un array en la constante aux
        const aux = dog.temperament.split(", "); 
        return aux;
    });

    const limparValoresUndefined = listaTemperamentos.flat().filter(Boolean); // limpio todo lo que sea null, undefine sin importar el nivel en el que este en el array
    const valoresUnicos = new Set(limparValoresUndefined); // Quito todas las repeticiones y solo dejo un valor unico
    const resultadoFinal = [...valoresUnicos]; // hago destructurin del array valores unicos y los guardo en resultadoFinal


    // Encuentro o creo en el modelo de Temperamento, cada temperamento donde el nombre sea igual al dog en el que estoy en ese momento
    resultadoFinal.forEach(dog => Temperamento.findOrCreate({
        where: {
            nombre: dog
        }
    }))

    const resultado2 = await Temperamento.findAll(); // Me traigo todos los temperamentos de la base de datos
    res.send(resultado2); 
})

module.exports = router;