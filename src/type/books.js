/**
 * @module        type
 * @file          book.js
 * @description   define two graphQL schema(bookType, response) which is used by query and mutation
 * @requires      graphql{@linkhttps://www.npmjs.com/package/graphql}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQGraphQLList } = require('graphql');

const bookType = new GraphQLObjectType({
  name: 'Books',
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    title: { type: GraphQLString },
    quantity: { type: GraphQLString },
    price: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    adminId: { type: GraphQLID },
  }),
});

const response = new GraphQLObjectType({
  name: 'BookResponse',
  fields: () => ({
    success: { type: GraphQLString },
    message: { type: GraphQLString },
    data: { type: bookType },
  }),
});

module.exports = { bookType, response };
