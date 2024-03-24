const express = require('express');
const mongoose = require('mongoose');
const { mongodbUri } = require('./src/config/index');
const { connectRabbitMQ } = require('./src/services/mqService');
const http = require('http');
const { Server } = require("socket.io");
const { fetchAllSensorData } = require('./src/services/sensorService');
const { CUSTOM_LOG } = require('./src/const');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const { init } = require('./src/services/io');
const SensorData = require('./src/models/SensorData');
const io = init(server);

const port = 3002;

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => CUSTOM_LOG.green('MongoDB connected'))
    .catch(err => CUSTOM_LOG.red(err));

connectRabbitMQ();

io.on('connection', async (socket) => {
    CUSTOM_LOG.green("A user connected");

    const allSensorData = await fetchAllSensorData();
    socket.emit('initialData', allSensorData);

    socket.on('requestInitialData', async ({ towerId }) => {
        if (!towerId) {
            CUSTOM_LOG.red("No towerId provided for initial data request.");
            return;
        }
        try {
            const towerData = await SensorData.find({ towerId: towerId });
            socket.emit('sendInitialData', towerData);
        } catch (error) {
            console.error('Failed to fetch initial sensor data:', error);
        }
    });

    socket.on('disconnect', () => {
        CUSTOM_LOG.red('user disconnected');
    });
});

server.listen(port, () => CUSTOM_LOG.green(`Server running at http://localhost:${port}/`));
