const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');

const resolvers = {
    Query: {
        // pass in all args, that way can search by ID or username
        user: async (parent, {args}) => {
            const foundUser = await User.findOne({
                args
              });

              return foundUser;
        },
        users: async () => {
            return User.find({});
        }
    },
};

module.exports = resolvers;

/** 
 * 
/** 
    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            // TODO: add TOKEN

            return user;
        },
        login: async (parent, { body }) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            if (!user) {
                throw new AuthenticationError('User not found!');
            }
        
            const correctPw = await user.isCorrectPassword(body.password);
        
            if (!correctPw) {
                throw new AuthenticationError('Failed to login!');
            }

            return user;
        },
        saveBook: async (parent, { user, body }) => {
            // TODO: add context later
            console.log(user);
            const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: body } },
            { new: true, runValidators: true }
            );

            return updatedUser;
        },
        deleteBook: async (parent, { userId, bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );

              return updatedUser;
        }
    }
    */
