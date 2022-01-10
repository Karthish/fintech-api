const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors({
  origin: ['http://localhost:4500', 'http://dvqxj9lu947gx.cloudfront.net','https://dvqxj9lu947gx.cloudfront.net','https://aryaa-filecontianer-dev.s3.ap-south-1.amazonaws.com']
}));
// app.use(cors({
//   origin: '*'
// }));
var multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");
mongoose.plugin(timestamps, {
  createdAt: "created_at",
  updatedAt: "updated_at",
});
const path = require("path");
const fs = require("fs");
const favicon = require("serve-favicon");
const config = require("./config/config")[process.env.NODE_ENV || "dev"];
const port = config.node_port;
mongoose.Promise = global.Promise;

app.use(favicon(__dirname + "/fav.ico"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: false,
parameterLimit: 1000000}));

app.use(express.static("./"));
mongoose
  .connect(`${config.db}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(
    () => {
      console.log(
        "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      );
      console.log("Database connected as successfully");
      console.log(
        "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      );
    },
    (err) => {
      console.log(
        "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      );
      console.log(" Database connection Error", err);
      console.log(
        "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      );
    }
  );
var connection = mongoose.connection;

const appRouter = require('./app-router');

//Included API prefix to all the API
app.use('/api/v1', appRouter);

app.listen(port, function () {
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log(
    "SERVER is listening the following port number: " + port
  );
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
});
