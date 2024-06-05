const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    await book.save();
    res.status(201).json({ message: "Objet enregistré !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message: "Not authorized" });
    } else {
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, async () => {
        await Book.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Objet supprimé !" });
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifyBook = async (req, res, next) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    delete bookObject._userId;
    const book = await Book.findOne({ _id: req.params.id });
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message: "Not authorized" });
    } else {
      await Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      );
      res.status(200).json({ message: "Objet modifié!" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      res.status(404).json({ message: "Book not found" });
    } else {
      console.log(book)
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

//

exports.postRating = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body;
//console.log(data);
    const bulk = Book.collection.initializeOrderedBulkOp();

    bulk.find({ _id: id, "ratings.userId": data.userId }).updateOne({
      $set: { "ratings.$.grade": data.rating },
    });

    bulk.find({ _id: id, "ratings.userId": { $ne: data.userId } }).updateOne({
      $push: { ratings: { userId: data.userId, grade: data.rating } },
    });

    bulk.execute(function (err, result) {
      console.log(result);
      res.status(200).json(result);
    });

  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getBestRatings = async (req, res, next) => {
  try {
    console.log("hey");
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);

    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};
