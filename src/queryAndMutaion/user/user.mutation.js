/**
 * @module        queryAndMutation/user
 * @file          user.mutation.js
 * @description   create addUser loginUser forgotPassword resetPassword API'S/
 * @requires      graphql{@linkhttps://www.npmjs.com/package/graphql}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/
const { GraphQLNonNull, GraphQLString } = require('graphql');
const loggers = require('../../utility/logger');
const sentToSQS = require('../../utility/sqsService/publisher');
const consumefromSQS = require('../../utility/sqsService/consumer');
const { userRegistration } = require('../../models/user');
const { userType, response } = require('../../type/user');
const { verifyMail } = require('../../utility/sesService/verifyMail');
const { checkAuth } = require('../../utility/auth');
const { passEncrypt, validationSchema, comparePassword, jwtGenerator } = require('../../utility/helper');

class Mutation {
  /**
   * @fileds addUser
   * @type response
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
        await verifyMail(newUser.email);
        return { success: true, message: 'new user added successfully...!!' };
      } catch (error) {
        loggers.error(`error`, error);
        return { success: false, message: `failed to save ${error}` };
      }
    },
  };

  /**
   * @fileds loginUser
   * @type response
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

  /**
   * @fileds forgotPassword
   * @type response
   * @param {resolveParameter} root
   * @param {resolveParameter} args
   * @description forgotPassword fields provide ability to send mail on registered email ID with reset password token.
   */
  forgotPassword = {
    type: response,
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, args) => {
      let result = validationSchema.validate(args);
      if (result.error) {
        return { success: false, message: 'Validation failed' };
      }
      try {
        let user = await userRegistration.findOne({ email: args.email });
        if (!user) {
          return { success: false, message: 'Incorrrect Email User Not Found..' };
        }
        let payload = { id: user.id, email: user.email };
        let token = await jwtGenerator(payload);
        await sentToSQS(user.email, token);
        await consumefromSQS();
        return { success: true, message: `Mail sent to the registered email id token is ${token}` };
      } catch (error) {
        loggers.error(`error`, error);
        return { success: false, message: 'email not sent check your error log file' };
      }
    },
  };

  /**
   * @fileds resetPassword
   * @type response
   * @param {resolveParameter} root
   * @param {resolveParameter} args
   * @param {resolveParameter} context
   * @description resetPassword provide ability to reset password only for authenticate user using jwt.
   */
  resetPassword = {
    type: response,
    args: {
      newPassword: {
        type: new GraphQLNonNull(GraphQLString),
      },
      confirmPassword: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (_, args, context) => {
      const verifiedUser = await checkAuth(context);
      let result = validationSchema.validate(args);
      if (args.newPassword === args.confirmPassword && !result.error) {
        try {
          if (!verifiedUser) {
            return { success: false, message: 'invalid token' };
          }
          let newPassword = await passEncrypt(args.confirmPassword);
          await userRegistration.findByIdAndUpdate(verifiedUser.payload.id, {
            password: newPassword,
          });
          return { success: true, message: 'password updated.' };
        } catch (error) {
          loggers.error(`error`, error);
          return { success: false, message: 'check error in your log file' };
        }
      } else {
        return { success: false, message: 'password does not matched or invalid formate' };
      }
    },
  };
}

module.exports = new Mutation();
