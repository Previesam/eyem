const Email = require("../models/email.model");
const EmailTemplate = require("../models/email-template.model");
const API_KEY = "511c004791c26114d781ce10702ae57e-2a9a428a-e08dcfaf";
const DOMAIN = "mg.eyemastersng.com";
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

let welcomeEmail = `
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>
      
    </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
  <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
  <!--<![endif]-->


    
<style type="text/css">
  @media only screen and (min-width:480px) {
    .mj-column-per-100 { width:100% !important; max-width: 100%; }
  }
</style>


    <style type="text/css">
    
    

@media only screen and (max-width:480px) {
  table.mj-full-width-mobile { width: 100% !important; }
  td.mj-full-width-mobile { width: auto !important; }
}

    </style>
    
    
  </head>
  <body style="word-spacing:normal;background-color:#eeeeee;">
    
    
  <div
     style="background-color:#eeeeee;"
  >
    
  
  <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->

  
  <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
    >
      <tbody>
        <tr>
          <td
             style="direction:ltr;font-size:0px;padding:0;text-align:center;"
          >
            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
        
  <div
     class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  >
    
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  >
    <tbody>
      
          <tr>
            <td
               align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
  >
    <tbody>
      <tr>
        <td  style="width:250px;">
          
  <img
     height="auto" src="~/Pictures/GIMP Projects/Logo No BG crop.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250"
  />

        </td>
      </tr>
    </tbody>
  </table>

            </td>
          </tr>
        
          <tr>
            <td
               align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <p
     style="border-top:solid 4px #000000;font-size:1px;margin:0px auto;width:100%;"
  >
  </p>
  
  <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #000000;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->


            </td>
          </tr>
        
    </tbody>
  </table>

  </div>

      <!--[if mso | IE]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    
  </div>

  
  <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->

  
  <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
    >
      <tbody>
        <tr>
          <td
             style="direction:ltr;font-size:0px;padding:0;text-align:center;"
          >
            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
        
  <div
     class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  >
    
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  >
    <tbody>
      
          <tr>
            <td
               align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <div
     style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#555555;"
  >Dear [fullname],</div>

            </td>
          </tr>
        
          <tr>
            <td
               align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <div
     style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#555555;"
  >Your account has been created succesfully, kindly follow the link below to activate your account.</div>

            </td>
          </tr>
        
          <tr>
            <td
               align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"
  >
    <tr>
      <td
         align="center" bgcolor="blue" role="presentation" style="border:none;border-radius:0.5rem;cursor:auto;mso-padding-alt:10px 25px;background:blue;" valign="middle"
      >
        <a
           href="localhost:3000/activate?id:8928933nuchuhdfi3" style="display:inline-block;background:blue;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:0.5rem;" target="_blank"
        >
          Activate
        </a>
      </td>
    </tr>
  </table>

            </td>
          </tr>
        
          <tr>
            <td
               align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <div
     style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#555555;"
  >Thank you. <br><br> Eyemasters Limited</br></div>

            </td>
          </tr>
        
          <tr>
            <td
               align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <p
     style="border-top:solid 4px #000000;font-size:1px;margin:0px auto;width:100%;"
  >
  </p>
  
  <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #000000;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->


            </td>
          </tr>
        
    </tbody>
  </table>

  </div>

      <!--[if mso | IE]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    
  </div>

  
  <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->

  
  <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
    >
      <tbody>
        <tr>
          <td
             style="direction:ltr;font-size:0px;padding:0;text-align:center;"
          >
            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
        
  <div
     class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  >
    
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  >
    <tbody>
      
          <tr>
            <td
               align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  
 <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td><![endif]-->
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"
          >
            
  <tr
    
  >
    <td  style="padding:5px;vertical-align:middle;">
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:25px;"
      >
        <tr>
          <td  style="font-size:0;height:25px;vertical-align:middle;width:25px;">
            <a  href="facebook.com" target="_blank">
                <img
                   height="25" src="~/Samuel/icons/036-facebook.svg" style="border-radius:3px;display:block;" width="25"
                />
              </a>
            </td>
          </tr>
      </table>
    </td>
    
  </tr>

          </table>
        <!--[if mso | IE]></td><td><![endif]-->
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"
          >
            
  <tr
    
  >
    <td  style="padding:4px;vertical-align:middle;">
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:25px;"
      >
        <tr>
          <td  style="font-size:0;height:25px;vertical-align:middle;width:25px;">
            <a  href="instagram.com" target="_blank">
                <img
                   height="25" src="~/Samuel/icons/029-instagram.svg" style="border-radius:3px;display:block;" width="25"
                />
              </a>
            </td>
          </tr>
      </table>
    </td>
    
  </tr>

          </table>
        <!--[if mso | IE]></td><td><![endif]-->
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"
          >
            
  <tr
    
  >
    <td  style="padding:4px;vertical-align:middle;">
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:25px;"
      >
        <tr>
          <td  style="font-size:0;height:25px;vertical-align:middle;width:25px;">
            <a  href="twitter.com" target="_blank">
                <img
                   height="25" src="~/Samuel/icons/008-twitter.svg" style="border-radius:3px;display:block;" width="25"
                />
              </a>
            </td>
          </tr>
      </table>
    </td>
    
  </tr>

          </table>
        <!--[if mso | IE]></td></tr></table><![endif]-->


            </td>
          </tr>
        
          <tr>
            <td
               align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
            >
              
  <div
     style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#555555;"
  >www.eyemastersng.com</div>

            </td>
          </tr>
        
    </tbody>
  </table>

  </div>

      <!--[if mso | IE]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    
  </div>

  
  <!--[if mso | IE]></td></tr></table><![endif]-->


  </div>

  </body>
</html>
`;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console, { omitJSDOMErrors: true });
virtualConsole.on("jsdomError", err => {
  if (err.message !== "Could not parse CSS stylesheet") {
    console.error(err);
  }
});

const {
  window
} = new JSDOM(
  `<!DOCTYPE html><script src="https://editor.unlayer.com/embed.js" defer></script><div id="editor-container"></div>`,
  { resources: "usable", runScripts: "dangerously", virtualConsole }
);

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
