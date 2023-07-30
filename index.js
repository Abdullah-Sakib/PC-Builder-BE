import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import cors from "cors"
import "dotenv/config";
const app = express();
const port = 5000;

app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3booq2e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function bootstrap() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("Database connection established");
    // Send a ping to confirm a successful connection
    const db = client.db("pc-builder");
    const products = db.collection("products");
    const categories = db.collection("categories");

    app.get("/products", async (req, res) => {
      try {
        const result = await products.find({}).toArray();
        res.send({ products: result });
      } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).send("Error retrieving products");
      }
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await products.find({ _id: ObjectId(id) }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).send("Error retrieving products");
      }
    });
    app.get("/category-products/:category", async (req, res) => {
      const category = req.params.category;
      try {
        const result = await products.find({ category: category }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).send("Error retrieving products");
      }
    });

    app.get("/categories", async (req, res) => {
      try {
        const result = await categories.find({}).toArray();
        res.send({ categories: result });
      } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).send("Error retrieving categories");
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
bootstrap().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hakuna Matata");
});

app.listen(port, () => {
  console.log(`PC Builder app listening on port ${port}`);
});
