
'use strict';

const Hapi = require('@hapi/hapi');
const loadTestPlugins = require('../plugins/test');

const powers = [
    { id: 1, name: 'flying' },
    { id: 2, name: 'teleporting' },
    { id: 3, name: 'super strength' },
    { id: 4, name: 'clairvoyance' },
    { id: 5, name: 'mind reading' }
];

const heroes = [
    {
        id: 1,
        type: 'spider-dog',
        displayName: 'Cooper',
        powers: [1, 4],
        img: 'cooper.jpg',
        busy: false
    },
    {
        id: 2,
        type: 'flying-dogs',
        displayName: 'Jack & Buddy',
        powers: [2, 5],
        img: 'jack_buddy.jpg',
        busy: false
    },
    {
        id: 3,
        type: 'dark-light-side',
        displayName: 'Max & Charlie',
        powers: [3, 2],
        img: 'max_charlie.jpg',
        busy: false
    },
    {
        id: 4,
        type: 'captain-dog',
        displayName: 'Rocky',
        powers: [1, 5],
        img: 'rocky.jpg',
        busy: false
    }
];

const init = async () => {

    const server = Hapi.server({
        port: 3001,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/heroes',
        handler: (request, h) => {

            return heroes;
        }
    });

    server.route({
        method: 'GET',
        path: '/powers',
        handler: (request, h) => {

            return powers
        }
    });

    server.route({
        method: 'post',
        path: '/hero/{heroId}',
        handler: async (request, h) => {
            const heroId = parseInt(request.params.heroId)
            console.log(heroId)
            const promise = new Promise((resolve, reject) => {
                const foundHero = heroes.find(subject => subject.id === heroId);
                if (foundHero) {
                    for (let attribute in foundHero) {
                        if (request.payload[attribute]) {
                            foundHero[attribute] = request.payload[attribute]
                            console.log(`Set ${attribute} to ${request.payload[attribute]} in hero: ${heroId}`);
                        }
                    }
                    resolve(foundHero)
                    // res.status(202).header({ Location: `http://localhost:${port}/hero/${foundHero.id}` }).send(foundHero);
                } else {
                    console.log(`Hero not found.`);
                    reject(`Hero not found.`)
                }

            })
            return promise;

        }
    });

    //await server.register([require('plugin1'), require('plugin2')]); //for multiple plugins

    //register a plugin

    // await server.register({        
    //     plugin: require('myPlugin'),
    //     options: {
    //         message: 'hello'
    //     }
    // })
    // register plugins to server instance
    // server.register({
    //     register: require('../plugins/test')
    // })

    await server.register({
        plugin: require('../plugins/test'),
        options: {
            name: 'Bob'
        }        
    });

    // await server.register(require('myplugin'), {
    //     routes: {
    //         prefix: '/plugins'
    //     }
    // });

    // start server
    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();