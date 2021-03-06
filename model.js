let mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let studentCollection = mongoose.Schema({
	nombre : {type : String},
	apellido : {type : String},
	matricula : {
		type : Number,
		required : true,
		unique : true
	}
});

let Student = mongoose.model("students", studentCollection);

let StudentList = {
	getAll : function(){
		return Student.find()
			.then(students =>{
				return students;
			})
			.catch(error =>{
				throw Error(error);
			});
	},

	post : function(newStudent){
		return Student.create(newStudent)
			.then(students=>{
				return students;
			})
			.catch(error=>{
				throw Error(error);
			});
	},

	deleteStudent : function(id){
		return Student.findOneAndRemove({"id":id})
			.then(students=>{
				return students;
			})
			.catch(error=>{
				throw Error(error);
			})
	}
};

module.exports = {StudentList};