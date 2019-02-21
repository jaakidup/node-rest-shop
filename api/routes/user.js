const express = require('express');
const router = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../model/user');


router.post('/signup', (req, res, next) => {

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
                                })
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
});



router.delete('/:userId', (req, res, next) => {

    User.deleteOne({_id: req.body.userId}).exec()
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

});







module.exports = router;