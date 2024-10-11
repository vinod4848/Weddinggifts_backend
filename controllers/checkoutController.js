const Checkout = require("../models/Checkout");

const createCheckout = async (req, res) => {
    try {
        const { customer, payment, cartItems, totalPrice } = req.body;

        const newCheckout = new Checkout({
            customer,
            payment,
            cartItems,
            totalPrice,
        });

        await newCheckout.save();
        res.status(201).json({ message: 'Checkout successful', data: newCheckout });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Failed to process checkout' });
    }
};


const getAllCheckouts = async (req, res) => {
    try {
      const checkouts = await Checkout.find().populate({
        path: "cartItems.productId",
        select: "name price image", 
      });
      if (!checkouts || checkouts.length === 0) {
        return res.status(404).json({ message: 'No checkouts found' });
      }
      res.status(200).json(checkouts);
    } catch (error) {
      console.error("Error retrieving checkouts:", error.message);
      res.status(500).json({ error: 'Failed to retrieve checkouts' });
    }
  };
  
  
const getCheckoutById = async (req, res) => {
    const { id } = req.params;
    try {
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }
        res.status(200).json(checkout);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve checkout' });
    }
};

const updateCheckout = async (req, res) => {
    const { id } = req.params;
    const { customer, payment, cartItems, totalPrice } = req.body;

    try {
        const updatedCheckout = await Checkout.findByIdAndUpdate(
            id,
            { customer, payment, cartItems, totalPrice },
            { new: true, runValidators: true }
        );

        if (!updatedCheckout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        res.status(200).json({ message: 'Checkout updated successfully', data: updatedCheckout });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update checkout' });
    }
};

const deleteCheckout = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCheckout = await Checkout.findByIdAndDelete(id);

        if (!deletedCheckout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        res.status(200).json({ message: 'Checkout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete checkout' });
    }
};

module.exports = {
    createCheckout,
    getAllCheckouts,
    getCheckoutById,
    updateCheckout,
    deleteCheckout
};
