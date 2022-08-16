// import the gql tagged template function
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
  }

  type Book {
    _id: ID
    authors: [String]
    description: String
    pageCount: Number
    averageRating: Number
    publishedDate: String
    bookId: String
    image: String
    link: String
    title: String
    user: String
  }

  type Query {
    me: User
    user(username: String!): User
    books: [Book]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addBook(bookId: String!, authors: [String], title: String, image: String, link: String, description: String, pageCount: Number, averageRating: Number, publishedDate: String, user: String): Book
    removeBook(bookId: String!): Book
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;