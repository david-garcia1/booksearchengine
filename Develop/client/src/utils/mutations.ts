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
  mutation Mutation($input: AddUserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;
export const SAVE_BOOK = gql `
mutation SaveBook($input: BookInput!) {
  saveBook(input: $input) {
    _id
    username
    email
    savedBooks {
      bookId
      title
      authors
      description
      image
    }
  }
}`;

export const REMOVE_BOOK = gql`
 mutation removeBook($bookId: String!) {
  removeBook(bookId: $bookId) {
    _id
    email
    username
   savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`;