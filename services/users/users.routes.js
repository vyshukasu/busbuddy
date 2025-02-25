const express = require("express");
const router = express.Router();

// Example Route (Change as needed)
router.get("/", (req, res) => {
    res.send("User routes working!");
});

module.exports = router;

