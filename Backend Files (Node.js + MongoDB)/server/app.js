const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;
