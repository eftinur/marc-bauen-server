const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

// middleware 
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`listening to ${port}`);
})

app.get('/', (req, res) => {
    res.send('marc bauen server running')
})

// MongoDB


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tyocyp7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{

        const serviceCollection = client.db('bauen').collection('services');
        const reviewCollection = client.db('bauen').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const Services = await cursor.limit(3).toArray();
            res.send(Services);
        })

        app.get('/allservices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const allServices = await cursor.toArray();
            res.send(allServices);
        })

        // loading specific data

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // review API
        
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);

