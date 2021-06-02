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
// Test Case
// eslint
