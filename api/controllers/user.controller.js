// Import the User model

const User = require('../models/user.model.js');
const Roles = require('../models/role.model.js');

// All Imports

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const Config = require('../config/settings.config.js');
const RefreshToken = require('../models/refresh-token.model');
const randtoken = require('rand-token');
const RoleType = require('../config/roles.js');
const SALT_WORK_FACTOR = 10;

// Method for creating new user

exports.create = (req, res) => {

    // Validating entered data

    if (!req.body.firstname) {
        return res.status(400).send({
            message: "First name cannot be empty"
        });
    }

    if (req.body.firstname.length < 3) {
        return res.status(400).send({
            message: "First name must have at least 3 characters"
        });
    }

    if (!req.body.lastname) {
        return res.status(400).send({
            message: "Last name cannot be empty"
        });
    }

    if (req.body.lastname.length < 3) {
        return res.status(400).send({
            message: "Last name must have at least 3 characters"
        });
    }

    if (!req.body.email) {
        return res.status(400).send({
            message: "Email cannot be empty"
        });
    }

    if (req.body.email.length < 3) {
        return res.status(400).send({
            message: "Email must have at least 3 characters"
        });
    }

    if (!req.body.password) {
        return res.status(400).send({
            message: "Password cannot be empty"
        });
    }

    if (req.body.password < 6) {
        return res.status(400).send({
            message: "Password must be atleast 6 characters long"
        });
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({
            message: "Password and password confirmation does not match"
        });
    }

    if (!req.body.phone) {
        return res.status(400).send({
            message: "Phone number is required"
        });
    }

    if (req.body.phone.length < 11) {
        return res.status(400).send({
            message: "Phone number needs to be at least 11 characters long"
        });
    }

    // if (!req.body.dateOfBirth) {
    //     return res.status(400).send({
    //         message: "Date of birth is required"
    //     });
    // }

    // if (req.body.dateOfBirth !== Date) {
    //     return res.status(400).send({
    //         message: "Date of birth must be a valid date"
    //     });
    // }

    // Check if user already exist

    User.find({ email: req.body.email })
        .then(async data => {
            if (data.length > 0) {
                return res.status(400).send({
                    message: "User with email " + req.body.email + " already exist"
                });
            } else {

                // Create new user object

                const user = new User(req.body);


                // bcrypt.genSalt(SALT_WORK_FACTOR, salt => {
                //     bcrypt.hash(req.body.password, salt, hashedPassword => {
                //         user.hash = hashedPassword;
                //     });
                // });

                // Add to Role User
                const _role = await Roles.findOne({
                    roleName: RoleType.User
                });

                if (!_role) {
                    return res.status(400).send('Default role not available for user');
                }

                // User Role Assignment

                user.roles.push(_role.roleName);

                // Password Encryption

                user.hash = bcrypt.hashSync(req.body.password, 10);

                // Save the new user

                user.save()
                    .then(data => {
                        return res.send({
                            message: "User created successfully...",
                            data: data
                        });
                    })
                    .catch(err => {
                        return res.status(500).send({
                            message: err.message || "An unknown error occurred while creating user account."
                        });
                    });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message || "An unknown error occurred while trying to check if user exist"
            });
        });

}

// Method for finding all users

exports.findAll = (req, res) => {

    User.find({})
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving users"
            });
        });

}

// Method for finding one user

exports.findOne = (req, res) => {

    User.findById(req.params.Id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: "Cannot find user with Id " + req.params.Id
                });
            }
            return res.send(data);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Cannot find user with the Id " + req.params.Id
                });
            }
            return res.status(500).send({
                message: err.message || "Unknown error occurred while retrieving user"
            });
        });
}

// Assign role

