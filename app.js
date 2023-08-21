const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Allow all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting to local MongoDB using MongoDB Compass
async function run() {
    const localUri = "mongodb://127.0.0.1:27017/BookStore"; // Update with your local database URL

    const client = new MongoClient(localUri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const dbName = "BookStore";
        const collectionName = "Books";

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const books = await collection.find({}).toArray();
        return books;
    } catch (error) {
        console.error('Error connecting to local MongoDB:', error);
        throw error;
    } finally {
        client.close();
    }
}

const PORT = process.env.PORT || 3000;

app.get("/status", async (request, response) => {
    try {
        const books = await run();
        const status = {
            Status: "Running",
            Books: books
        };

        response.send(status);
    } catch (error) {
        console.error('An error occurred:', error);
        response.status(500).send({ error: "An error occurred" });
    }
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

