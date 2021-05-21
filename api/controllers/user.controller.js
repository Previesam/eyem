// Import the User model

const User = require("../models/user.model.js");
const Roles = require("../models/role.model.js");

const populateQuery = [
  { path: "role", select: ["name", "permissions"] },
  { path: "defaultBranch", select: ["Name", "Key"] }
];



// All Imports

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const Config = require("../config/settings.config.js");
const RefreshToken = require("../models/refresh-token.model");
const randtoken = require("rand-token");
const { secret } = require("../config/settings.config.js");
const SALT_WORK_FACTOR = 10;

// Method for creating new user

exports.create = async (req, res) => {
  const errors = [];

  // Validating entered data

  if (!req.body.fullname) {
    error.push({
      message: "Full name cannot be empty"
    });
  }

  if (req.body.fullname.length < 3) {
    errors.push({
      message: "Full name must have at least 3 characters"
    });
  }

  if (!req.body.email) {
    errors.push({
      message: "Email cannot be empty"
    });
  }

  if (!req.body.role) {
    errors.push({
      message: "Role cannot be empty"
    });
  }

  if (req.body.email.length < 3) {
    errors.push({
      message: "Email must have at least 3 characters"
    });
  }

  // if (!req.body.password) {
  //   errors.push({
  //     message: "Password cannot be empty"
  //   });
  // }

  // if (req.body.password.length < 6) {
  //   errors.push({
  //     message: "Password must be atleast 6 characters long"
  //   });
  // }

  // if (req.body.password !== req.body.confirmPassword) {
  //   errors.push({
  //     message: "Password and password confirmation does not match"
  //   });
  // }

  //   if (!req.body.phone) {
  //     return res.status(400).send({
  //       message: "Phone number is required"
  //     });
  //   }

  //   if (req.body.phone.length < 11) {
  //     return res.status(400).send({
  //       message: "Phone number needs to be at least 11 characters long"
  //     });
  //   }

  if (errors.length > 0) return res.status(400).send({ errors });

  // Check if user already exist

  await User.find({ email: req.body.email })
    .then(async data => {
      if (data.length > 0) {
        errors.push({
          message: "User with email " + req.body.email + " already exist"
        });
        return res.status(400).json(errors);
      } else {
        // Create new user object

        const user = new User(req.body);

        user.regInfo.code = randtoken.uid(16);

        user.regInfo.expiresIn = moment.now();

        // Password Encryption

        // user.hash = bcrypt.hashSync(req.body.password, 10);

        // Save the new user

        user
          .save()
          .then(data => {
            let [regInfo, ...rest] = data.toObject();
            return res.status(201).send(regInfo);
          })
          .catch(err => {
            errors.push({
              message:
                err.message ||
                "An unknown error occurred while creating user account."
            });
            return res.status(500).send({ errors });
          });
      }
    })
    .catch(err => {
      errors.push({
        message:
          err.message ||
          "An unknown error occurred while trying to check if user exist"
      });
      return res.status(500).send({ errors });
    });
};

// Method for finalizing signup

exports.finalize = async (req, res) => {
  await User.findById(req.params.id)
    .then(data => {
      let expiresIn = data.regInfo.expiresIn;
      let code = data.regInfo.code;
      if (moment.now(expiresIn) >= moment.now() && code === req.body.code) {
        res.send({ message: "success" });
      } else {
        res.status(400).send({ message: "Invalid code or user" });
      }
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        res.status(400).send({ message: "No user found with the provided id" });
      }
      res
        .status(500)
        .send({ message: "Unknown error occurred, please try again" });
    });
};

// Method for setting user password

exports.setPassword = (req, res) => {
  if (req.body.password === !req.body.confirmPassword)
    res
      .status(400)
      .send({ message: "Password and confirm password must match" });
  if (req.body.oldPassword) {
    if (bcrypt.compareSync(req.body.password, secret)) {
    }
  }
};

// Method for finding all users

exports.findAll = async (req, res) => {
  // fullname = "Samuel Adeyanju";
  // console.log(welcomeEmail.replace("[fullname]", fullname));
  await User.find({})
    .then(data => {
      return res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message || "An error occurred while retrieving users"
      });
    });
};

// Method for finding one user

exports.findOne = async (req, res) => {
  await User.findById(req.userId)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: "Cannot find user with Id " + req.userId
        });
      }
      const { hash, ...nohash } = data._doc;
      return res.send({ user: nohash });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Cannot find user with the Id " + req.userId
        });
      } else {
        return res.status(500).send({
          message: err.message || "Unknown error occurred while retrieving user"
        });
      }
    });
};

// Assign role

