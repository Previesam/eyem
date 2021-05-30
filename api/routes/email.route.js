module.exports = app => {
  const email = require("../controllers/email.controller.js");

  const { verifyToken } = require("../config/verify.token");

  // Route to send new email

  app.post("/email/send", email.send);

  // Route to get all emails

  app.get("/emails", verifyToken, email.findAll);

  // Route to get one email

  app.get("/mail/:id", verifyToken, email.findOne);

  // Route to delete one email

  app.delete("/email/delete/:id", verifyToken, email.delete);

  // Route to create new email template

  app.post("/email/template/create", verifyToken, email.saveTemplate);

  // Route to get all email templates

  app.get("/email/templates", verifyToken, email.findAllTemplate);

  // Route to get single email templates

  app.get("/email/template/:id", verifyToken, email.findTemplate);

  // Route to update email template

  app.put("/email/template/update/:id", verifyToken, email.updateTemplate);

  // Route to delete email template

  app.delete("/email/template/delete/:id", verifyToken, email.deleteTemplate);
};
