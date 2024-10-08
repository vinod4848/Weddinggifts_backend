const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/addToCart", cartController.addToCart);

router.get("/getAllCartItems", cartController.getAllCartItems);

router.get("/user", cartController.getCartItems);

router.delete("/removeFromCart/:userId/:itemId", cartController.removeFromCart);


router.put("/incrementQuantity/:itemId/increment", cartController.incrementQuantity);


router.put("/decrementQuantity/:itemId/decrement", cartController.decrementQuantity);

module.exports = router;
