const mongoose = require("mongoose");
var Role = require("../models/role.model");
const populateQuery = [
  { path: "createdBy", select: ["fullname", "phone", "email"] },
  { path: "lastModifiedBy", select: ["fullname", "phone", "email"] }
];

// Handler for creating new role

exports.create = async (req, res) => {
  const newRole = req.body;
  await new Role(newRole)
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
        message: err.message || "An error occurred while creating role"
      });
    });
};

// Handler for Getting all roles

exports.findAll = async (req, res) => {
  await Role.find({})
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

// Handler for Getting single role

exports.findOne = (req, res) => {
  Role.findById(req.params.id)
    .then(data => {
      data
        .execPopulate(populateQuery)
        .then(data => {
          res.send(data);
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        res.status(400).send({ message: "Invalid role id" });
      } else {
        res
          .status(500)
          .send({ message: "Unknown error occurred please try again" });
      }
    });
};

// Handler for Updating role

exports.update = async (req, res) => {
  await Role.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
        res.status(400).send({ message: "Invalid role id" });
      } else {
        res
          .status(500)
          .send({ message: "Unknown error occurred please try again" });
      }
    });
};

// Handler for Deleting Role

exports.delete = async (req, res) => {
  await Role.findByIdAndDelete(req.params.id)
    .then(data => {
      console.log(data);
      res.send({ message: "Role deleted successfully" });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        res.status(400).send({ message: "Invalid role id" });
      } else {
        res
          .status(500)
          .send({ message: "Unknown error occurred please try again" });
      }
    });
};
