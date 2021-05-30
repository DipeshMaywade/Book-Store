/**
 * @module        queryAndMutation/user
 * @file          user.mutation.js
 * @description   create addUser loginUser forgotPassword resetPassword API'S/
 * @requires      graphql{@linkhttps://www.npmjs.com/package/graphql}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/
const { GraphQLNonNull, GraphQLString } = require('graphql');
const loggers = require('../../utility/logger');
const { userRegistration } = require('../../models/user');
const { userType, response } = require('../../type/user');
const { passEncrypt, validationSchema, comparePassword, jwtGenerator } = require('../../utility/helper');

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
      const result = validationSchema.validate(data);
      if (result.error) {
        return { success: false, message: 'Validation failed' };
      }
      try {
        data.password = await passEncrypt(data.password);
        const userModel = new userRegistration(data);
        const newUser = await userModel.save();
        if (!newUser) {
          return { success: false, message: 'failed to save' };
        }
        return { success: true, message: 'new user added successfully...!!' };
      } catch (error) {
        loggers.error(`error`, error);
        return { success: false, message: `failed to save ${error}` };
      }
    },
  };

  /**
   * @fileds loginUser
   * @type outputType
   * @param {resolveParameter} root
   * @param {resolveParameter} args
   * @description login fields provide ability to user login with correct email and password and genrate a tocken.
   */
  loginUser = {
    type: response,
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, args) => {
      const result = validationSchema.validate(args);
      if (result.error) {
        return { success: false, message: 'Validation failed' };
      }
      try {
        let user = await userRegistration.findOne({ email: args.email });
        if (!user) {
          return { success: false, message: 'incorrect email, user not Found' };
        }
        let isValid = await comparePassword(args.password, user.password);
        if (!isValid) {
          return { success: false, message: 'incorrect password.' };
        }
        let payload = { id: user.id, email: user.email };
        let token = await jwtGenerator(payload);
        return { success: true, message: `Login successfull your token is: ${token} ` };
      } catch (error) {
        loggers.error(`error`, error);
        return { success: false, message: 'failed, check your log file' };
      }
    },
  };
}

module.exports = new Mutation();
