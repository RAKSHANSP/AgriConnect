// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agriconnect';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB err', err));

app.get('/', (req, res) => res.send('API working'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server started on ${PORT}`));
