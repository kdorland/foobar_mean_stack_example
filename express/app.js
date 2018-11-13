/**** External libraries ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkJwt = require('express-jwt');

/**** App modules ****/
const db = require('./db');
const ObjectID = require('mongodb').ObjectID;

/**** Configuration ****/
const appName = "Foobar";
const port = (process.env.PORT || 8080);
const app = express();
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../dist/mandatory_exercise'));

// Additional headers for the response to avoid trigger CORS security
// errors in the browser
// Read more here: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      // respond with 200
      console.log("Allowing OPTIONS");
      res.send(200);
    }
    else {
      // move on
      next();
    }
});

// Check JWT
app.use(
  checkJwt({ secret: process.env.JWT_SECRET })
    .unless({ path : ['/api/authenticate', '/api/authenticate/']})
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.message });
  }
});

/**** Mock User Data ****/
let users = [
  { name : "kristian", hash : "" }
];

bcrypt.hash("password123", 10, function(err, hash) {
  users[0].hash = hash;
  console.log("Mock hash generated");
});

/**** Routes ****/
app.get('/api/my_data', (req, res) => db.getData({}).then(
  (data) => res.json(data)
));

app.get('/api/my_data/:id', (req, res) =>
  db.getData({_id : ObjectID(req.params.id)}).then((data) => res.json(data)
));

app.post('/api/my_data', (req, res) => {
  let text = req.body.text;
  let details = req.body.details;
  db.insertData(text, details).then((newId) => {
    res.json({id : newId});
  });
});

app.post('/api/authenticate', (req, res) => {
  console.log("auth!!");
  const username = req.body.username;
  const password = req.body.password;
  console.log(username + ", " + password);

  const user = users.find((user) => user.name === username);
  if (user) {
    bcrypt.compare(password, user.hash, (err, result) => {
      if (result) {

        const payload = {
          username: username,
          admin: false
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
          message: 'User authenticated succesfully',
          token: token
        });
      }
      else res.status(401).json({message: "Password mismatch!"})
    });
  } else {
    res.status(404).json({message: "User not found!"});
  }
});


/**** Reroute all unknown requests to angular index.html ****/
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../dist/mandatory_exercise/index.html'));
});

/**** Connect to MongoDB and Start! ****/
db.connect().then(() => {

  db.countData({}).then(
    (count) => {
      console.log("Data count: " + count);
      if (count === 0)
        db.generateTestData(10);
      else
        db.insertData(
          "This is some text " + (count+1),
          "Some more details " + (count+1)
        );
    }
  );

  app.listen(port, () => console.log(`${appName} API running on port ${port}!`));

}).catch((e) => console.error(e));




