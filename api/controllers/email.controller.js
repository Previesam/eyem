const Email = require("../models/email.model");
const EmailTemplate = require("../models/email-template.model");
const API_KEY = "511c004791c26114d781ce10702ae57e-2a9a428a-e08dcfaf";
const DOMAIN = "mg.eyemastersng.com";
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });
const populateQuery = [
  { path: "createdBy", select: ["fullname", "phone", "email"] },
  { path: "lastModifiedBy", select: ["fullname", "phone", "email"] }
];

// Handler for sending new email

exports.send = async (req, res) => {
  // await window.unlayer.init({
  //   id: "editor-container"
  // });

  // console.log(dom);

  let recipients = req.body.recipients;
  let fullname = req.body.fullname;

  for (recipient of recipients) {
    const data = {
      from: req.body.from,
      to: recipient,
      subject: req.body.subject,
      text: welcomeEmail.replace("[fullname]", fullname),
      html: welcomeEmail.replace("[fullname]", fullname)
    };
    console.log(data.html);
    await mailgun.messages().send(data, (err, body) => {
      if (err) console.error(err);
      console.log(body);
      res.send({ message: "Mails sent successfully" });
    });
  }
};

// Handler for Getting all emails

exports.findAll = async (req, res) => {
  await Email.find({}, (err, data) => {
    if (data) {
      return res.send(data);
    }
    return res.status(500).send({
      message: err.message || "Unknown error occurred while fetching branches"
    });
  });
};

// Handler for Getting single email

exports.findOne = (req, res) => {
  Email.findById(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
      if (err.type == "ObjectId") {
        return res
          .status(400)
          .send({ message: "Could not find branch with the id provided" });
      }
      res.status(500).send({
        message: err.message || "Unknown error occurred while fetching branches"
      });
    });
};

// Handler for Deleting email

exports.delete = (req, res) => {
  Email.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind == "ObjectId") {
        return res
          .status(400)
          .send({ message: "Could not find email with the id provided" });
      }
      return res.status(500).send({
        message: err.message || "Unknown error occurred while deleting email"
      });
    }
    res.send(data);
  });
  res.json({ message: "Delete Found" });
};

// Handler for creating new email template

exports.saveTemplate = async (req, res) => {
  let template = new EmailTemplate(req.body);
  await template
    .save()
    .then(data => {
      data.execPopulate(populateQuery).then(data => {
        res.send(data);
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message ||
          "Unknown error occured while trying to save email template"
      });
    });
};

// Handler for getting all email templates

exports.findAllTemplate = async (req, res) => {
  await EmailTemplate.find()
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

// Handler for getting single email template

exports.findTemplate = async (req, res) => {
  await EmailTemplate.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind == "Object Id")
        return res.status(400).send({ message: "Invalid template id" });
      return res.status(500).send({
        message:
          err.message || "Unknown error occured while trying to get template"
      });
    }
    data.execPopulate(populateQuery).then(data => {
      res.send(data);
    });
  });
};

// Handler for updating email template

exports.updateTemplate = async (req, res) => {
  await EmailTemplate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, data) => {
      if (err) {
        if (err.kind == "Object Id")
          return res.status(400).send({ message: "Invalid template id" });
        return res.status(500).send({
          message:
            err.message ||
            "Unknown error occured while trying to update template"
        });
      }
      data.execPopulate(populateQuery).then(data => {
        console.log(data);
        res.send(data);
      });
    }
  );
};

// Handler for deleting email template

exports.deleteTemplate = (req, res) => {
  EmailTemplate.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind == "ObjectId") {
        return res.status(400).send({
          message: "Could not find email template with the id provided"
        });
      }
      return res.status(500).send({
        message:
          err.message || "Unknown error occurred while deleting email template"
      });
    }
    res.send(data);
  });
};
