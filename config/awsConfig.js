const aws = require('aws-sdk');
require('dotenv').config();

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_ID,
  region: process.env.REGION,
});

const sqs = new aws.SQS();
const ses = new aws.SES();

module.exports = { sqs, ses };
