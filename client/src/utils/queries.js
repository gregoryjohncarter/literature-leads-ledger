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
      bookId
      image
      link
      title
      user
    }
  }
`;