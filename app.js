const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Database require connection
const dbConnect = require("./db/dbConnect");
//User model requirement
const User = require("./db/userModel");
const auth = require("./auth");
//Execute database connection
dbConnect();

//Curb cors error by adding a header here
app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE, PATCH"
  );
  next();
});

//cloudinary configurations
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Server response" });
});

//Endpoint to register user
app.post("/register", (req, res) => {
  //Hash password from user and save to database in then block else throw error and catch block

  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(req.body.password, salt);

  //Create a new user instance and collect the data
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  user
    .save()
    //return success if the new user is added to the database successfully
    .then((result) => {
      res.status(201).send({
        message: "User created successfully",
        result,
      });
    })
    //Catch error if new user wasn't added successfully to the database
    .catch((err) => {
      res.status(500).send({
        message: "Error creating user",
        err,
      });
    });
});

//Endpoint to login user
app.post("/login", (req, res)=>{
    User.findOne({email: req.body.email})
    // if email exist
    .then((user)=>{
        bcrypt.compare(req.body.password, user.password).then((passwordCheck) =>{
            //check if password matches with hashed password
            if(!passwordCheck){
                return res.status(400).send({
                    message: "Password does not match"
                })
            }
            //create JWT token
            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email 
                },
                process.env.SECRET_KEY,
                { expiresIn: "1h"});
                
                //return success response
                res.status(200).send({
                  message: "Login successful",
                  email: user.email,
                  token
                });
        }).
        catch((e)=>{
            res.status(400).send({
                message: "Password don't match",
                e
            });
        });
    })
    .catch((e) => {
        res.status(404).send({
            message: "Email not found",
            error: new Error(e)
        })
    })
});

//free test endpoint
app.get("/free", (req, res)=>{
  res.json({ message: "Free test endpoint"})
});

//Authentication endpoint
app.get("/auth", auth, (req, res) => {
  res.json({ message: "Authentication endpoint"});
})

//image upload API
app.post("/upload-image", (req, res) => {
  //collected image from a user
  const data = {
    image: req.body.image,
  };

  //upload image here
  cloudinary.uploader
    .upload(data.image)
    .then((result) => {
      res.status(200).send({
        message: "Successfully uploaded image",
        result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error uploading image",
        err,
      });
    });
});

module.exports = app;
