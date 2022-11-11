const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
app.use(cors());
const Port = process.env.Port || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.sgq11wr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("Biplob-studio");
    const servicesCollection = database.collection("services");
    const reviewCollection = database.collection("review");
    const subscribeCollection = database.collection("subscribe");

    app.get("/", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const services = await servicesCollection.findOne(query);
      res.send(services);
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });




    app.get("/review", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });



    app.delete("/review/:id", async (req, res) => {
       const id = req.params.id;
       const query = { id: id };
      
       const result = await reviewCollection.deleteOne(query);
       res.send(result);
    });






    app.post("/subscribe", async (req, res) => {
      const subscribe = req.body;
      const result = await subscribeCollection.insertOne(subscribe);
      res.send(result);
    });
















  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(Port, () => {
  console.log("server is working", Port);
});
