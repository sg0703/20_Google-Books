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
    _id: ID
    authors: [String]
    bookId: String
    image: String
    link: String
    title: String
  }

  type Query {
    user(_id: String, username: String): User
    users: [User]
  }
`;

module.exports = typeDefs;
