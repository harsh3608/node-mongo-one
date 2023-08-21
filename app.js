const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Allow all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting to local MongoDB using MongoDB Compass
const localUri = "mongodb://127.0.0.1:27017/BookStore"; // Update with your local database URL
const dbName = "BookStore";
const collectionName = "Books";

async function run(callback) {
    const client = new MongoClient(localUri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await callback(collection);
        return result;
    } catch (error) {
        console.error('Error connecting to local MongoDB:', error);
        throw error;
    } finally {
        client.close();
    }
}

app.get("/status", async (req, res) => {
    const status = {
        Status: "Running",
    };

    res.send(status);
})

app.get("/books/get-all", async (req, res) => {
    try {
        const books = await run(collection => collection.find({}).toArray());
        const status = {
            Status: "Running",
            Books: books
        };

        res.send(status);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send({ error: "An error occurred" });
    }
});

app.post("/books/add", async (req, res) => {
    const book = req.body;
    try {
        const result = await run(collection => collection.insertOne(book));
        res.send(result);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send({ error: "An error occurred" });
    }
});

app.get("/books/get/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await run(collection => collection.findOne({ _id: bookId }));
        if (book) {
            res.send(book);
        } else {
            res.status(404).send({ error: "Book not found" });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send({ error: "An error occurred" });
    }
});

app.put("/books/update/:id", async (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
    try {
        const result = await run(collection => collection.updateOne({ _id: bookId }, { $set: updatedBook }));
        res.send(result);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send({ error: "An error occurred" });
    }
});

app.delete("/books/delete/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const result = await run(collection => collection.deleteOne({ _id: bookId }));
        res.send(result);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send({ error: "An error occurred" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
