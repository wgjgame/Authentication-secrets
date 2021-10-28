//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});


app.post("/login",function(req,res){
    User.findOne({email:req.body.username},{password:req.body.password},function(err,founditem){
    if(!err){
      if(founditem){
      res.render("secrets");
    }else{
      console.log("didn't find matched item");
    }
    }else{
      console.log(err);
    }
  });
});


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
