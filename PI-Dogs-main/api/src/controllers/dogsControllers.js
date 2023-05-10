const axios = require("axios");
const { Op } = require("sequelize");
const { Dog, Temperamento } = require("../db");
const {API_URL} = process.env;

// Query a la base de datos en el cual traera solo los que contengan lo que pasamos por el parametro nombre
const getDogsForNameDb = async (nombre) => { 
    try{
        // Me traigo todos los datos de la base de datos
        const response = await Dog.findAll({
            where: {
                name: {
                    [Op.substring]: name // buscar un nombre donde contenga la palabra ingresada
                }
            }
        })

        // Filtro por cada uno que incluya el nombre que recibo por parametro con el nombre de cada dog y lo guardo en un array
        const dogList = await response.filter(dog => { 
            if(dog.name.toLowerCase().includes(name.toLowerCase())){
                return dog;
            }
        })

        // Mapeo el array de filtro para hacer modificaciones de como quiero presentar la informacion al front
        const listaDogsMapeado = await dogList.map(dog => {
            return {
                id: dog.id,
                name: dog.name.toLowerCase(),
                pesoMin: dog.pesoMin,
                pesoMax: dog.pesoMax,
                alturaMin: dog.alturaMin,
                alturaMax: dog.alturaMax,
                imagen: dog.imagen,
                edadMin: dog.edadMin,
                edadMax: dog.edadMax,
                proviene: "DB",
                colorFondo: dog.colorFondo
            }
        })

        return listaDogsMapeado;
    }
    // Si algo sale mal entrar aqui en el catch
    catch(err){ 
        console.log(err);
        return err;
    }
}


// Query a la API la cual nos traera todos los perros y despues los filtramos para dejar los que coincidan 
const getDogsForNameApi = async (nombre) => {
    try{
        // Traigo todo los datos de la API
        const resultado = await axios(`${API_URL}`)

        // Filtro por cada uno que incluya el nombre que recibo por parametro con el nombre de cada dog y lo guardo en un array 
        const listaDogs = await resultado.data.filter(dog => {
            const name = dog.name.toLowerCase(); // este es el nombre traido de la api
            if(name.includes(nombre.toLowerCase())){
                return dog;
            }
        })

        // Mapeo el array de filtro para hacer modificaciones de como quiero presentar la informacion al front
        const listaDogsMapeado = await listaDogs.map(dog => {
            const pesoTemp = dog.weight.metric.split("-")
            const alturaTemp = dog.height.metric.split("-")
            const imagen = dog.image.url
            const edadTemp = dog.life_span.slice(0, 7).split("-")
            return {
                id: dog.id,
                nombre: dog.name.toLowerCase(),
                pesoMin: pesoTemp[0],
                pesoMax: pesoTemp[1],
                alturaMin: alturaTemp[0],
                alturaMax: alturaTemp[1],
                temperamento: dog.temperament,
                imagen: imagen,
                edadMin: edadTemp[0],
                edadMax: edadTemp[1],
                proviene: "API"
            }
        })

        return listaDogsMapeado;

    }
    // Si algo sale mal entrar aqui en el catch
    catch(err){
        console.log(err);
        return err;
    }
}


// Query a la API para traer a todos los perros.
const getAllDogsApi = async () => {
    try{
        // Traigo todo los datos de la API
        const resultado = await axios(`${API_URL}`)

        // Mapeo el cada uno de los resultados para modificar el objeto que envio al front
        const listaDogs = await resultado.data.map(dog => {
            const pesoTemp = dog.weight.metric.split("-")
            const alturaTemp = dog.height.metric.split("-")
            const imagen = dog.image.url
            const edadTemp = dog.life_span.slice(0, 7).split("-")
            return {
                id: dog.id,
                nombre: dog.name.toLowerCase(),
                pesoMin: pesoTemp[0],
                pesoMax: pesoTemp[1],
                alturaMin: alturaTemp[0],
                alturaMax: alturaTemp[1],
                temperamento: dog.temperament,
                imagen: imagen,
                edadMin: edadTemp[0],
                edadMax: edadTemp[1],
                proviene: "API"
            }
        })
        return listaDogs;
    }
    // Si algo sale mal entrar aqui en el catch
    catch(err){
        return err;
    }
}


