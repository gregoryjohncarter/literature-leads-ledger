import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook($bookId: String!, $authors: [String], $title: String, $image: String, $link: String, $description: String, $pageCount: String, $averageRating: String, $publishedDate: String, $categories: String, $user: String) {
    addBook(bookId: $bookId, authors: $authors, title: $title, image: $image, link: $link, description: $description, pageCount: $pageCount, averageRating: $averageRating, publishedDate: $publishedDate, categories: $categories, user: $user) {
        _id
        authors
        description
        pageCount
        averageRating
        publishedDate
        categories
        bookId
        image
        link
        title
        user
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      authors
      description
      pageCount
      averageRating
      publishedDate
      categories
      bookId
      image
      link
      title
      user
    }
  }
`;