
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.get_all_users = (req, res, next) => {

    User.find()
        .exec()
        .then(users => {
            if (users.length === 0) {
                res.status(204).json({
                    message: "No Users Found"
                });
            } else {
                const response = {
                    info: "This is just for testing purposes:",
                    users: users
                }

                res.status(200).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });

};

exports.sign_in = (req, res, next) => {

    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email address already in use"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: error
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(error => {
                                res.status(500).json({
                                    error: error
                                });
                            });
                    }
                }
                )
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
};


exports.sign_up = (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                            expiresIn: '1h'
                        });

                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth Failed"
                });
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
};


exports.delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId }).exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
};