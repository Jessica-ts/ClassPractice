let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let jsonParser = bodyParser.json();
let {StudentList} = require("./model");
let {DATABASE_URL, PORT} = require("./config");

let app = express();

app.use(express.static("public"));
app.use(morgan("dev"));

let estudiantes = [{
	nombre : "Miguel",
	apellido : "Ángeles",
	matricula : 1730939

},

{
	nombre : "Erick",
	apellido : "González",
	matricula : 1039859
},

{
	nombre : "Victor",
	apellido : "Villareal",
	matricula : 1039863
},

{
	nombre : "Victor",
	apellido : "Cárdenas",
	matricula : 816350
}];


app.get("/api/students", (req, res)=>{
	
	StudentList.getAll()
		.then(studentList =>{
			return res.status(200).json(studentList);
		})
		.catch(error =>{
			console.log(error);
			res.statusMessage = "Hubo un error de conexion con la BD."
			return res.status(500).send();
		});
});

app.post("/api/newStudent", jsonParser, (req, res)=>{
	let nombre = req.body.nombre;
	let apellido = req.body.apellido;
	let matricula = req.body.matricula;

    if (nombre == "" || apellido == "" || matricula == "" ) {
        res.statusMessage = "Faltan datos!";
        return res.status(406).json({
            message : "Faltan datos!",
            status : 406
        });
    }

	let nuevoEstudiante=
	{
		nombre : nombre,
		apellido : apellido,
		matricula : matricula
	};
	
   	StudentList.post(nuevoEstudiante)
   		.then(studentList=>{
   			return res.status(201).json(studentList);
   		})
   		.catch(error=>{
   			console.log(error);
   			res.statusMessage = "Hubo un error de conexion con la BD."
			return res.status(500).send();
   		});

});


let server;
function runServer(port, databaseUrl){
 	return new Promise( (resolve, reject ) => {
 		mongoose.connect(databaseUrl, response => {
 			if ( response ){
 				return reject(response);
 			}
 			else{
 				server = app.listen(port, () => {
 					console.log( "App is running on port " + port );
					 resolve();
				})
 				.on( 'error', err => {
 					mongoose.disconnect();
 					return reject(err);
 				})
 			}
 		});
 	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
 			return new Promise((resolve, reject) => {
 				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
	 				}
					else{
 						resolve();
					}
 				});
 			});
 		});
}

runServer(PORT, DATABASE_URL);

module.exports={app, runServer, closeServer}
