// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.handleChatInput);
router.get("/init", chatController.getInitialMessage);

module.exports = router;
