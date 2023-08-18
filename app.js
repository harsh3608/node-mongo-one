const express = require("express");
const mongodb = require('mongodb');   //connect to compass
const mongoose = require('mongoose'); //connect to atlas
var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());

// Configure body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//connecting to mongoose/ mongodb compass
MongoClient.connect("mongodb://localhost:27017/BookStore", function (err, db) {

    // if (err) throw err;

    // //Write databse Insert/Update/Query code here..
    // console.log('connected to database');


    db.collection('Books', function (err, collection) {

        collection.find().toArray(function (err, items) {
            if (err) throw err;
            console.log(items);
        });

    });

});
//mongoose.connect('mongodb://localhost:27017/');



const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
        Status: "Running",
    };

    response.send(status);
});