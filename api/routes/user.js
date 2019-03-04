const express = require('express');
const router = express();
const checkAuth = require("../middleware/check-auth");

const UsersController = require("../controllers/users");


router.get("/all", UsersController.get_all_users);

router.post('/signup', UsersController.sign_in);

router.post('/signin', UsersController.sign_up);

router.delete('/:userId', checkAuth, UsersController.delete_user);


module.exports = router;