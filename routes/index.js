const express = require("express");
const router = express.Router();

const studentRoute = require("./students");
const profRoute = require("./prof");


router.use("/students", studentRoute);
router.use("/prof", profRoute);
module.exports = router;