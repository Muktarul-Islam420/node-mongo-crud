const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const password = 'Muktarul420'
var uri = "mongodb://Muktarulkhan:Muktarul420@cluster0-shard-00-00.gqyzv.mongodb.net:27017,cluster0-shard-00-01.gqyzv.mongodb.net:27017,cluster0-shard-00-02.gqyzv.mongodb.net:27017/organicDB?ssl=true&replicaSet=atlas-k1o8mv-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser:true, useUnifiedTopology:true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/index.html');
})


MongoClient.connect(uri, function(err, client) {
  
  const productCollection = client.db("organicDB").collection("products");

  app.get('/products', (req, res) => {
    productCollection.find({})  //.limit(10)
    .toArray((err,documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents) => {
      res.send(documents[0]);
    })
  })


  app.post('/addProduct',(req, res) => {
    const product = req.body;
   productCollection.insertOne(product)
   .then(result => {
   res.redirect('/')
  })
  })


  app.patch('/update/:id',(req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set:{price:req.body.price, quantity:req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })


  app.delete('/delete/:id', (req, res) =>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })



  });




app.listen(4000);