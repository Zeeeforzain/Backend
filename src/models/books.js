const mongoose = require("mongoose");
const validator = require("validator");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [3, "Title must be at least 3 characters long"],
    unique: true, // MongoDB handles uniqueness error messages
    validate: {
      validator: function (value) {
        // Allow letters, spaces, and some punctuation marks (like hyphen and period)
        return /^[A-Za-z\s\-.]+$/.test(value);
      },
      message: "Title should contain only letters, spaces, hyphens, or periods",
    },
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    minlength: [3, "Author name must be at least 3 characters long"],
    unique: true, // MongoDB handles uniqueness error messages
    validate: {
      validator: function (value) {
        // Allow letters, spaces, and some punctuation marks (like hyphen and period)
        return /^[A-Za-z\s\-.]+$/.test(value);
      },
      message: "Author name should contain only letters, spaces, hyphens, or periods",
    },
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
    validate: {
      validator: function (value) {
        const currentYear = new Date().getFullYear();
        // Check if the year is a 4-digit number and not greater than the current year
        return value.toString().length === 4 && value <= currentYear;
      },
      message: "Year should be a 4-digit number and not greater than the current year",
    },
  },
});
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
