const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Book = require("./models/Book");
const userRoutes = require ('./routes/user');


mongoose
  .connect(
    "mongodb+srv://otumbarg:Drelasor1995@cluster0.jwoafkr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


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

app.use(bodyParser.json());

/* app.post("/api/auth/signup",(req, res, next) => {
  const user = new User({
    ...req.body
  });

  user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur enregistré'}))
    .catch(error => res.status(400).json({ error }));
});
 */


app.get("/api/books/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
});

app.post("/api/books", (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

app.use("/api/books", (req, res, next) => {
  Book.find()
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
});

/* app.use('/api/books', Book) */
app.use('/api/auth', userRoutes)

module.exports = app;
