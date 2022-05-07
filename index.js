const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

// User: SoundHub-server
// PASS: SKf38JMGGE5MQGyT;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustersoundhub.abk9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client.db("soundHub").collection("inventories");

    // Getting All The inventories from DB
    app.get("/inventories", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventories = await cursor.toArray();
      res.send(inventories);
    });

    // Getting a single inventory item from db
    app.get("/inventory/:id", async (req, res) => {
      const inventoryId = req.params.id;
      const query = { _id: ObjectId(inventoryId) };
      const inventory = await inventoryCollection.findOne(query);
      res.send(inventory);
    });

    // Adding Item to the database
    app.post("/inventory", async (req, res) => {
      const newInventory = req.body;
      const result = await inventoryCollection.insertOne(newInventory);
      res.send(result);
    });

    //Deleting an Item from DataBase
    app.delete("/inventory/:id", async (req, res) => {
      const inventoryId = req.params.id;
      const query = { _id: ObjectId(inventoryId) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    });

    // Updating the Details of Inventory
    app.put("/inventory/:id", async (req, res) => {
      const inventoryId = req.params.id;
      const updatedQuantity = req.body;
      const filter = { _id: ObjectId(inventoryId) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedQuantity.quantity,
        },
      };
      const result = await inventoryCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // // Getting Items of user
    // app.get("/myInventory", async (req, res) => {
    //   const query = { email: req.email };
    //   const cursor = inventoryCollection.find(query);
    //   const inventories = await cursor.toArray();
    //   res.send(inventories);
    // });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Sound Hub Server");
});

app.listen(port, () => {
  console.log("Listening To The Sound Hub Server");
});
