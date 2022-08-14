const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  // get a single user by either their id or their username
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    res.json(foundUser);
  },
  // create a user, sign a token, and send it back
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: 'Something is wrong!' });
    }

    const token = signToken(user);
    res.json({ token, user });
  },
  // login a user, sign a token, and send it back
  async login({ body }, res) { // { body } is destructured req.body
    const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: 'Wrong password!' });
    }
    const token = signToken(user);
    res.json({ token, user });
  },
  async getBooks(req, res) {
    try {
      const getBooks = await Book.find({});
      return res.json(getBooks);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
  async getSingleBook({ params }, res) {
    const getBook = await Book.findOne({ bookId: params.bookId });
    if (!getBook) {
      return res.status(404).json({ message: "Couldn't find book with this id!" });
    }
    return res.json(getBook);
  },
  async saveBook({ body }, res) {
    try {
      const updatedBooks = await Book.create(body);
      return res.json(updatedBooks);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
  async deleteBook({ params }, res) {
    const updatedBook = await Book.findOneAndDelete({ bookId: params.bookId });
    if (!updatedBook) {
      return res.status(404).json({ message: "Couldn't find book with this id!" });
    }
    return res.json(updatedBook);
  }
};
