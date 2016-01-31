var mysql = require('mysql');
var pw = require('./pw.js');
var prompt = require('prompt');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : pw.pw.pw,
  database : 'zoo_db'
});
prompt.start();
connection.connect();
prompt.message = "";

var zoo = {
  welcome: function(){
    console.log('Welcome to the Zoo and Friends App~!');
  },
  menu: function(){
    console.log('Enter (A) ----- to Add a new Animal to the Zoo!');
    console.log('Enter (U) ----- to Update info on an animal in the Zoo!');
    console.log('Enter (V) ----- to Visit the animals in the Zoo!');
    console.log('Enter (D) ----- to Adopt an animal from the Zoo!');
    console.log('');
    console.log('Enter (Q) ----- to Quit/Exit the Zoo');
  },
  add: function(input_scope){
    var currentScope = input_scope;
    console.log("To Add animal, fill out form")
    prompt.get(['name','type','age','caretaker'],function(err, result){
      var query = 'INSERT INTO animals (name,type,age,caretaker_id) VALUES (?,?,?,?)'
      var toAdd = [result.name,result.type,result.age,result.caretaker]
      connection.query(query, toAdd, function(err, results) {
        if(err) throw err;
        console.log("Added");
        currentScope.menu();
        currentScope.promptUser();
      })
    });
  },
  visit: function(){
    console.log("Enter (I): ----- do you know the animal by it's id? We will visit that animal!");
    console.log("Enter (N): ----- do you know the animal by it's name? We will visit that animal!");
    console.log("Enter (A): ----- here's the count for all animals in all locations!");
    console.log("Enter (C): ----- here's the count for all animals in this one city!");
    console.log("Enter (O): ----- here's the count for all the animals in all locations by the type you specified!");
    console.log("Enter (Q): ----- Quits to the main menu!");
    this.view(this)
  },
  view: function(input_scope){
    var currentScope = input_scope;
    prompt.get(['visit'],function(err,result){
      if(result.visit === "Q"){
        currentScope.menu();
        currentScope.promptUser()
      }
      else if(result.visit === "O"){
        currentScope.type(currentScope);
      }
      else if(result.visit === "I"){
        currentScope.animId(currentScope);
      }
      else if(result.visit === "N"){
        currentScope.name(currentScope);
      }
      else if(result.visit === "A"){
        currentScope.all(currentScope);
      }
      else if(result.visit === "C"){
        currentScope.care(currentScope);
      }
      else{
        console.log("Sorry didnt get that");
      }
    });
  },
  type: function(input_scope){
    var currentScope = input_scope;
    prompt.get(["animal_type"], function(err,result){
      var query = 'SELECT COUNT(type) FROM animals WHERE type=?'
      var inputType = result.animal_type;
      connection.query(query, inputType, function(err, results) {
        if(err) throw err;
        console.log(results);
        currentScope.visit()
        
      })
    });
  },
  care: function(input_scope){
    console.log("Enter City NY/SF")
    var currentScope = input_scope;
    prompt.get(['city_name'], function(err, results){
      var query = 'SELECT COUNT(*) FROM animals,caretakers WHERE caretakers.city=? AND caretakers.id=animals.caretaker_id'
      var inputType = results.city_name;
      connection.query(query, inputType, function(err, results) {
        if(err) throw err;
        console.log(results);
        currentScope.visit()
        
      })
    });
  },
  animId: function(input_scope){
    var currentScope = input_scope;
    console.log("Enter ID of Animal")
    prompt.get(['animal_id'],function(err,results){
      var query = 'SELECT * FROM animals WHERE id=?'
      var inputType = results.animal_id;
      connection.query(query, inputType, function(err, results) {
        if(err) throw err;
        console.log(results);
        currentScope.visit()
        
      })
    });
  },
  name: function(input_scope){
    var currentScope = input_scope;
    console.log("Enter Name of Animal")
    prompt.get(['animal_name'],function(err,results){
      var query = 'SELECT * FROM animals WHERE name=?'
      var inputType = results.animal_name;
      connection.query(query, inputType, function(err, results) {
        if(err) throw err;
        console.log(results);
        currentScope.visit()
        
      })
    });
  },
  all: function(input_scope){
    var currentScope = input_scope;
      var query = 'SELECT COUNT(*) FROM animals'
      connection.query(query, function(err, results) {
        if(err) throw err;
        console.log(results);
        currentScope.visit()
        
      })
  },
  update: function(input_scope){
    var currentScope = input_scope;
    prompt.get(['id','new_name','new_age','new_type','new_caretaker_id'],function(err,results){
      var query = 'UPDATE animals SET name=?,type=?,caretaker_id=?,age=? WHERE id=?'
      var inputType = [results.new_name,results.new_type,results.new_caretaker_id,results.new_age,results.id];
      connection.query(query, inputType, function(err, results) {
        if(err) throw err;
        console.log(results);
        currentScope.menu()
        currentScope.promptUser()
      })
    });
  },
  adopt: function(input_scope){
    var currentScope = input_scope;
    prompt.get(['animal_id'],function(err,results){
      var query = 'DELETE FROM animals WHERE id=?'
      var inputType = results.animal_id ;
      connection.query(query, inputType, function(err, results) {
        if(err) throw err;
        console.log(results);
        currentScope.menu()
        currentScope.promptUser()
      })
    });
  },
  promptUser: function(){
    var self = this;
    prompt.get(['input'],function(err,results){
      if(results.input === "Q"){
        self.exit()
      }
      else if(results.input === "A"){
        self.add(self)
      }
      else if(results.input === "V"){
        self.visit()
      }
      else if(results.input === "D"){
        self.adopt(self)
      }
      else if(results.input === "U"){
        self.update(self);
      }
      else{
        console.log("Sorry didnt get that");
      }
    });
  },
  exit: function(){
    console.log("Thanks For Visiting us, Good Bye")
    connection.end();
    process.exit()
  },
  open: function(){
    this.welcome()
    this.menu()
    this.promptUser()
  }
}
zoo.open()