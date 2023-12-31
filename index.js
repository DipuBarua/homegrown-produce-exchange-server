const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bm0qnz4.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const homegrownCollection = client.db('homegrownDB').collection('products');
        const bookingCollection = client.db('homegrownDB').collection('bookings');

        // products -- API operations 
        app.get('/products', async (req, res) => {
            // console.log(req.query);
            const cursor = homegrownCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await homegrownCollection.findOne(query);
            res.send(result);
        })

        // to manage products/services by indiviually (service owner) 
        app.get('/products', async (req, res) => {
            console.log(req.query);
            console.log(req.query.email);

            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await homegrownCollection.find(query).toArray();
            res.send(result);
        })



        app.post('/products', async (req, res) => {
            const newService = req.body;
            console.log(newService);
            const result = await homegrownCollection.insertOne(newService);
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await homegrownCollection.deleteOne(query);
            res.send(result);
        })



        // bookings -- API operations 
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Homegrown produce exchange is running ....");
})

app.listen(port, () => {
    console.log(`Homegrown produce exchanging app is running on port:${port}`);
})