const amqp = require('amqplib/callback_api');

module.exports = {
    send: () => {
        // Step 1: Create Connection
        amqp.connect('amqp://user:password@rabbit', (connError, connection) => {
            if (connError) {
                throw connError;
            }
            console.log('[SENDER] Step 1: Connessione stabilita!')
            // Step 2: Create Channel
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }
                console.log('[SENDER] Step 2: Canale creato!')
                // Step 3: Assert Queue
                const QUEUE = 'test'
                channel.assertQueue(QUEUE);
                console.log('[SENDER] Step 3: Coda creata!')
                // Step 4: Send message to queue
                channel.sendToQueue(QUEUE, Buffer.from('Login effettuato con successo!'));
                console.log('[SENDER] Step 4: Messaggio inviato!');
            })
        })
    }
}