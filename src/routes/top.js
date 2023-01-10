const express = require("express");
const router = express.Router();

const topController = require("../api/v2/controllers/TopController");

// Get all order by customer ID
router.post("/", topController.getTopProduct);
module.exports = router;
