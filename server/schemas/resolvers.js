const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // pass in all args, that way can search by ID or username
        user: async (parent, { args }) => {
            const foundUser = await User.findOne({
                args
              }).populate('savedBooks');

              return foundUser;
        },
        users: async () => {
            return User.find({});
        },
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        login: async(parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Could not find user!');
            }
        
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
            throw new AuthenticationError('Could not log in!');
            }
    
            const token = signToken(user);
    
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            // create new User object from model
            const user = await User.create({ username, email, password });
            // create token w/ new user info
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args } },
                { new: true, runValidators: true }
                );

                return updatedUser;
            }
  
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
          },
    }
};

module.exports = resolvers;