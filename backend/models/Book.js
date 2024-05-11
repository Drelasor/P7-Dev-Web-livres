const mongoose = require("mongoose");

const ratingSchema = new Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true },
});

const bookSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String },
  year: { type: Number },
  genre: { type: String },
  ratings: [ratingSchema],
  averageRating: { type: Number },
});

module.exports = mongoose.model("Book", bookSchema);
