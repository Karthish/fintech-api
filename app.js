const express = require("express");
var cors = require("cors");
const app = express();
//app.use(cors());
//app.use(cors({ origin: "http://localhost:4200" }));
app.use(cors({
  origin: ['http://localhost:4500', 'http://dvqxj9lu947gx.cloudfront.net','https://dvqxj9lu947gx.cloudfront.net']
}));

var multer = require('multer');
//var upload = multer({dest:'./uploads/'});

const aws = require('aws-sdk');
const multerS3 = require('multer-s3');


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
const routerTest = express.Router();
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
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("./"));
app.use(secureRoutes);
var tmproutes = require("./router")
var routes = require("./router")(app);
mongoose.set("useFindAndModify", true);
//const db = "mongodb+srv://admin:admin@cluster0.pvsbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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


//app.use('/api',req)
const appRouter = require('./app-router');
app.use('/api/v1', appRouter);

// app.post('/single', upload.single('file'), (req, res) => {
//   try {
//     res.send(req.file);
//   }catch(err) {
//     res.send(400);
//   }
// });

// app.post('/bulk', upload.array('files', 4) , (req, res) =>{
//   try {
//       res.send(req.files);
//   } catch(error) {
//         console.log(error);
//          res.send(400);
//   }
// });

//console.log('config file', config);

aws.config.update({
  secretAccessKey: `${config.fileuploads3.secretAccessKey}`,
  accessKeyId: `${config.fileuploads3.accessKeyId}`,
  region: `${config.fileuploads3.region}`
 });

 const s3 = new aws.S3();

/* To validate your file type */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'pdf') {
   cb(null, true);
  } else {
   cb(new Error('Wrong file type, only upload PDF file !'), 
   false);
  }
 };

 const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
   acl: `${config.fileuploads3.acl}`,
   s3,
   bucket: `${config.fileuploads3.bucket}`,
   key: function(req, file, cb) {
     /*I'm using Date.now() to make sure my file has a unique name*/
     console.log('req', req);
     //console.log('file', file);

     req.file = Date.now() + file.originalname;
     cb(null, Date.now() + file.originalname);
    }
   })
  });

  app.post('/api/v1/upload', upload.array('payslip', 1), (req, res) => {
    /* This will be th 8e response sent from the backend to the frontend */
    console.log('payslip response', req)
    res.send({ image: req.file });

   });

   app.get('/api/v1/test', function(req,res) {
     res.send('working fine')
   })

app.listen(port, function () {
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log(
    "SERVER is listening the following port number: " + port
  );
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
});
app.timeout = 120000;
