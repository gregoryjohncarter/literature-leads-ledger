const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    books: async () => {
      return Book.find({});
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
    
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const token = signToken(user);
      return { token, user };
    },
    addBook: async (parent, args, context) => {
      if (context.user) {
        const book = await Book.create({ ...args, user: context.user.username, likeCount: '1', likes: [context.user.username] });
        return book;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedBooks = await Book.deleteOne({ bookId });
        return updatedBooks;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    addLike: async (parent, { bookId }, context) => {
      if (context.user) {
        const findCount = await Book.findOne(
          { bookId: bookId }
        );
        const updatedBook = await Book.findOneAndUpdate(
          { bookId: bookId },
          { $set: { likeCount: String((Number(findCount.likeCount)+1)), likes: [...findCount.likes, context.user.username] }},
          { new: true, runValidators: true }
        );
        return updatedBook;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    removeLike: async (parent, { bookId }, context) => {
      if (context.user) {
        const findCount = await Book.findOne(
          { bookId: bookId }
        );
        const updatedBook = await Book.findOneAndUpdate(
          { bookId: bookId },
          { $set: { likeCount: String((Number(findCount.likeCount)-1)) }, $pull: { likes: context.user.username }},
          { new: true, runValidators: true }
        );
        return updatedBook;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
  }
};

module.exports = resolvers;