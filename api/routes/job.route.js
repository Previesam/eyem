module.exports = (app) => {

    const job = require('../controllers/job.controller.js');

    const { verifyToken } = require('../config/verify.token');

    // Route to create new job

    app.post('/job/create', verifyToken, job.create);

    // Route to get all jobs

    app.get('/jobs', verifyToken, job.findAll);

    // Route to get one job

    app.get('/job/:id', verifyToken, job.findOne);


    // Route to update job

    app.put('/job/update/:id', verifyToken, job.update);

    // Route to delete job

    app.delete('/job/delete/:id', verifyToken, job.delete);

}