const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
  try {
    // Connect to MongoDB ONCE when the server starts
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    
    app.post('/upload', async (req, res) => {
      try {
        const collection = client.db('agriculture_db').collection('sensor_data');
        await collection.insertOne({ ...req.body, timestamp: new Date() });
        res.status(201).json({ success: true });
      } catch (error) {
        console.error("Insert Error:", error);
        res.status(500).json({ error: 'Database error' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
}

startServer();
