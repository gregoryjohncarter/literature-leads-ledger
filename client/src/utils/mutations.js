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
  mutation addBook($bookId: String!, $authors: [String], $title: String, $image: String, $link: String, $description: String, $pageCount: String, $averageRating: String, $publishedDate: String, $categories: String, $user: String, $likeCount: String, $likes: [String]) {
    addBook(bookId: $bookId, authors: $authors, title: $title, image: $image, link: $link, description: $description, pageCount: $pageCount, averageRating: $averageRating, publishedDate: $publishedDate, categories: $categories, user: $user, likeCount: $likeCount, likes: $likes) {
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
      likeCount
      likes
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
      likeCount
      likes
    }
  }
`;

export const ADD_LIKE = gql`
  mutation addLike($bookId: String!) {
    addLike(bookId: $bookId) {
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
      likeCount
      likes
    }
  }
`;

export const REMOVE_LIKE = gql`
  mutation removeLike($bookId: String!) {
    removeLike(bookId: $bookId) {
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
      likeCount
      likes
    }
  }
`;