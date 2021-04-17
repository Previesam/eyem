module.exports = (app) => {

    const branch = require('../controllers/branch.controller.js');

    const { verifyToken } = require('../config/verify.token');

    // Route to create new branch

    app.post('/branch/create', verifyToken, branch.create);

    // Route to get all branches

    app.get('/branches', branch.findAll);

    // Route to get one branch

    app.get('/branch/:id', branch.findOne);


    // Route to update branch

    app.put('/branch/update/:id', verifyToken, branch.update);

    // Route to delete branch

    app.delete('/branch/delete/:id', verifyToken, branch.delete);

}