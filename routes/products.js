const express = require('express');
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productController = require('../controllers/productController');

router.get('/getProducts', productController.getProducts);
router.post('/addProduct', upload.single("image"), productController.addProduct);
router.put('/updateProduct/:id', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);
router.get('/order-summary', productController.getOrderSummary);
router.post('/checkout', productController.checkout);

module.exports = router;
