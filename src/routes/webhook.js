const express = require("express");
const router = express.Router();

const webhookController = require("../api/v2/controllers/Webhook");

// Get all order by customer ID
router.post("/", webhookController.handleDialogflowWebhook);
module.exports = router;
