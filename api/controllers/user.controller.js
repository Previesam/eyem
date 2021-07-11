// Import the User model

const User = require("../models/user.model.js");
const Roles = require("../models/role.model.js");
const axios = require("axios");

const populateQuery = [
  { path: "role", select: ["name", "permissions"] },
  { path: "defaultBranch", select: ["Name", "Key"] },
  { path: "createdBy", select: ["fullname", "phone", "email"] },
  { path: "lastModifiedBy", select: ["fullname", "phone", "email"] },
  { path: "branches", select: ["Name", "Key"] }
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

// Route to request account creation

exports.preCreate = async (req, res) => {
  let errors = [];

  if (req.body.firstname.length < 3) {
    errors.push({
      message: "First name must have at least 3 characters"
    });
  }

  if (req.body.lastname.length < 3) {
    errors.push({
      message: "Last name must have at least 3 characters"
    });
  }

  if (!req.body.email) {
    errors.push({
      message: "Email cannot be empty"
    });
  }

  if (errors.length > 0) return res.status(400).send({ errors });

  // Check if email exist

  await User.findOne({ email: req.body.email })
    .then(data => {
      // Send error if it does
      if (data) {
        error.push({
          message:
            "The email address has be registered in our database, Please contact the admin"
        });
        return res.status(400).send(errors);
      }

      // Create user object if not

      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
      });

      // Save the new user object

      user
        .save()
        .then(data => {
          if (!data) {
            errors.push({
              message: "Unknown error occurred while saving user account"
            });
            return res.status(500).send(errors);
          }
          // Send success message
          return res.status(201).send({
            message:
              "Account creation request sent successfully, you will receive and email to activate you account if approved"
          });
        })
        .catch(err => {
          errors.push({
            message:
              err.message || "Unknown error occurred while saving user account"
          });
          // Send error message
          return res.status(500).send(errors);
        });
    })
    .catch(err => {
      errors.push({
        message: err.message || "Unknown error occurred while checking email"
      });
      // Send error message
      res.status(500).send(errors);
    });
};

// Method for creating new user

exports.create = async (req, res) => {
  const errors = [];

  // Validating entered data

  if (!req.body.firstname || !req.body.lastname) {
    error.push({
      message: "First name or Last name cannot be empty"
    });
  }

  if (req.body.firstname.length < 3) {
    errors.push({
      message: "First name must have at least 3 characters"
    });
  }

  if (req.body.lastname.length < 3) {
    errors.push({
      message: "Last name must have at least 3 characters"
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

  if (errors.length > 0) return res.status(400).send({ errors });

  // Check if user already exist

  await User.findOne({ email: req.body.email })
    .then(async data => {
      // Send error if so

      if (data)
        return res.status(400).send({
          message: "User with email " + req.body.email + " already exist"
        });

      // Create new user object

      const user = new User(req.body);

      user.activationCode = randtoken.uid(16);

      user.activationExpiresIn = moment.utc().add(30, "minutes");

      // Save the new user

      user
        .save()
        .then(async data => {
          // Send success message
          await data
            .execPopulate(populateQuery)
            .then(async data => {
              try {
                let response = await axios(
                  "http://localhost:3000/api/email/send",
                  {
                    method: "POST",
                    headers: { Authorization: "Bearer " + req.token },
                    data: {
                      templateId: "60e4e8947760e310a69c8068",
                      data: {
                        user_name: data.firstname,
                        activation_link: `http://localhost:3000/users/activate?code=${data.activationCode}`,
                        link_expiry: data.activationExpiresIn
                      },
                      recipients: [data.email]
                    }
                  }
                );
                return res
                  .status(201)
                  .send({ message: "User created successfully", user: data });
              } catch (err) {
                res.status(500).send({
                  message:
                    err.message ||
                    "Could not send activation email after account was created"
                });
              }
            })
            .catch(err =>
              res
                .status(500)
                .send({ message: err.message || "Population error" })
            );
        })
        .catch(err => {
          // Send error message
          return res.status(500).send({
            message:
              err.message || "Unknown error occurred while saving user account"
          });
        });
    })
    .catch(err => {
      // Send error message
      res.status(500).send({
        message: err.message || "Unknown error occurred while checking email"
      });
    });
};

// Method for finalizing signup

exports.activate = async (req, res) => {
  await User.findOne({ activationCode: req.params.code })
    .then(data => {
      if (!data)
        return res.status(400).send({
          message:
            "You have provided an invalid activation code, Please contact admin"
        });
      if (data.activationExpiresIn < moment.utc())
        return res.status(400).send({
          message:
            "Your activation code has expired, contact the admin to get new activation code"
        });
      return res.send({
        message: "Your account has be activated successfully!!"
      });
    })
    .catch(err => {
      // Send error message
      res.status(500).send({
        message:
          err.message ||
          "Unknown error occurred while validating activation code"
      });
    });
};

// Method for setting user password

exports.setPassword = async (req, res) => {
  // Check password and confirm password equality
  if (req.body.password !== req.body.confirmPassword)
    return res
      .status(400)
      .send({ message: "Password and confirm password must match" });

  // Get the user
  const user = await User.findOne({ activationCode: req.params.code });

  // Check if there is no user
  if (!user) {
    return res
      .status(404)
      .send({ message: "What have you done? we cannot find you details" });
  }

  // Check if activation code is expired

  if (user.activationExpiresIn < moment.utc())
    return res.status(400).send({
      message:
        "Your activation code has expired, contact the admin to get new activation code"
    });

  // Copy information and set password

  Object.assign(user, {
    hash: bcrypt.hashSync(req.body.password, SALT_WORK_FACTOR)
  });

  user.approved = true;

  delete user.activationCode;
  delete user.activationExpiresIn;

  // Find user with the provided id and update the password hashed

  user
    .save()
    .then(data => {
      // Send success message
      res.send({ message: "Your password has been updated successfully" });
    })
    .catch(err => {
      // Send error messages
      return res.status(500).send({
        message:
          err.message ||
          "Unknown error occurred while trying to verify your identity"
      });
    });
};

// Method for finding all users

exports.findAll = async (req, res) => {
  await User.find({}, { hash: 0 })
    .populate(populateQuery)
    .exec()
    .then(async data => {
      return res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message || "An error occurred while retrieving users"
      });
    });
};

// Method for finding authenticated user

exports.findAuthUser = async (req, res) => {
  await User.findById(req.userId)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: "Cannot find user with Id " + req.userId
        });
      }
      data.execPopulate(populateQuery, (err, data) => {
        const { hash, ...nohash } = data._doc;
        return res.send({ user: nohash });
      });
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

