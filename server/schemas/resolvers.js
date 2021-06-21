const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // pass in all args, that way can search by ID or username
        user: async (parent, {args}) => {
            const foundUser = await User.findOne({
                args
              }).populate('savedBooks');

              return foundUser;
        },
        users: async () => {
            return User.find({});
        }
    },
};

module.exports = resolvers;