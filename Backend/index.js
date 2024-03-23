const express = require('express');
const mongoose = require('mongoose');
const { mongodbUri } = require('./src/config/index');
const { connectRabbitMQ } = require('./src/services/mqService');

const app = express();
const port = 3000;

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

connectRabbitMQ();

app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
