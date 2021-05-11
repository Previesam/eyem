const Email = require("../models/email.model");
const EmailTemplate = require("../models/email-template.model");
const API_KEY = "511c004791c26114d781ce10702ae57e-2a9a428a-e08dcfaf";
const DOMAIN = "mg.eyemastersng.com";
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console, { omitJSDOMErrors: true });
virtualConsole.on("jsdomError", (err) => {
    if (err.message !== "Could not parse CSS stylesheet") {
        console.error(err);
    }
});

const { window } = new JSDOM(
  `<!DOCTYPE html><script src="https://editor.unlayer.com/embed.js" defer></script><div id="editor-container"></div>`,
  { resources: "usable", runScripts: "dangerously", virtualConsole }
);



// Handler for sending new email

exports.send = async (req, res) => {

  await window.unlayer.init({
    id: "editor-container"
  })

  console.log(dom);

  // let recipients = req.body.recipients;

  // for (recipient of recipients) {
  //   const data = {
  //     from: req.body.from,
  //     to: recipient,
  //     subject: req.body.subject,
  //     text: req.body.text,
  //     html: req.body.html
  //   };
  //   await mailgun.messages().send(data, (err, body) => {
  //     if (err) console.error(err);
  //     console.log(body);
  //   });
  // }
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

exports.saveTemplate = (req, res) => {
  let template = new EmailTemplate(req.body);
  template
    .save()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message:
          err.message ||
          "Unknown error occured while trying to save email template"
      });
    });
};

// Handler for getting all email templates

exports.findAllTemplate = (req, res) => {
  EmailTemplate.find({})
    .then(data => res.send(data))
    .catch(err => {
      return res.status(500).send({ message: err.message || "No job found" });
    });
};

// Handler for getting single email template

exports.findTemplate = (req, res) => {
  EmailTemplate.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind == "Object Id")
        return res.status(400).send({ message: "Invalid template id" });
      return res.status(500).send({
        message:
          err.message || "Unknown error occured while trying to get template"
      });
    }
    res.send(data);
  });
};

// Handler for updating email template

exports.updateTemplate = (req, res) => {
  EmailTemplate.findByIdAndUpdate(req.params.id, false, (err, data) => {
    if (err) {
      if (err.kind == "Object Id")
        return res.status(400).send({ message: "Invalid template id" });
      return res.status(500).send({
        message:
          err.message || "Unknown error occured while trying to update template"
      });
    }
    res.send(data);
  });
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
