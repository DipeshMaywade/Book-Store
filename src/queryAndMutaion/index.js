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
const { addBook, updateBook } = require('./books/books.mutation');
const { getUser } = require('./user/user.query');
const query = new GraphQLObjectType({
  name: 'Query',
  fields: { getUser },
});

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: { addUser, loginUser, forgotPassword, resetPassword, addBook, updateBook },
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
