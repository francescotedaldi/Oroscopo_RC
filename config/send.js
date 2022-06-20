#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const sendToRabbit = async() => {

    amqp.connect('amqp://user:password@rabbit', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'hello';
            var msg = 'Hello World!';

            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(msg));

            console.log("\n [x] Inviato %s alla queue 'hello'\n", msg);
        });
        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 500);
    });
}
module.exports = sendToRabbit