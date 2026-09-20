const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/upload', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('agriculture_db').collection('sensor_data');
    // Add a timestamp to the incoming ESP32 data
    const result = await collection.insertOne({ ...req.body, timestamp: new Date() });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.close();
  }
});

app.listen(process.env.PORT || 3000);
