const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const Client = require("./models/client.model");
const axios = require("axios");

// create express app
const app = express();

// Cross-Origin resource sharing check
app.use(cors());

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
const { link } = require("fs");
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
    process.exit();
  });

let diffArray = (arr1, arr2) => {
  var newArr = arr1.concat(arr2);
  return newArr.filter(i => newArr.indexOf(i) == newArr.lastIndexOf(i));
};

let timer;

var updateClients = async () => {
  if (timer) {
    clearTimeout(timer);
  }
  await axios("https://manager.eyemastersng.com/api/index.json", {
    method: "GET",
    headers: {
      Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE="
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
              Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE="
            }
          }
        )
          .then(async res => {
            
            if (!res.data) return;

            let links = res.data;

            await Client.find({ Branch: branch.Name })
              .then(async data => {

                if(!data) return;

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
                        Authorization: "Basic cHJldmllc2FtOlNhbUBAMjAxNSE="
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
                                "Basic cHJldmllc2FtOlNhbUBAMjAxNSE="
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

// Require routes

require("./routes/user.route.js")(app);
require("./routes/job.route.js")(app);
require("./routes/client.route.js")(app);
require("./routes/branch.route.js")(app);
// require('./routes/product.route.js')(app);
// require('./routes/event.route.js')(app);
// require('./routes/service.route.js')(app);
// require('./routes/role.route.js')(app);

// Export server for requests
module.exports = {
  path: "/api/",
  handler: app
};
