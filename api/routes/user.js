const express = require('express');
const router = express();

const UsersController = require("../controllers/users");


router.get("/all", UsersController.users_get_all_users);

router.post('/signup', UsersController.users_sign_in);

router.post('/signin', UsersController.users_sign_up);

router.delete('/:userId', UsersController.user_delete_user);


module.exports = router;