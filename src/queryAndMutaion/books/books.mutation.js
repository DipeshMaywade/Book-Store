const { response } = require('../../type/books');
const { GraphQLNonNull, GraphQLString } = require('graphql');
const loggers = require('../../utility/logger');
const { book } = require('../../models/book');
const { checkAuth } = require('../../utility/auth');
const { bookValidation } = require('../../utility/helper');

class Mutation {
  /**
   * @fileds addBook
   * @type response
   * @argument args
   * @param {resolveParameter} root
   * @param {resolveParameter} data
   * @description addUser fields provide ability to create new user account for
   */
  addBook = {
    type: response,
    args: {
      author: {
        type: new GraphQLNonNull(GraphQLString),
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      quantity: {
        type: new GraphQLNonNull(GraphQLString),
      },
      price: {
        type: new GraphQLNonNull(GraphQLString),
      },
      description: {
        type: new GraphQLNonNull(GraphQLString),
      },
      image: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, data, context) => {
      const result = bookValidation.validate(data);
      if (result.error) {
        return { success: false, message: 'Validation failed' };
      }
      const verifyAdmin = await checkAuth(context);
      if (verifyAdmin.payload.role != 'Admin') {
        return { success: true, message: 'only admin has ability to add new book' };
      }
      try {
        data.adminId = verifyAdmin.payload.id;
        const bookModel = new book(data);
        const newBook = await bookModel.save();
        if (!newBook) {
          return { success: false, message: 'failed to save' };
        }
        return { success: true, message: 'new Book added successfully...!!', data: newBook };
      } catch (error) {
        loggers.error(`error`, error);
        return { success: false, message: `failed to save ${error}` };
      }
    },
  };
}

module.exports = new Mutation();
