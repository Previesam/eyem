const Branch = require("../models/branch.model");

// Handler for creating new client

exports.create = (req, res) => {
  res.json({ message: "Working" });
};

// Handler for Getting all clients

exports.findAll = async (req, res) => {
  await Branch.find({}, (err, data) => {
    if (data) {
      return res.send(data);
    }
    return res
      .status(500)
      .send({
        message: err.message || "Unknown error occurred while fetching branches"
      });
  });
};

// Handler for Getting single client

exports.findOne = (req, res) => {
  Branch.findById(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
      if (err.type == "ObjectId") {
        return res
          .status(400)
          .send({ message: "Could not find branch with the id provided" });
      }
      res
        .status(400)
        .send({
          message: err.message || "Unknown error occurred while fetching branches"
        });
    });
};

// Handler for Updating client

exports.update = (req, res) => {
  res.json({ message: "Update Found" });
};

// Handler for Deleting client

exports.delete = (req, res) => {
  res.json({ message: "Delete Found" });
};
