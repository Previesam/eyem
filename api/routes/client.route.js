module.exports = (app) => {

    const client = require('../controllers/client.controller.js');

    const { verifyToken } = require('../config/verify.token');

    // Route to create new client

    app.post('/client/create', verifyToken, client.create);

    // Route to get all clients

    app.get('/clients', client.findAll);

    // Route to get some clients

    app.get('/clients/:branch', client.findSome);

    // Route to get one client

    app.get('/client/:id', client.findOne);


    // Route to update client

    app.put('/client/update/:id', verifyToken, client.update);

    // Route to delete client

    app.delete('/client/delete/:id', verifyToken, client.delete);

}