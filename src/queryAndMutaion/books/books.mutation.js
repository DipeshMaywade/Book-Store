/**
 * @module       queryAndMutaion/books   
 * @file         book.mutation.js
 * @description  class mutation hold all the resolvers related to book mutation
 * @author       Dipesh Maywade <dipeshmaywade@gmail.com>
--------------------------------------------------------------------------------*/

const { response } = require('../../type/books');
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const loggers = require('../../utility/logger');
const { Book } = require('../../models/book');
const { checkAuth } = require('../../utility/auth');
const { bookValidation } = require('../../utility/helper');

class Mutation {
  /**
   * @fileds addBook
   * @type response
   * @argument args
   * @param {resolveParameter} root
   * @param {resolveParameter} data
   * @description addBook fields provide ability to create new book by Admin
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
      if (verifyAdmin == null) {
        return { success: false, message: 'please log in first' };
      } else if (verifyAdmin.payload.role != 'Admin') {
        return { success: false, message: 'only admin has ability to update book details please login as an admin' };
      }
      data.adminId = verifyAdmin.payload.id;
      const bookModel = new Book(data);
      const newBook = await bookModel.save();
      if (!newBook) {
        return { success: false, message: 'failed to save' };
      }
      return { success: true, message: 'new Book added successfully...!!', data: newBook };
    },
  };

  /**
   * @fileds updateBook
   * @type response
   * @argument args
   * @param {resolveParameter} root
   * @param {resolveParameter} data
   * @description Update fields provide ability to create new book only for admins
   */
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
      const result = bookValidation.validate(args);
      if (result.error) {
        return { success: false, message: 'Validation failed' };
      }
      const verifyAdmin = await checkAuth(context);
      if (verifyAdmin == null) {
        return { success: false, message: 'please log in first' };
      } else if (verifyAdmin.payload.role != 'Admin') {
        return { success: false, message: 'only admin has ability to update book details please login as an admin' };
      }
      const updatedBook = {
        author: args.author,
        title: args.title,
        quantity: args.quantity,
        price: args.price,
        description: args.description,
        image: args.image,
        adminId: verifyAdmin.payload.id,
      };
      const booksUpdate = await Book.findOneAndUpdate({ _id: args.id }, updatedBook, { new: true });
      return !booksUpdate ? { success: false, message: 'failed' } : { success: true, message: 'Book Updated', data: booksUpdate };
    },
  };

  /**
   * @fileds deleteBook
   * @type response
   * @argument args
   * @param {resolveParameter} root
   * @param {resolveParameter} data
   * @param {resolveParameter} context
   * @description deleteBook fields provide ability to delete book data from the DB by Admin.
   */
  deleteBook = {
    type: response,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, args, context) => {
      try {
        const verifyAdmin = await checkAuth(context);
        if (verifyAdmin == null) {
          return { success: false, message: 'please log in first' };
        } else if (verifyAdmin.payload.role != 'Admin') {
          return { success: false, message: 'only admin has ability to update book details please login as an admin' };
        }
        const BookDelete = await Book.findOneAndDelete({ _id: args.id });
        return !BookDelete ? { success: false, message: 'failed' } : { success: true, message: 'Book deleted successfully' };
      } catch (error) {
        loggers.error(`error`, error);
      }
    },
  };

  /**
   * @fileds addToCart
   * @type response
   * @argument args
   * @param {resolveParameter} root
   * @param {resolveParameter} data
   * @description add to cart fields provide ability to add book into the cart by user.
   */
  addToCart = {
    type: response,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (root, args, context) => {
      try {
        const verifyAdmin = await checkAuth(context);
        if (verifyAdmin == null) {
          return { success: false, message: 'please log in first' };
        }
        const addToBag = await Book.findByIdAndUpdate(args.id, { isAddedToBag: true }, { new: true });
        return !addToBag
          ? { success: false, message: 'failed to add into the cart' }
          : { success: true, message: 'Book added into the cart', data: addToBag };
      } catch (error) {
        loggers.error(`error`, error);
      }
    },
  };

  /**
   * @fileds removeFromCart
   * @type response
   * @argument args
   * @param {resolveParameter} root
   * @param {resolveParameter} data
   * @description removeCart fields provide ability to remove book from the cart by user.
   */
  removeFromCart = {
    type: response,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (root, args, context) => {
      try {
        const verifyAdmin = await checkAuth(context);
        if (verifyAdmin == null) {
          return { success: false, message: 'please log in first' };
        }
        const data = await Book.findByIdAndUpdate(args.id, { isAddedToBag: false });
        return !data ? { success: false, message: 'failed..' } : { success: true, message: 'Book removed from the cart', data: data };
      } catch (error) {
        loggers.error(`error`, error);
      }
    },
  };
}

module.exports = new Mutation();
