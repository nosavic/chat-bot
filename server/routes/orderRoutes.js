const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// 🧾 GET all menu items
router.get("/menu", orderController.getMenuItems);

// 🛒 GET current order
router.get("/order/current", orderController.getCurrentOrder);

// 📜 GET order history
router.get("/order/history", orderController.getOrderHistory);

// ✅ POST checkout order
router.post("/order/checkout", orderController.checkoutOrder);

// ❌ DELETE cancel order
router.delete("/order/cancel", orderController.cancelOrder);

module.exports = router;
