const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//taskManagementUser
//4gxXQVbYeDh7Hg5X

const uri =
  "mongodb+srv://taskManagementUser:4gxXQVbYeDh7Hg5X@cluster0.mjrato5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    const tasksCollection = client.db("taskManagementDB").collection("tasks");

    //post tasks
    app.post("/tasks", async (req, res) => {
      try {
        const newTask = req.body;
        console.log(newTask);

        const result = await tasksCollection.insertOne(newTask);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get all tasks
    app.get("/tasks", async (req, res) => {
      try {
        const cursor = tasksCollection.find();
        const result = await cursor.toArray();

        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // task update
    app.put("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;

        console.log("update id : ", id);

        const filter = { _id: new ObjectId(id) };

        const options = { upsert: true };

        const updateTask = req.body;

        const task = {
          $set: {
            ...updateTask,
          },
        };

        const result = await tasksCollection.updateOne(filter, task, options);
      } catch (err) {
        console.log(err);
      }
    });

    // task  delete
    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log("delete id : id");
        const query = { _id: new ObjectId(id) };

        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task-Management IS RUNNING");
});

app.listen(port, () => {
  console.log(`Task-Management is running on Port , ${port}`);
});