// Module for finding one user

exports.findOne = async (req, res) => {
  await User.findById(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: "Cannot find user with Id " + req.userId
        });
      }
      data.execPopulate(populateQuery, (err, data) => {
        const { hash, ...nohash } = data._doc;
        return res.send({ user: nohash });
      });
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

// Method for changing password

exports.updatePassword = async (req, res) => {
  // Check password and confirm password equality
  if (req.body.password !== req.body.confirmPassword)
    return res
      .status(400)
      .send({ message: "Password and confirm password must match" });

  // Check if it is the user's old password is correct

  // Get the user
  const user = await User.findOne({
    hash: bcrypt.hashSync(req.body.oldPassword, SALT_WORK_FACTOR)
  });

  // Check if there is no user
  if (!user) {
    return res.status(404).send({
      message: "What have you done? seems you have provided wrong old password"
    });
  }

  // Copy information and set password

  Object.assign(user, {
    hash: bcrypt.hashSync(req.body.password, SALT_WORK_FACTOR)
  });

  // Find user with the provided id and update the password hashed

  user
    .save()
    .then(data => {
      // Send success message
      res.send({ message: "Your password has been updated successfully" });
    })
    .catch(err => {
      // Send error messages
      return res.status(500).send({
        message:
          err.message ||
          "Unknown error occurred while trying to verify your identity"
      });
    });
};

// Method for updating user

exports.update = async (req, res) => {
  // Validate Request
  const errors = [];

  // Validating entered data

  if (!req.body.firstname || !req.body.lastname) {
    error.push({
      message: "First name or Last name cannot be empty"
    });
  }

  if (req.body.firstname.length < 3) {
    errors.push({
      message: "First name must have at least 3 characters"
    });
  }

  if (req.body.lastname.length < 3) {
    errors.push({
      message: "Last name must have at least 3 characters"
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

  if (errors.length > 0) return res.status(400).send({ errors });

  //get user
  const user = await User.findById(req.params.id);

  // validate
  if (!user) {
    return res
      .status(404)
      .send({ message: "What have you done? we cannot find you details" });
  }

  // copy userinfo properties to user
  Object.assign(user, req.body);

  if (!user.approved) {
    user.activationCode = randtoken.uid(16);
    user.activationExpiresIn = moment.utc().add(30, "minutes");
    try {
      let response = await axios("http://localhost:3000/api/email/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${req.token}`
        },
        data: {
          templateId: "60e4e8947760e310a69c8068",
          data: {
            user_name: user.firstname,
            activation_link: `http://localhost:3000/users/activate?code=${user.activationCode}`,
            link_expiry: user.activationExpiresIn
          },
          recipients: [user.email]
        }
      });
      user
        .save()
        .then(async data => {
          let { hash, ...userinfo } = await data
            .execPopulate(populateQuery)
            .then(data => data.toObject());
          return res.send({
            message:
              "User info was saved and account activation maill was sent successfully",
            userinfo
          });
        })
        .catch(err => {
          return res.status(500).send({
            message:
              err.message ||
              "Unknown error occurred while saving user information"
          });
        });
    } catch (err) {
      return res.status(400).send({
        message: err + "Unknown error occurred while trying to send email"
      });
    }
  } else {
    user
      .save()
      .then(async data => {
        let { hash, ...userinfo } = await data
          .execPopulate(populateQuery)
          .then(data => data.toObject());
        return res.send({
          message: "Profile was updated successfully",
          userinfo
        });
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res
            .status(404)
            .send({ message: "User not found with id " + req.params.id });
        }
        return res.status(500).send({
          message: err.message || "Error updating User with id " + req.params.id
        });
      });
  }
};

// Method for deleting user

exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: "Cannot find user with Id " + req.params.id
        });
      }
      return res.send({
        message: "User deleted successfully..."
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Cannot find user with Id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Unknown error occurred while trying to delete user"
      });
    });
};
