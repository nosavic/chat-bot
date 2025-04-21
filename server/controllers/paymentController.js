const Order = require("../models/Order");
const axios = require("axios");

exports.payWithPaystack = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("items.menuItem");

  const totalInKobo = order.total * 100;
  const paystackSecret = "sk_test_xxxx"; // Replace with your test secret

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: "test@example.com",
      amount: totalInKobo,
      metadata: { orderId },
      callback_url: `http://localhost:5000/api/pay/callback/${orderId}`,
    },
    {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    }
  );

  res.redirect(response.data.data.authorization_url);
};

exports.paymentCallback = async (req, res) => {
  const { orderId } = req.params;
  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "paid",
    status: "completed",
  });
  res.send(
    "✅ Payment successful! Your order is complete. Return to the chatbot."
  );
};
