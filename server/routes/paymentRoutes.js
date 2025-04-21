const express = require("express");
const router = express.Router();
const paymentController = require("./controllers/paymentController");

router.get("/pay/:orderId", paymentController.payWithPaystack);
router.get("/pay/callback/:orderId", paymentController.paymentCallback);

module.exports = router;
