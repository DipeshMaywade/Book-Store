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
const { UserCollection } = require('../../models/user');
const logger = require('../../utility/logger');

class Query {
  /**
   * @fileds getUser
   * @type response
   * @description getting all the user from database
   */
  getUser = {
    type: new GraphQLList(userType),
    resolve: async () => {
      try {
        const users = await UserCollection.find();
        return users.length != 0 ? users : [{ firstName: 'No users Found' }];
      } catch (error) {
        logger.log('error', `Error in getting users ${error} `);
      }
    },
  };
}
module.exports = new Query();
