#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const recvFromRabbit = async() => {
    amqp.connect('amqp://user:password@rabbit', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'hello';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log("\n [*] Aspettando messaggi dalla queue %s\n", queue);

            channel.consume(queue, function(msg) {
                console.log("\n [x] Ricevuto %s da Rabbit\n", msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
}
module.exports = recvFromRabbit