const express = require("express");
const { createCheckout, getAllCheckouts, getCheckoutById, updateCheckout, deleteCheckout } = require("../controllers/checkoutController");

const router = express.Router();

router.post('/checkout', createCheckout);
router.get('/checkout', getAllCheckouts);
router.get('/checkout/:id', getCheckoutById);
router.put('/checkout/:id', updateCheckout);
router.delete('/checkout/:id', deleteCheckout);

module.exports = router;
