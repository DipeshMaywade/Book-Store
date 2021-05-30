const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`info`, `Server Runing at http://${host}:${port}`);
});
