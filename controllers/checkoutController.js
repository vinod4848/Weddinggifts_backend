const Checkout = require("../models/Checkout");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createCheckout = async (req, res) => {
    try {
        const { customer, payment, cartItems, totalPrice } = req.body;

        // Save the checkout details in the database
        const newCheckout = new Checkout({
            customer,
            payment,
            cartItems,
            totalPrice,
        });
        await newCheckout.save();

        // Construct the email message
        const msg = {
            to: customer.email, 
            from: 'hi@integrate360.in', 
            // from: 'ngeduwizer@gmail.com', 
            subject: 'Thank you for your gift!',
            text: `Dear ${customer.name},\n\nThank you for your gift purchase! We appreciate your support.\n\nYour Order Details:\n- Total Price: ${totalPrice}\n- Items: ${cartItems.map(item => item.name).join(", ")}\n\nBest regards,\nYour Store`,
            html: `<p>Dear ${customer.name},</p><p>Thank you for your gift purchase! We appreciate your support.</p><p><strong>Order Details:</strong></p><ul>${cartItems.map(item => `<li>${item.name}</li>`).join('')}</ul><p><strong>Total Price:</strong> ${totalPrice}</p><p>Best regards,<br>Your Store</p>`,
        };

        try {
            // Send the email using SendGrid
            await sgMail.send(msg);
            res.status(201).json({ message: 'Checkout successful, thank you email sent', data: newCheckout });
        } catch (emailError) {
            // Log any error that occurred during email sending
            console.error('Error sending email:', emailError);
            if (emailError.response) {
                console.error('Response body:', emailError.response.body);
            }
            res.status(201).json({ message: 'Checkout successful, but email failed to send', data: newCheckout });
        }
        
    } catch (error) {
        console.error('Checkout processing error:', error);
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
