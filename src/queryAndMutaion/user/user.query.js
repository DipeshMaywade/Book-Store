/**
 * @module        queryAndMutation/user
 * @file          user.query.js
 * @description   create getAllUser loggedinUser API'S filed
 * @requires      graphql{@linkhttps://www.npmjs.com/package/graphql}
 * @requires      mongodb{@linkhttps://www.npmjs.com/package/mongodb}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/

const { GraphQLList } = require('graphql');
const { userType } = require('../../type/user');
const { userRegistration } = require('../../models/user');

class Query {
  getUser = {
    type: new GraphQLList(userType),
    resolve: async () => {
      const users = await userRegistration.find();
      return users ? users : [{ firstName: 'No users Found' }];
    },
  };
}
module.exports = new Query();
