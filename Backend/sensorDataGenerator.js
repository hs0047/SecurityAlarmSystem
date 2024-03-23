require('dotenv').config();
const amqp = require('amqplib');
const { cloudAmqpUrl, dataGenerationIntervalMs } = require('./src/config/index');
const { ELECTRIC, DG, TOWER_CONFIG } = require('./src/const');


async function sendSensorData() {
    console.log(`Connecting to RabbitMQ at URL: ${cloudAmqpUrl}`);
    const connection = await amqp.connect(cloudAmqpUrl);
    const channel = await connection.createChannel();
    const queue = 'sensorData';

    await channel.assertQueue(queue, { durable: false });

    setInterval(async () => {
        const towerNumber = Math.floor(Math.random() * 10) + 1;
        const towerConfig = TOWER_CONFIG[towerNumber];

        const message = JSON.stringify({
            ...towerConfig,
            temperature: Math.floor(Math.random() * 50),
            powerSource: Math.random() > 0.5 ? DG : ELECTRIC,
            fuelStatus: Math.floor(Math.random() * 100),
        });

        channel.sendToQueue(queue, Buffer.from(message));
        console.log("Sent %s", message);
    }, dataGenerationIntervalMs);
}

sendSensorData().catch(console.error);
