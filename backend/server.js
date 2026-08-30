
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const postRoutes = require('./routes/postRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Discussion Board API is running');
});

const PORT = process.env.PORT || 5001;


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });