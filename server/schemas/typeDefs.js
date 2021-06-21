const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Query {
    user(_id: String, username: String): User
    users: [User]
  }
`;

module.exports = typeDefs;
