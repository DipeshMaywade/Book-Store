const { response } = require('../../type/books');
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
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
        return { success: false, message: 'only admin has ability to add new book' };
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

  updateBook = {
    type: response,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
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
    resolve: async (root, args, context) => {
      try {
        const verifyAdmin = await checkAuth(context);
        if (verifyAdmin.payload.role != 'Admin') {
          return { success: false, message: 'only admin has ability to update book details' };
        } else {
          const updatedBook = {
            author: args.author,
            title: args.title,
            quantity: args.quantity,
            price: args.price,
            description: args.description,
            image: args.image,
            adminId: verifyAdmin.payload.id,
          };
          const booksUpdate = await book.findOneAndUpdate({ _id: args.id }, updatedBook, { new: true });
          return !booksUpdate ? { success: false, message: 'failed' } : { success: true, message: 'Book Updated', data: booksUpdate };
        }
      } catch (error) {
        loggers.error(`error`, error);
        return { title: error };
      }
    },
  };
}

module.exports = new Mutation();
