const express = require("express");
var cors = require("cors");
const app = express();
//app.use(cors());
app.use(cors({ origin: "http://localhost:4200" }));

// CORS
// app.use(function (req, res, next) {
//   // Websites allowed to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // Request methods to be allowed
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers to be allowed
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // Pass to next layer of middleware
//   res.setHeader('Content-Type', 'application/json');
//   // setting header content-type application/json
//   next();

// });

const secureRoutes = express.Router();
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
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("./"));
app.use(secureRoutes);
var routes = require("./router")(app);
mongoose.set("useFindAndModify", true);
mongoose
  .connect(`${config.db}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
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
app.listen(port, function () {
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log(
    "SERVER is listening the following port number: " + port
  );
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
});
