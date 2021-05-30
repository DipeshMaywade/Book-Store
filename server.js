const express = require('express');
const logger = require('./src/utility/logger');
require('dotenv').config();

const app = express();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  logger.log(`info`, `Server Runing at http://${host}:${port}`);
  console.log(`info`, `Server Runing at http://${host}:${port}`);
});
