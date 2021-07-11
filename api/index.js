const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const Client = require("./models/client.model");
const Branch = require("./models/branch.model");
const axios = require("axios");
const nodeHtmlToImage = require("node-html-to-image");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// create express app
const app = express();

// Cross-Origin resource sharing check
app.use(cors({
  origin : "localhost"
}));

// morgan implementation logging of request information
app.use(morgan("common"));

// Implement compression of request
app.use(compression());

// Implement helmet for more security
app.use(helmet());

// Use Express Static
app.use(express.static(__dirname + "/public"));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
const { link, readFileSync } = require("fs");
const { clear } = require("console");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    // process.exit();
  });

let diffArray = (arr1, arr2) => {
  var newArr = arr1.concat(arr2);
  return newArr.filter(i => newArr.indexOf(i) == newArr.lastIndexOf(i));
};

let timer;

var updateBranches = async () => {
  await axios("https://manager.eyemastersng.com/api/index.json", {
    method: "GET",
    headers: {
      Authorization: process.env.MANAGER_TOKEN
    }
  })
    .then(async res => {
      let branches = res.data;

      let resolvedBranches = await branches.filter(
        branch =>
          branch.Name.includes("Eyemasters") ||
          branch.Name.includes("1st Contact")
      );

      for (branch of resolvedBranches) {
        branch.Name = branch.Name.split(" - ")[1];
        Branch.findOne({ Key: branch.Key }, (err, data) => {
          if (err) {
            return console.log(err.message);
          }
          if (!data) {
            let newBranch = new Branch(branch);
            newBranch
              .save()
              .then(data => console.log(data))
              .catch(err => { });
            return console.log("data");
          }
        });
      }
    })
    .catch(err => {
      return console.log(err);
    });
};

var updateClients = async () => {
  await updateBranches();
  if (timer) {
    clearTimeout(timer);
  }
  await axios("https://manager.eyemastersng.com/api/index.json", {
    method: "GET",
    headers: {
      Authorization: process.env.MANAGER_TOKEN
    }
  })
    .then(async res => {
      let branches = res.data;

      let resolvedBranches = await branches.filter(
        branch =>
          branch.Name.includes("Eyemasters") ||
          branch.Name.includes("1st Contact")
      );

      for (branch of resolvedBranches) {
        branch.Name = branch.Name.split(" - ")[1];

        console.log(branch);

        let Key = branch.Key;

        await axios(
          `https://manager.eyemastersng.com/api/${Key}/ec37c11e-2b67-49c6-8a58-6eccb7dd75ee/index.json`,
          {
            method: "GET",
            headers: {
              Authorization: process.env.MANAGER_TOKEN
            }
          }
        )
          .then(async res => {
            if (!res.data) return;

            let links = res.data;

            await Client.find({ Branch: branch.Name })
              .then(async data => {
                if (!data) return;

                let clients = data.map(m => m.Key);

                let newLinks = diffArray(clients, links);

                if (!newLinks) return;

                console.log(newLinks.length);

                for (item of newLinks) {
                  await axios(
                    `https://manager.eyemastersng.com/api/${Key}/${item}.json`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: process.env.MANAGER_TOKEN
                      }
                    }
                  )
                    .then(async res => {
                      let client = res.data;

                      client.Key = item;

                      client.Branch = branch.Name;

                      let newCustomFeilds = {};

                      let entries = Object.entries(client.CustomFields);

                      for (const [prop, val] of entries) {
                        let Name = await axios(
                          `https://manager.eyemastersng.com/api/${Key}/${prop}.json`,
                          {
                            method: "GET",
                            headers: {
                              Authorization:
                                process.env.MANAGER_TOKEN
                            }
                          }
                        )
                          .then(res => {
                            return res.data?.Name;
                          })
                          .catch(err => {
                            console.log(err.message);
                            return;
                          });

                        newCustomFeilds[Name?.replace(/ /g, "")] = {
                          key: prop,
                          value: val
                        };
                      }

                      client.CustomFields = newCustomFeilds;

                      const newClient = new Client(client);

                      await newClient
                        .save()
                        .then(data =>
                          console.log(`${data.Name} Saved sucessfully`)
                        )
                        .catch(err => console.log(err.message));
                    })
                    .catch(async err => {
                      if (err.message === "Cannot set property 'Key' of null") {
                        await Client.findOneAndDelete({ Key: item })
                          .then(data => {
                            console.log(`${data.Name} Deleted successfully`);
                          })
                          .catch(err => console.log(err.message));
                      } else {
                        return console.log(err.message);
                      }
                    });
                }
              })
              .catch(err => {
                return console.log(err.message);
              });
          })
          .catch(async err => {
            return console.log(err.message);
          });
      }
    })
    .catch(async err => {
      return console.log(err.message);
    });
  timer = setTimeout(updateClients, 2 * 60000);
};

