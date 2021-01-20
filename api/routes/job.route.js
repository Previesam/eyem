module.exports = (app) => {

    const job = require('../controllers/job.controller.js');

    const { verifyToken } = require('../config/verify.token');

    // Route to create new job

    app.post('/job/create', job.create);

    // Route to get all jobs

    app.get('/jobs', verifyToken, job.findAll);

    // Route to get one job

    app.get('/job/:Id', job.findOne);


    // Route to update job

    app.put('/job/update/:Id', job.update);

    // Route to delete job

    app.delete('/job/delete/:Id', job.delete);

}