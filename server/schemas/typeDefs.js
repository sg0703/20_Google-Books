const { gql } = require('apollo-server-express');


// todo: after Auth implemented, "me" 

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(_id: String, username: String): User
    users: [User]
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String]!, description: String!, title: String!, bookId: String!, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;