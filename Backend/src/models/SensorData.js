const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    towerId: String,
    location: { lat: Number, long: Number },
    temperature: Number,
    powerSource: String,
    fuelStatus: Number,
    isAnomaly: { type: Boolean, default: false },
    anomalyType: { type: Number, default: 0 },
    unchangedUptime: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