// updateClients();

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Api is working" });
});

app.get("/html-image", (req, res) => {
  let html = req.body.html;
  res.send(html);
});

app.get("/test-email", async (req, res) => {
  let source = readFileSync(__dirname + '/templates/job.html').toString()
  // let source = `<style>.fr-class-footer {display: block; padding: 10px; background-color: rgb(0, 0, 255); color: rgb(255, 255, 255); max-width: 100%;} .fr-class-button {display: block; margin: 0 auto; width: 100px; border-radius: 0.5rem; background-color: rgb(0, 0, 255); padding: 5px; text-transform: capitalize; line-height: 1.5; text-align: center; text-transform: capitalize; } .fr-class-button > a {text-decoration: none;}</style><p><a href="http://www.eyemastersng.com" rel="noopener noreferrer" target="_blank"><img src="https://eyemastersng.com/wp-content/uploads/2020/02/Logo-New.png" style="width: 300px;" class="fr-fic fr-dib"></a></p><hr><p><br></p><h2>New User Activation</h2><p><br></p><p>Hello {{ receiver_name }},</p><p>Congratulations, your account was created successfully, kindly click below to activate your account.</p><p><br></p><p class="fr-class-button"><a href="https://eyemastersng.com" target="_blank"><span style="color: rgb(255, 255, 255);"><strong>Activate</strong></span></a></p><p><br></p><p>Thank you.</p><p><br></p><p class="fr-class-footer" style="text-align: center;">Eyemasters Limited<br>35, Freedom Way, Ikate Lagos.<br><a href="https://eyemastersng.com" target="_blank"><span style="color: rgb(255, 255, 255);">www.eyemastersng.com</span></a><br><span style="color: rgb(255, 255, 255);font-size: 18px;"><a href="https://facebook.com/eyemastersnigeria" target="_blank"><i class="fa  fa-facebook-square fr-deletable"></i></a>&nbsp; <a href="https://twitter.com/eye_mastersng" target="_blank"><i class="fa  fa-twitter-square fr-deletable">&nbsp;</i></a> <a href="https://instagram.com/eyemasters" target="_blank"><i class="fa  fa-instagram fr-deletable">&nbsp;</i></a></span><br><span style="color: rgb(255, 255, 255);"><a href="https://twitter.com/eye_mastersng" target="_blank"></a><a href="https://instagram.com/eyemasters" target="_blank"></a></span></p>`;

  let data = {
    client_name: "Samuel Adeyanju",
    job_status: "Ready"
  };

  let template = handlebars.compile(source);

  let mailOptions = {
    from: "info@eyemastersng.com",
    to: "drnomsoeyemasters@outlook.com",
    subject: "New Message title",
    text: "Plaintext version of the message",
    html: template(data)
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err);
    return res.send(info);
  });
});

// Require routes

require("./routes/user.route.js")(app);
require("./routes/job.route.js")(app);
require("./routes/client.route.js")(app);
require("./routes/branch.route.js")(app);
require("./routes/email.route.js")(app);
require("./routes/role.route.js")(app);
// require('./routes/service.route.js')(app);
// require('./routes/role.route.js')(app);

// Export server for requests
module.exports = {
  path: "/api/",
  handler: app
};
