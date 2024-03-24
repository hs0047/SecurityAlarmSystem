require('dotenv').config();

module.exports = {
    mongodbUri: process.env.MONGODB_URI,
    cloudAmqpUrl: process.env.CLOUDAMQP_URL,
    dataGenerationIntervalMs: parseInt(process.env.DATA_GENERATION_INTERVAL_MS, 10) || 5000,
    continiousSourceAnomaliTime: parseInt(process.env.CONTINIOUS_SOURCE_ANOMALI_TIME, 10) || 7200000,
};
