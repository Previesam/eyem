const mongoose = require("mongoose");
var Job = require("../models/job.model");
const populateQuery = [
  { path: "client", select: ["Name", "Code"] },
  { path: "branch", select: ["Name", "Key"] },
  { path: "createdBy", select: ["fullname", "phone", "email"] },
  { path: "lastModifiedBy", select: ["fullname", "phone", "email"] }
];

// Handler for creating new job

exports.create = async (req, res) => {
  const newJob = req.body;
  await new Job(newJob)
    .save()
    .then(async data => {
      data
        .execPopulate(populateQuery)
        .then(data => {
          res.send(data);
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while creating job"
      });
    });
};

// Handler for Getting all Jobs

exports.findAll = async (req, res) => {
  await Job.find({})
    .populate(populateQuery)
    .exec((err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occured please try again!" });
      } else {
        console.log(data);
        res.send(data);
      }
    });
};

// Handler for Getting single Job

exports.findOne = (req, res) => {
  Job.findById(req.params.id)
    .then(data => {
      data
        .execPopulate(populateQuery)
        .then(data => {
          res.send(data);
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        res.status(400).send({ message: "Invalid job id" });
      } else {
        res
          .status(500)
          .send({ message: "Unknown error occurred please try again" });
      }
    });
};

// Handler for Updating Job

exports.update = async (req, res) => {
  await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(data => {
      data
        .execPopulate(populateQuery)
        .then(data => {
          console.log(data);
          res.send(data);
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        res.status(400).send({ message: "Invalid job id" });
      } else {
        res
          .status(500)
          .send({ message: "Unknown error occurred please try again" });
      }
    });
};

// Handler for Deleting Job

exports.delete = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id)
    .then(data => {
      console.log(data);
      res.send({ message: "Job deleted successfully" });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        res.status(400).send({ message: "Invalid job id" });
      } else {
        res
          .status(500)
          .send({ message: "Unknown error occurred please try again" });
      }
    });
};
