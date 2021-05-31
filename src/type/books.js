const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const bookType = new GraphQLObjectType({
  name: 'Books',
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    title: { type: GraphQLString },
    quantity: { type: GraphQLString },
    price: { type: GraphQLString },
    Image: { type: GraphQLString },
    adminId: { type: GraphQLID },
  }),
});

const response = new GraphQLObjectType({
  name: 'Response',
  fields: () => ({
    success: { type: GraphQLString },
    message: { type: GraphQLString },
    data: { type: GraphQGraphQLList(bookType) },
  }),
});

module.exports = { bookType, response };
