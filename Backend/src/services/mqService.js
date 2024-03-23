const amqp = require('amqplib');
const { cloudAmqpUrl } = require('../config');
const sensorService = require('./sensorService');

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(cloudAmqpUrl);
        const channel = await connection.createChannel();
        const queue = 'sensorData';

        await channel.assertQueue(queue, { durable: false });
        console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                console.log("[x] Received", msg.content.toString());
                const sensorData = JSON.parse(msg.content.toString());
                await sensorService.processSensorData(sensorData);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000); // Attempt reconnection after 5 seconds
    }
}

module.exports = { connectRabbitMQ };
