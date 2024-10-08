const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/register', adminController.registerAdmin);

router.post('/loginAdmin', adminController.loginAdmin);

router.post('/logout', adminController.logoutAdmin);

router.get('/products', adminController.getProducts);

// router.get('/users', adminController.getUsers);

router.get('/messages', adminController.getMessages);

module.exports = router;
