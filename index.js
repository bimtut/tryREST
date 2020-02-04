var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mysql = require("mysql2");

let port = 3003;
// set port
app.listen(port, function() {
  console.log(`Node app is running on port ${port}`);
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// create the connection to database
const dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "learnrest"
});

// default route
app.get("/", function(req, res) {
  //localhost:3000/
  return res.send({ message: "hello" });
});


// connect to database
dbConn.connect();

// Retrieve all users
app.get("/users", function(req, res) {
  
  dbConn.query("SELECT * FROM rest", function(error, results, fields) {
    if (error) throw error;
    console.log(results)
    return res.send({ error: false, data: results, message: "users list." });
  });
});

// Retrieve user with id
app.get("/user/:id", function(req, res) {
  let user_id = req.params.id;

  // if (!user_id) {
  //   return res
  //     .status(400)
  //     .send({ error: true, message: "Please provide user_id" });
  // }

  dbConn.query("SELECT name, email FROM rest where id=?", user_id, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({ data: results[0] });
  });
});

// Add a new user
app.post("/user", function(req, res) {
  let user = {
    name: req.body.name,
    email: req.body.email
  };

  // if (!user) {
  //   return res
  //     .status(400)
  //     .send({ error: true, message: "Please provide user" });
  // }

  dbConn.query("INSERT INTO rest SET ?", user, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      data: results,
      message: "New user has been created successfully."
    });
  });
});

//  Update user with id
app.put("/user/:id", function(req, res) {
  let user_id = req.params.id;
  let user = {
    name: req.body.name,
    email: req.body.email
  };
  console.log(user_id, user);

  if (!user_id || !user) {
    return res
      .status(400)
      .send({ error: user, message: "Please provide user and user_id" });
  }

  dbConn.query(
    "UPDATE rest SET name = ?, email = ? WHERE id = ?",
    [user.name, user.email, user_id],
    function(error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "user has been updated successfully."
      });
    }
  );
});

//  Delete user
app.delete("/user/:id", function(req, res) {
  let user_id = req.params.id;

  if (!user_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user_id" });
  }
  dbConn.query("DELETE FROM rest WHERE id = ?", [user_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    console.log('deleted ' + results.affectedRows + ' rows');
    return res.send({
      error: false,
      data: results,
      message: "User has been updated successfully."
    });
  });
});

module.exports = app;
