// load .env
const express = require('express')
const {connectToDb} = require("./db")
const {installHandler} = require("./api_handler")
require('dotenv').config();




const port = process.env.API_SERVER_PORT || 3000;

const app = express();

installHandler(app);

(async function () {
  try {
    await connectToDb();
    app.listen(port, function () {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
