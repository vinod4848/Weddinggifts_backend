const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/createPayment", paymentController.createPayment);


router.get("/user/:userId", paymentController.getPaymentsByUser);


router.get("/getAllPayments", paymentController.getAllPayments);


router.delete("/deletePayment/:paymentId", paymentController.deletePayment);

module.exports = router;