// Query a la base de datos para traer a todos los perros.
const getAllDogsDb = async () => {
    try{
        // Traigo todos los datos de la base de datos.
        const resultado = await Dog.findAll({
            include: Temperamento
        });

        // Mapeo el cada uno de los resultados para modificar el objeto que envio al front
        const listaDogs = await resultado.map(dog => {
            return {
                id: dog.id,
                nombre: dog.nombre.toLowerCase(),
                pesoMin: dog.pesoMin,
                pesoMax: dog.pesoMax,
                alturaMin: dog.alturaMin,
                alturaMax: dog.alturaMax,
                imagen: dog.imagen,
                edadMin: dog.edadMin,
                edadMax: dog.edadMax,
                proviene: "DB",
                temperamento: dog.Temperamentos,
                colorFondo: dog.colorFondo
            }
        })
        return listaDogs;
    }
    // Si algo sale mal entrar aqui en el catch
    catch(err){
        console.log(err);
        return err;
    }
}

// Query a la API para traer el dog con el id pasado por params
const getDogsForIdApi = async (id) => {
    try{
        // Traigo todo los datos de la API
        const resultado = await axios(`${API_URL}`)

        

        // Filtro por cada uno que incluya el nombre que recibo por parametro con el nombre de cada dog y lo guardo en un array 
        const dogEncontrado = await resultado.data.filter(dog => {
            if(parseInt(dog.id) === parseInt(id)) return dog
        })

        const ordenarDatos = await dogEncontrado.map(dog => {
            const pesoTemp = dog.weight.metric.split("-")
            const alturaTemp = dog.height.metric.split("-")
            const imagen = dog.image.url
            const edadTemp = dog.life_span.slice(0, 7).split("-")
            return {
                id: dog.id,
                nombre: dog.name.toLowerCase(),
                pesoMin: pesoTemp[0],
                pesoMax: pesoTemp[1],
                alturaMin: alturaTemp[0],
                alturaMax: alturaTemp[1],
                temperamento: dog.temperament,
                imagen: imagen,
                edadMin: edadTemp[0],
                edadMax: edadTemp[1],
                proviene: "API"
            }
        })

        return ordenarDatos;

    }catch(err){
        console.log("error");
        return err;
    }
}


// Query a la base de datos en el cual traera solo los que contengan el id
const getDogsForIdDb = async (id) => { 
    try{
        // Me traigo todos los datos de la base de datos
        const resultado = await Dog.findAll({
            where: {
                id: id
            },
            include: Temperamento
        })

        const listaTemperamentos = resultado[0].Temperamentos.map(temp => temp.nombre)

        const listaDogs = resultado.map(dog => {
            return {
                id: dog.id,
                nombre: dog.nombre.toLowerCase(),
                pesoMin: dog.pesoMin,
                pesoMax: dog.pesoMax,
                alturaMin: dog.alturaMin,
                alturaMax: dog.alturaMax,
                imagen: dog.imagen,
                edadMin: dog.edadMin,
                edadMax: dog.edadMax,
                proviene: "DB",
                temperamento: listaTemperamentos.join(", "),
                colorFondo: dog.colorFondo
            }
        })

        return listaDogs;
    }
    // Si algo sale mal entrar aqui en el catch
    catch(err){ 
        console.log(err);
        return err;
    }
}



module.exports = {
    getDogsForNameDb,
    getDogsForNameApi,
    getAllDogsApi,
    getAllDogsDb,
    getDogsForIdApi,
    getDogsForIdDb,
}