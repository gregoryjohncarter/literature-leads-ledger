import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
    }
  }
`;

export const QUERY_BOOKS = gql`
  query books {
    books {
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