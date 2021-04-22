const Client = require("../models/client.model");

// Handler for creating new client

exports.create = (req, res) => {
  res.json({ message: "Working" });
};

// Handler for Getting all clients

exports.findAll = async (req, res) => {
  await Client.find({}, (err, data) => {
    if (data) {
      return res.send(data);
    }
    return res
      .status(500)
      .send({
        message: err.message || "Unknown error occurred while fetching clients"
      });
  });
};

// Handler for Getting some clients

exports.findSome = async (req, res) => {
  let branch = decodeURIComponent(req.params.branch);
  await Client.find({ Branch: branch }, (err, data) => {
    if (data) {
      return res.send(data);
    }
    return res
      .status(500)
      .send({
        message: err.message || "Unknown error occurred while fetching clients"
      });
  });
};


// Handler for Getting single client

exports.findOne = (req, res) => {
  Client.findById(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
      if (err.type == "ObjectId") {
        return res
          .status(400)
          .send({ message: "Could not find client with the id provided" });
      }
      res
        .status(500)
        .send({
          message: err.message || "Unknown error occurred while fetching client"
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
