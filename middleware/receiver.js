const amqp = require('amqplib/callback_api');

module.exports = {
    recv: () => {
        // Step 1: Create Connection
        amqp.connect('amqp://user:password@rabbit', (connError, connection) => {
            if (connError) {
                throw connError;
            }
            console.log('[RECEIVER] Step 1: Connessione stabilita!')
            // Step 2: Create Channel
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }
                console.log('[RECEIVER] Step 2: Canale creato!')
                // Step 3: Assert Queue
                const QUEUE = 'test'
                channel.assertQueue(QUEUE);
                console.log('[RECEIVER] Step 3: Coda creata!')
                // Step 4: Receive Messages
                channel.consume(QUEUE, (msg) => {
                    console.log('[RECEIVER] Step 4: Messaggio ricevuto!\n' + msg.content.toString());
                }, {
                    noAck: true
                })
            })
        })
    }
}