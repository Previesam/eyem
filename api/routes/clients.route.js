module.exports = (app) => {

    const client = require('../controllers/job.controller.js');

    const { verifyToken } = require('../config/verify.token');

    // Route to initialize client from old software

    app.get('/client/initialize', client.initialize)

    // Route to create new client

    app.post('/client/create', client.create);

    // Route to get all clients

    app.get('/clients', verifyToken, client.findAll);

    // Route to get one client

    app.get('/client/:Id', client.findOne);


    // Route to update client

    app.put('/client/update/:Id', client.update);

    // Route to delete client

    app.delete('/job/delete/:Id', client.delete);

}