exports.assignRole = async (req, res) => {

    if (req.body.userId == "" || req.body.roleId == "") {
        return res.status(400).send('User/role details can not be empty!');
    }

    // validate
    const user = await User.findById(req.body.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    //find role by id
    const role = await Roles.findById(req.body.roleId);
    if (!role) {
        return res.status(404).send('Role not found');
    }

    if (user.roles.includes(role.roleName)) {
        return res.status(400).send('User exist in role already!');
    }

    user.roles.push(role.roleName);
    // save user
    user.save().then(data => {

        return res.status(404).send("User added to role");

    }).catch(err => {
        if (err.kind === 'ObjectId') {
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

                    const token = jwt.sign(
                        { sub: data.id },
                        Config.secret,
                        {
                            issuer: 'http://localhost:3011',
                            expiresIn: '1m' // Expires in 1 minutes
                        }
                    );

                    // Creating the refresh token

                    const refreshToken = randtoken.uid(16);

                    // Validation before adding new refresh token to db

                    const _refresh = await RefreshToken.findOne({
                        user: data.id
                    });

                    if (_refresh) {

                        newRefresh = {
                            issuedUtc: moment().utc(),
                            expiresUtc: moment().add(4, 'days').utc(),
                            token: refreshToken,
                            user: data.id
                        }

                        await RefreshToken.findByIdAndUpdate(_refresh.id, newRefresh);

                        res.send({
                            id: data.id,
                            name: data.firstname + ' ' + data.surname,
                            email: data.email,
                            access_token: token,
                            expiresIn: moment().add(1, 'minutes').utc(),
                            refresh_token: newRefresh.token
                        });

                    } else {

                        // Create New Token Object
                        const newToken = new RefreshToken({
                            issuedUtc: moment().utc(),
                            expiresUtc: moment().add(4, 'days').utc(),
                            token: refreshToken,
                            user: data.id
                        });

                        //Save the new token

                        newToken.save();

                        // Respond to request

                        res.send({
                            id: data.id,
                            name: data.firstname + ' ' + data.surname,
                            email: data.email,
                            access_token: token,
                            expiresIn: moment().add(1, 'minutes').utc(),
                            refresh_token: newToken.token
                        });
                    }

                } else {
                    return res.status(404).send('Login Failed!');
                }
            } else {
                return res.status(404).send('No user found with the specified email');
            }
        })
        .catch(err => {
            return res.status(500).send(err.message || "Some error occurred while trying to log you in");
        });
}

// Refreshing User Token

exports.refresh = async (req, res) => {

    // Find Refresh Token from Database

    let _refresh = await RefreshToken.findOne({
        user: req.userId
    });

    if (_refresh.token === req.params.token) {

        const refreshToken = randtoken.uid(16);

        // Update the refresh token in database

        RefreshToken.findByIdAndUpdate(_refresh.id, {
            issuedUtc: moment().utc(),
            expiresUtc: moment().add(4, 'days').utc(),
            token: refreshToken,
            user: req.userId
        })
            .then(async data => {

                let user = await User.findById(req.userId);

                // Generate new token
                const newToken = jwt.sign(
                    { sub: user.id },
                    Config.secret,
                    {
                        issuer: 'http://localhost:3011',
                        expiresIn: '1m' // Expires in 1 minutes
                    }
                );

                res.send({
                    id: user.id,
                    name: user.firstname + ' ' + user.surname,
                    email: user.email,
                    access_token: newToken,
                    expiresIn: moment().add(1, 'minutes').utc(),
                    refresh_token: refreshToken
                });
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(400).send({
                        message: "Invalid refresh request please login afresh"
                    });
                }
                return res.status(500).send({
                    message: err.message || "Unknown error occurred while refreshing token"
                });
            });

    } else {
        return res.status(400).send({
            message: "Invalid Refresh token provided, please login again"
        });
    }
}

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
        return res.status(404).send('User not found');
    }

    if (user.email !== req.body.email && User.findOne({
        email: req.body.email
    })) {
        return res.status(500).send('Username "' + req.body.email + '" already exist!');
    }

    // hash password if it was entered
    if (req.body.password) {
        req.body.hash = bcrypt.hashSync(req.body.password, 10);
    }

    // copy userinfo properties to user
    Object.assign(user, req.body);

    user.save().then(data => {
        if (!data) {
            return res.status(404).send("User not found with id " + req.params.Id);
        }
        res.send(data);

    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send("User not found with id " + req.params.Id);
        }
        return res.status(500).send("Error updating User with id " + req.params.Id);
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
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Cannot find user with Id " + req.params.Id
                });
            }
            return res.status(500).send({
                message: "Unknown error occurred while trying to delete user"
            });
        });

}