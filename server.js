var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();

// setting body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to the database
var port = process.env.PORT || 3100;
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://prueba:prueba2018@ds133642.mlab.com:33642/lerori", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("The connection to the database was successful");
    //Running the server
    app.listen(port, () => {
      console.log(`Server running in http://localhost:${port}`);
    });
  })
  //If it does not connect correctly we show the error
  .catch(err => console.log(err));

// API routes
var tRouter = require("./routes/taskRouter");
app.use("/api/tasks", tRouter);