exports.assignRole = async (req, res) => {
  if (!req.body.userid || !req.body.roleid) {
    return res
      .status(400)
      .send({ message: "User/role details can not be empty!" });
  }

  // validate
  const user = await User.findById(req.body.userid);
  if (!user) {
    return res.status(404).send("User not found");
  }

  //find role by id
  const role = await Roles.findById(req.body.roleid);
  if (!role) {
    return res.status(404).send("Role not found");
  }

  if (user.roles.includes(role.roleName)) {
    return res.status(400).send("User exist in role already!");
  }

  user.roles.push(role.roleName);
  // save user
  user
    .save()
    .then(data => {
      return res.status(404).send("User added to role");
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send("User not added to role");
      }
      return res.status(500).send("Error adding user to role");
    });
};

// Authenticating User

exports.authenticate = async (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(async data => {
      if (data) {
        if (data && bcrypt.compareSync(req.body.password, data.hash)) {
          // Removing Hash from user information

          const { hash, ...userWithoutHash } = data.toObject();

          // Creating the Token

          const access_token = jwt.sign({ sub: data.id }, Config.secret, {
            issuer: "http://localhost:3000",
            expiresIn: "1m" // Expires in 30 minutes
          });

          // Creating the refresh token

          const refresh_token = randtoken.uid(16);

          // Validation before adding new refresh token to db

          const _refresh = await RefreshToken.findOne({
            user: data.id
          });

          const newRefresh = {
            issuedUtc: moment().utc(),
            expiresUtc: moment()
              .add(30, "days")
              .utc(), // Expires in 30 days
            token: refresh_token,
            user: data.id
          };

          if (_refresh) {
            await RefreshToken.findByIdAndUpdate(_refresh.id, newRefresh)
              .then(data => {
                if (data) {
                  res.send({
                    access_token,
                    refresh_token
                  });
                } else {
                  res.status(500).send({
                    message:
                      "Unknown error occurred while updating refresh token"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            const refreshToken = new RefreshToken(newRefresh);
            refreshToken
              .save()
              .then(data => {
                if (data) {
                  res.send({
                    access_token,
                    refresh_token
                  });
                }
                res.status(500).send({
                  message: "Unknown error occurred while saving refresh token"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          return res
            .status(400)
            .send({ message: "Email or password is incorrect" });
        }
      } else {
        return res.status(400).send({ message: "Invalid Email address" });
      }
    })
    .catch(err => {
      return res
        .status(500)
        .send(err.message || "Some error occurred while trying to log you in");
    });
};

// Refreshing User Token

exports.refresh = async (req, res) => {
  // Find Refresh Token from Database

  try {
    let _refresh = await RefreshToken.findOne({
      token: req.body.refresh_token
    });
    if (_refresh && moment.unix(_refresh.expiresUtc) > moment.now()) {
      const access_token = jwt.sign({ sub: _refresh.user }, Config.secret, {
        issuer: "http://localhost:3000",
        expiresIn: "30m" // Expires in 1 minutes
      });

      res.send({ access_token });
    } else {
      return res.status(400).send({
        message: "Refresh token has expired please try login gain"
      });
    }
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(400).send({
        message: "Refresh token submitted does not exist, please login again"
      });
    }
    return res.status(500).send({
      message: err.message || "Unknown error occurred while refreshing token"
    });
  }
};

// Method for updating user

exports.update = async (req, res) => {
  // Validate Request
  if (req.body.email == "") {
    return res.status(400).send({
      message: "User email cannot be empty"
    });
  }

  //get user
  const user = await User.findById(req.params.Id);

  // validate
  if (!user) {
    return res.status(404).send("User not found");
  }

  if (
    user.email !== req.body.email &&
    User.findOne({
      email: req.body.email
    })
  ) {
    return res
      .status(500)
      .send('Username "' + req.body.email + '" already exist!');
  }

  // hash password if it was entered
  if (req.body.password) {
    req.body.hash = bcrypt.hashSync(req.body.password, 10);
  }

  // copy userinfo properties to user
  Object.assign(user, req.body);

  user
    .save()
    .then(data => {
      if (!data) {
        return res.status(404).send("User not found with id " + req.params.Id);
      }
      res.send(data);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send("User not found with id " + req.params.Id);
      }
      return res
        .status(500)
        .send("Error updating User with id " + req.params.Id);
    });
};

// Method for deleting user

exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.Id)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: "Cannot find user with Id " + req.params.Id
        });
      }
      return res.send({
        message: "User deleted successfully..."
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Cannot find user with Id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Unknown error occurred while trying to delete user"
      });
    });
};
