let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let jsonParser = bodyParser.json();
let {StudentList} = require("./model");

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
	//res.status(200).json(estudiantes);
});


app.get("/api/getById", (req, res)=>{
	let id = req.query.id;

	let result = estudiantes.find((elemento) =>{
		if(elemento.matricula == id){
			return elemento;
		}
	});

	if (result){
		return res.status(200).json(result);
	}
	else{
		res.statusMessage = "El alumno no se encuentra en la lista";
		return res.status(404).send();
	}
	
});

app.get("/api/getByName/:name", (req, res)=>{
	/*let name = req.params.name;

	let result = estudiantes.filter((elemento) =>{
		if(elemento.nombre === name){
			return elemento;
		}
	});

	if (result.length > 0){
		return res.status(200).json(result);
	}
	else{
		res.statusMessage = "El alumno no se encuentra en la lista";
		return res.status(404).send();
	}*/
	
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


app.put("/api/updateStudent/:id", jsonParser, (req, res)=>{
	let nombre = req.body.nombre;
	let apellido = req.body.apellido;
	let matricula = req.body.matricula;
	let id = req.params.id;

	if(matricula=="")
	{
        res.statusMessage = "Faltan datos!";
       	return res.status(406).json({
       		message : "Faltan datos!",
        	status : 406
       	});
      
    }

	else if(nombre=="" && apellido=="")
	{
		res.statusMessage = "Faltan datos!";
       	return res.status(406).json({
        	message : "Faltan datos!",
        	status : 406
       	});
	}

	if(id != matricula)
	{
		res.statusMessage= "Matriculas no coinciden";
		return res.status(409).json({
			message : "Matriculas no coinciden",
			status : 409
		});
	}


	let result = estudiantes.find((elemento) =>{
		if(elemento.matricula == matricula)
		{
			return elemento
		}
	});

	if(result){
		return res.status(200).json(result);
	}
	else{
		res.statusMessage = "La matricula no se encontro en la lista";
		return res.status(404).send();
	}

	for(let x=0; x<estudiantes.length; x++)
	{
		if(estudiantes[x].matricula == id)
		{
			
			if(nombre)
			{
				estudiantes[x].nombre = nombre;
			}

			if(apellido)
			{
				estudiantes[x].apellido = apellido;
			}
			return res.status(202).json(estudiantes[x]);
		}
		
	}		
});

app.delete("/api/deleteStudent", (req, res)=>{
	let id = req.query.id;
	if(id =="")
	{
		res.statusMessage = "No hay id";
       	return res.status(406).json({
        	message : "No hay id",
        	status : 406
       	});
	}

	StudentList.deleteStudent(id)
		.then(students => {
        	if (students) 
        	{
            	
            	return res.status(200).json(students);
        	} 
        	else 
        	{
	            res.statusMessage = "No se encontro al estudiante"
	            return res.status(404).json({
	                message: "No se encontro al estudiante",
	                status: 404
	            })
            }
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

runServer(8080, "mongodb://localhost/university");

module.exports={app, runServer, closeServer}

/*app.listen(8080, ()=>{
	console.log("Servidor corriendo en puerto 8080");
});*/