const SensorData = require('../models/SensorData');
const { dataGenerationIntervalMs, continiousSourceAnomaliTime } = require('../config');
const { getIO } = require('./io');

async function processSensorData(data) {
    try {
        let anomalyType = 0;
        let isAnomaly = false;

        if (data.temperature > 45) {
            isAnomaly = true;
            anomalyType = 1;
        } else if (data.fuelStatus < 20) {
            isAnomaly = true;
            anomalyType = 2;
        }

        const lastEntry = await SensorData.findOne({ towerId: data.towerId }).sort({ createdAt: -1 });

        if (lastEntry && lastEntry.powerSource === data.powerSource) {
            const unchangedTime = lastEntry.unchangedUptime + (dataGenerationIntervalMs / 1000);
            if (unchangedTime > continiousSourceAnomaliTime) {
                isAnomaly = true;
                anomalyType = 3;
            }
            data.unchangedUptime = unchangedTime
        } else {
            data.unchangedUptime = dataGenerationIntervalMs / 1000;
        }

        const sensorData = new SensorData({
            ...data,
            isAnomaly,
            anomalyType,
            unchangedUptime: data.unchangedUptime,
        });

        await sensorData.save();
        const io = getIO();
        io.emit('sensorUpdate', sensorData);
        io.emit(`sensorUpdate:${sensorData.towerId}`, sensorData);
        console.log('Sensor data processed and saved', sensorData);
    } catch (error) {
        console.error('Error processing sensor data:', error);
    }
}

async function fetchAllSensorData() {
    try {
        const data = await SensorData.find({});
        return data;
    } catch (err) {
        console.error('Failed to fetch sensor data:', err);
        return [];
    }
}


module.exports = { processSensorData, fetchAllSensorData };
