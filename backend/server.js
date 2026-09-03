
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// require('dotenv').config();
require('dotenv').config({ path: require('path').join(__dirname, '.env') });


// Route
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const postRoutes = require('./routes/postRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());


//API
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
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
