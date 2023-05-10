const { Router } = require("express");
const router = Router();
const { Dog, Temperamento } = require("../db"); // me lo traigo desde db, por que viene con la conexion al sequelize
const { 
    getDogsForNameDb,
    getDogsForNameApi,
    getAllDogsApi,
    getAllDogsDb,
    getDogsForIdApi,
    getDogsForIdDb,
} = require("../controllers/dogsControllers");


// Get a /dogs para obtener un dog por su id
router.get("/:id", async (req, res) => {

    // valido si me llega un id por parametro
    if(req.params.id){ 
        const { id } = req.params;
        console.log(id)
        try{
            const getDogForIdAp = await getDogsForIdApi(id); 
            const getDogForId = await getDogsForIdDb(id);
            
            if(id < 500) return res.status(200).json(getDogForIdAp);            
            else return res.status(200).json(getDogForId);
        }
        // Si algo sale mal entrar aqui en el catch
        catch(err){
            console.log(err)
            res.send({error: err})
        }
     }
})


// Get a /dogs ->  alldogs y dogsForName
router.get("/", async (req, res) => {
    
    // valido si me llega un nombre por parametro
    if(req.query.nombre){ 
        const { nombre } = req.query;
        try{
            const getDogForNameAp = await getDogsForNameApi(nombre); 
            const getDogForName = await getDogsForNameDb(nombre);

            // concateno todo en un solo array
            const respuestaConcatenada = getDogForName.concat(getDogForNameAp);

            res.status(200).json({data: respuestaConcatenada});
        }
        // Si algo sale mal entrar aqui en el catch
        catch(err){
            console.log(err)
            res.send({error: err})
        }
     }
     else{
         // Si no pasan un nombre automaticamente aplicara un traer todo
        try{
            const getAllDogsAp = await getAllDogsApi();
            const getAllDogs = await getAllDogsDb();
            const respuestaConcatenada = getAllDogs.concat(getAllDogsAp);

            res.status(200).send(respuestaConcatenada);
        }
        // Si algo sale mal entrar aqui en el catch
        catch(err){
            console.log(err)
            res.send({error: err})
        }
    }
    
})


// Post a /dogs
router.post("/", async (req, res) => {
    // Destructuro los datos que me llegan por body
    const { nombre, alturaMax, alturaMin, pesoMax, pesoMin, edadMax, edadMin, imagen, temperamento, colorFondo } = req.body;
        // Creo el Dog
        // const resultado = await Dog.create({
        //     nombre, alturaMax, alturaMin, pesoMax, pesoMin, edadMax, edadMin, imagen, colorFondo
        // })

        Dog.create({
            nombre, alturaMax, alturaMin, pesoMax, pesoMin, edadMax, edadMin, imagen, colorFondo
        })
        .then(async response => {
            for(let i = 0; i < temperamento.length; i++){
                response.addTemperamentos(await Temperamento.findOne({ // busco por nombre de temperamento y el que encuentre lo agrego a la tabla intermedia
                    where: {
                        nombre: temperamento[i]
                    }
                }))
            }
        })
        .catch(err => err)

      
        
      
        res.send("ok");
    // Si algo sale mal entrar aqui en el catch
    
})   

module.exports = router;