const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const userRoutes = require ('./src/routes/user')
const booksRoutes = require('./src/routes/books')
const path = require("node:path")
require('dotenv').config()


mongoose
.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"))


const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json())
app.use('/api/books', booksRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname,'public','images')))


module.exports = app;
