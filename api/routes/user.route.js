module.exports = (app) => {

    const user = require('../controllers/user.controller.js');

    const { verifyToken } = require('../config/verify.token');

    // Route to create new user

    app.post('/user/signup', user.create);

    // Route to authenticate user

    app.post('/user/authenticate', user.authenticate);

    // Route to refresh user

    app.post('/user/refresh/:token', user.refresh);

    // Route to get all users

    app.get('/users', verifyToken, user.findAll);

    // Route to get one user

    app.get('/user/:Id', user.findOne);

    // Route to assign role to user

    app.post('/user/assignrole', user.assignRole);

    // Route to update user

    app.put('/user/:Id', user.update);

    // Route to delete user

    app.delete('/user/:Id', user.delete);

}