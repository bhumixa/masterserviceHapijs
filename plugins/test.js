'use strict';

//make plugin
const myPlugin = {
    name: 'myPlugin',
    version: '1.0.0',
    register: async function (server, options) {

        // Create a route for 
        server.route({
            method: 'GET',
            path: '/test',
            handler: function (request, h) {

                const name = options.name;
                return `Hello ${name}`;
            }
        });
    }
};

module.exports = myPlugin