
'use strict';

const Hapi = require('@hapi/hapi');
const request = require('request');

//assign external service if you want to use
const heroesService = 'http://localhost:3001';

const threats = [
    {
        id: 1,
        displayName: 'Pisa tower is about to collapse.',
        necessaryPowers: ['flying'],
        img: 'tower.jpg',
        assignedHero: 0
    },
    {
        id: 2,
        displayName: 'Engineer is going to clean up server-room.',
        necessaryPowers: ['teleporting'],
        img: 'mess.jpg',
        assignedHero: 0
    },
    {
        id: 3,
        displayName: 'John will not understand the joke',
        necessaryPowers: ['clairvoyance'],
        img: 'joke.jpg',
        assignedHero: 0
    }
];

const init = async () => {

    const server = Hapi.server({
        port: 3002,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/threats',
        handler: (request, h) => {

            return threats;
        }
    });

    server.route({
        method: 'post',
        path: '/assignment',
        handler: async (req, h) => {
            const heroId = parseInt(req.params.heroId)

            const promise = new Promise((resolve, reject) => {
                //this will call heroes service request
                request.post({
                    headers: { 'content-type': 'application/json' },
                    url: `${heroesService}/hero/${req.payload.heroId}`,
                    body: `{
                            "busy": true
                        }`
                }, (err, heroResponse, body) => {
                    if (!err) {
                        const threatId = parseInt(req.payload.threatId);
                        const threat = threats.find(subject => subject.id === threatId);
                        threat.assignedHero = req.payload.heroId;

                        resolve(threat)
                    } else {

                        reject(`Hero Service responded with issue ${err}`)
                    }
                });
            })
            return promise;

        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();