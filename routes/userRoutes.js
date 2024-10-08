const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/Usersignup', UserController.signup);
router.post('/Userlogin', UserController.login);
router.delete('/deleteUser/:id', UserController.deleteUser);
router.put('/updateUser/:id', UserController.updateUser);
router.get('/getUserById/:id', UserController.getUserById);

module.exports = router;


// Str0ng#Password
// Gupata@12345