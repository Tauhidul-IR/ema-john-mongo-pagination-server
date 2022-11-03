const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { query } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nfiuyyd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('ema-john').collection('products')

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size)
            const query = {}
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count, products })
        });


        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            console.log(ids)
            const objectIds = ids.map(id => ObjectId(id));
            const query = { _id: { $in: objectIds } }
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)

        })
    }
    finally {

    }

}
run().catch(err => console.log(err))







app.get('/', (req, res) => {
    res.send('Ema john Server is running')
})
app.listen(port, () => {
    console.log(`ema john running on ${port}`)
})