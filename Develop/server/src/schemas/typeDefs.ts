

const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    bookId: String!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type Query {
    user(username: String!): User
    me: User
  }
input AddUserInput {
  username: String!
  email: String!
  password: String!
}
  type Mutation {
   addUser(input: AddUserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;