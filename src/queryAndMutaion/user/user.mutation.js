/**
 * @module        queryAndMutation/user
 * @file          user.mutation.js
 * @description   create addUser loginUser forgotPassword resetPassword API'S/
 * @requires      graphql{@linkhttps://www.npmjs.com/package/graphql}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/
const { GraphQLNonNull, GraphQLString } = require('graphql');
const { userRegistration } = require('../../models/user');
const { userType, response } = require('../../type/user');

class Mutation {
  /**
   * @fileds addUser
   * @type userType
   * @argument args
   * @param {resolveParameter} root
   * @param {resolveParameter} data
   * @description addUser fields provide ability to create new user account for
   */
  addUser = {
    type: response,
    args: {
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      lastName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
      role: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, data) => {
      try {
        const userModel = new userRegistration(data);
        const newUser = await userModel.save();
        if (!newUser) {
          return {
            success: false,
            message: 'failed to save',
          };
        }
        return {
          success: true,
          message: 'new user added successfully...!!',
        };
      } catch (error) {
        loggers.error(`error`, error);
        return {
          success: false,
          message: 'failed to save',
        };
      }
    },
  };
}
