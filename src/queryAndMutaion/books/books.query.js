/**
 * @module        queryAndMutation/books
 * @file          books.query.js
 * @description   create getAllBooks loggedinUser API'S filed
 * @requires      graphql{@linkhttps://www.npmjs.com/package/graphql}
 * @requires      mongodb{@linkhttps://www.npmjs.com/package/mongodb}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/

const { GraphQLList } = require('graphql');
const { bookType } = require('../../type/books');
const { Book } = require('../../models/book');
const logger = require('../../utility/logger');
const { checkAuth } = require('../../utility/auth');

class Query {
  getAllBooks = {
    type: new GraphQLList(bookType),
    resolve: async (root, data, context) => {
      const verifyAdmin = await checkAuth(context);
      if (verifyAdmin == null) {
        return [{ title: 'please login first' }];
      }
      try {
        const books = await Book.find();
        return books.length != 0 ? books : [{ success: false, message: 'No Books Found' }];
      } catch (error) {
        logger.log('error', `Error in getting books ${error} `);
      }
    },
  };
}
module.exports = new Query();
