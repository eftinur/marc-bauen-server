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

    }
    finally{

    }
}

run().catch(console.dir);

