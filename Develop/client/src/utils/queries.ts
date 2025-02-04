import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query User($username: String!) {
  user(username: $username) {
    username
    _id
    email
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
  }
}`;


export const QUERY_ME = gql`
  query me {
    me {
    _id
    email
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
    username
  }

  }
`;