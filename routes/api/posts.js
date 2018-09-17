const express = require("express");
const router = express.Router();

// @Route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;
