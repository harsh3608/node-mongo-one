const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Allow all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//connecting to atlas
async function run() {


    // const uri = "mongodb+srv://harshtemputil89:wiFUFPra1f4ZSVkx@cluster0.mftzekk.mongodb.net?retryWrites=true&w=majority";

    const uri = "mongodb://mongodb://localhost:27017/";



    const client = new MongoClient(uri);

    await client.connect().then(console.log("connected")).catch(error => console.log(error));

    const dbName = "BookStore";
    const collectionName = "Books";

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    collection.find({}).toArray((err, books) => {
        if (err) {
            console.error('Error fetching books:', err);
        } else {
            console.log('Books:', books);
        }
    })

    await client.close();
}

const PORT = process.env.PORT || 3000;

app.get("/status", (request, response) => {
    const status = {
        Status: "Running",
    };

    run();

    response.send(status);
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
