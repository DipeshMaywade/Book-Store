/**
 * @module        queryAndMutation
 * @file          index.js
 * @description   this is the main index file which contain all the query and mutaions related to fundooApp
 *                and create and grapghQL schema which is used bt graphQLHTTP middleware.
 * @requires      graphql{@linkhttps://www.npmjs.com/package/graphql}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/

const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { addUser, loginUser, forgotPassword, resetPassword } = require('./user/user.mutation');
const { addBook, updateBook, deleteBook, addToCart, removeFromCart } = require('./books/books.mutation');
const { getUser } = require('./user/user.query');
const { getAllBooks } = require('./books/books.query');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: { getUser, getAllBooks },
});

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: { addUser, loginUser, forgotPassword, resetPassword, addBook, updateBook, deleteBook, addToCart, removeFromCart },
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
