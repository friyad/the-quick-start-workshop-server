const express = require('express')
var cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ce1yc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("theQuickStartWorkshop");
        const carPartsCollection = database.collection("carParts"); // Car Parts Collection
        const expertsCollection = database.collection("experts"); // Our Experts Collection


        //----------------------- E-X-P-E-R-T-S ------------------------------
        // POST ALL EXPERTS IN DATABASE
        app.post("/experts", async (req, res) => {
            const allExperts = req.body;
            const result = await expertsCollection.insertMany(allExperts)
            res.json(result)
        })
        // GET ALL EXPERTS FROM DATABASE
        app.get("/experts", async (req, res) => {
            const cursor = expertsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })



        // ------------------------------ P-A-R-T-S ------------------------------
        // POST ALL PARTS IN DATABASE
        app.post("/carParts", async (req, res) => {
            const allParts = req.body;
            const result = await carPartsCollection.insertMany(allParts)
            res.json(result)
        })

        // GET ALL PARTS FROM DATABASE
        app.get("/carParts", async (req, res) => {
            const cursor = carPartsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // POST A PARTS IN DATABASE
        // app.post("/carParts", async (req, res) => {
        //     const parts = req.body;
        //     const result = await carPartsCollection.insertOne(parts);
        //     res.json(result);
        // })

        // GET A PARTS FROM DATABSE
        app.get("/carParts/:partsID", async (req, res) => {
            const id = req.params.partsID;
            const query = { _id: ObjectId(id) }
            const result = await carPartsCollection.findOne(query)
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);






app.get("/", (req, res) => {
    res.send('Hello world! it is The Quick Start Workshop Server')
})

app.listen(port, () => {
    console.log('Your port is:', port)
})