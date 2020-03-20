const express = require("express");
const router = express.Router();

router.get("/tests", (req, res) => {
    res.json({ msg: "profile works" });
});

module.exports = router;
