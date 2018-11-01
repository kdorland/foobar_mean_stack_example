const mongoClient = require('mongodb').MongoClient;

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = 'foobar';
let client = {};

module.exports.connect = connect;
module.exports.getData = getData;
module.exports.removeData = removeData;
module.exports.generateTestData = generateTestData;
module.exports.countData = countData;
module.exports.insertData = insertData;

function connect() {
  return new Promise((resolve,reject) => {
    mongoClient.connect(dbUrl, {useNewUrlParser: true}).then(
      (c) => {
        client = c;
        console.log("Connected successfully to mongodb server");
        resolve();
      }).catch((error) => console.error(error));
  });
}

function getData(query) {
  return new Promise((resolve,reject) => {
    client.db(dbName).collection("data").find(query).toArray().then(
      (documents) => {
        console.log("Got data");
        resolve(documents);
      }).catch((error) => console.log(error));
  });
}

function insertData(text, details) {
  return new Promise((resolve,reject) => {
    let data = {text : text, details: details};
    client.db(dbName).collection("data").insertOne(data).then(
      (result) => {
        console.log("Inserted data");
        resolve(result.insertedId);
      }).catch((error) => console.log(error));
  });
}


function countData(query) {
  return new Promise((resolve,reject) => {
    client.db(dbName).collection("data").countDocuments(query).then(
      (count) => {
        console.log("Counted data");
        resolve(count);
      }).catch((error) => console.log(error));
  });
}

function removeData(query) {
  return new Promise((resolve,reject) => {
    client.db(dbName).collection("data").remove(query).then(
      (documents) => {
        console.log("Removed data");
      }).catch((error) => console.log(error));
  });
}

function generateTestData(count) {
  return new Promise((resolve,reject) => {
    const data = client.db(dbName).collection("data");

    let insertData = [];
    for (let i = 1; i <= count; i++) {
      insertData.push({
        text: "This is some text " + i,
        details: "Some more details " + i
      });
    }
    data.insertMany(insertData).then((result) => {
      console.log(`Generated ${count} pieces of data`);
      resolve(result);
    }).catch((error) => console.log(error));
  });
}


