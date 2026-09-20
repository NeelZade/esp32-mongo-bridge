const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
let dbCollection;

// Connect in the background without blocking the server
client.connect()
  .then(() => {
    dbCollection = client.db('agriculture_db').collection('sensor_data');
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch(err => console.error("MongoDB connection error:", err));

app.post('/upload', async (req, res) => {
  // If DB isn't ready, tell the ESP32 gracefully instead of crashing
  if (!dbCollection) {
    return res.status(503).json({ error: "Database starting up" });
  }
  
  try {
    await dbCollection.insertOne({ ...req.body, timestamp: new Date() });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Data Insert Error:", error);
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
