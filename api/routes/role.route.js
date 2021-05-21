module.exports = (app) => {

    const role = require('../controllers/role.controller.js');

    const { verifyToken } = require('../config/verify.token');

    // Route to create new role

    app.post('/role/create', verifyToken, role.create);

    // Route to get all roles

    app.get('/roles', verifyToken, role.findAll);

    // Route to get one role

    app.get('/role/:id', verifyToken, role.findOne);


    // Route to update role

    app.put('/role/update/:id', verifyToken, role.update);

    // Route to delete role

    app.delete('/role/delete/:id', verifyToken, role.delete);

}