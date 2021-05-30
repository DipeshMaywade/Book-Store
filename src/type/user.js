const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } = require('graphql');
const { notes } = require('../models/notes');

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

const response = new GraphQLObjectType({
  name: 'Response',
  fields: () => ({
    success: { type: GraphQLString },
    message: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});

module.exports = { userType, response };
