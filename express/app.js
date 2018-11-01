/**** External libraries ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

/**** App modules ****/
const db = require('./db');

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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

/**** Routes ****/
app.get('/api/my_data', (req, res) => db.getData({}).then(
  (data) => res.json(data)
));

app.post('/api/my_data', (req, res) => {
    let text = req.body.text;
    let details = req.body.details;
    db.insertData(text, details).then((newId) => {
      res.json({id : newId});
    });
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




