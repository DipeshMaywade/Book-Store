/**
 * @module        models
 * @file          user.js
 * @description   mongoose schema for users
 * @requires      {@link http://mongoosejs.com/|mongoose}
 * @author        Dipesh Maywade <dipeshmaywade@gmail.com>
----------------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');

const user = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      match: [/^[A-Z]{1}[a-z]{2,}$/, 'please enter valid Name'],
    },
    lastName: {
      type: String,
      require: true,
      match: [/^[A-Z]{1}[a-z]{2,}$/, 'please enter valid Name'],
    },
    email: {
      type: String,
      require: true,
      unique: true,
      match: [/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/, 'please enter valid email'],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserCollection = mongoose.model('User', user);

module.exports = { UserCollection };
