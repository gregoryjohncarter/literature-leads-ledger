const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  // saved book id from GoogleBooks
  bookId: {
    type: String,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
  },
  user: {
    type: String
  }
});

const Book = model('Book', bookSchema);

module.exports = Book;
