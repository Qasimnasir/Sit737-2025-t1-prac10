const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// MongoDB connection
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/admin`;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('sit323db');
    console.log('✅ Connected to MongoDB');

    // Home page
    app.get('/', (req, res) => {
      res.send(`
        <html>
          <head><title>Qasim 10.1P</title></head>
          <body>
            <h1>Task 10.1P</h1>
          </body>
        </html>
      `);
    });

    // READ: List all items
    app.get('/data', async (req, res) => {
      try {
        const items = await db.collection('items').find().toArray();
        let html = '<h1>Stored Items</h1><ul>';
        items.forEach(item => {
          html += `<li>${item.name} (${item._id})</li>`;
        });
        html += '</ul><a href="/">Back to Home</a>';
        res.send(html);
      } catch (err) {
        res.status(500).send(`Error: ${err.message}`);
      }
    });

    // CREATE: Add new item
    app.post('/data', async (req, res) => {
      try {
        const result = await db.collection('items').insertOne(req.body);
        const newItem = await db.collection('items').findOne({ _id: result.insertedId });
        res.status(201).json(newItem);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // UPDATE: Modify item
    app.put('/data/:id', async (req, res) => {
      try {
        const result = await db.collection('items').updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
        const updatedItem = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });
        res.json(updatedItem);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // DELETE: Remove item
    app.delete('/data/:id', async (req, res) => {
      try {
        const result = await db.collection('items').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('MongoDB connection failed:', err));