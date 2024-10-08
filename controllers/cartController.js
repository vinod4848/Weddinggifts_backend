const CartItem = require("../models/AddToCart");

exports .getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
};

exports. getCartItems = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const cartItems = await CartItem.find({ userId }).populate({
      path: "productIds",
      select: "price description imageUrl name",
    });

    let totalPrice = 0;
    cartItems.forEach((item) => {
      item.productIds.forEach((product) => {
        totalPrice += product.price * item.quantity;
      });
    });

    res.status(200).json({ cartItems, totalPrice });
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
};

exports. addToCart = async (req, res) => {
  const { userId, productIds, quantity } = req.body;
  try {
    let cartItem = await CartItem.findOne({ userId, productIds });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ userId, productIds, quantity });
      await cartItem.save();
    }
    res
      .status(201)
      .json({ message: "Product added to cart successfully!", cartItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product to cart." });
  }
};

exports. removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const cartItem = await CartItem.findOneAndRemove({ _id: itemId, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

exports. incrementQuantity = async (req, res) => {
  try {
    const { userId } = req.body;
    const { itemId } = req.params;

    if (!userId || !itemId) {
      return res.status(400).json({ message: "userId and itemId are required" });
    }

    const cartItem = await CartItem.findOne({ _id: itemId, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    res.status(200).json({ message: "Product quantity increased", cartItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to increment product quantity" });
  }
};


exports .decrementQuantity = async (req, res) => {
  try {
    const { userId } = req.body;
    const { itemId } = req.params;

    if (!userId || !itemId) {
      return res.status(400).json({ message: "userId and itemId are required" });
    }

    const cartItem = await CartItem.findOne({ _id: itemId, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      res.status(200).json({ message: "Product quantity decreased", cartItem });
    } else {
      await CartItem.findOneAndRemove({ _id: itemId, userId });
      res.status(200).json({ message: "Product removed from cart" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to decrement product quantity" });
  }
};