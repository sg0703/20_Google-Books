const express = require('express');
const router = require('express').Router();
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

// bring in typeDefs and resolvers for Apollo server
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// connect to database
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// configure apollo server, import auth middleware for JWT's
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
 });
 console.log('here')
}


db.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});
