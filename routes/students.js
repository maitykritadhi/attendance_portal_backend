const express = require("express");
const router = express.Router();
const { studentController, authController } = require("../controllers");
router.route("/signup").post(studentController.studentsSignUp);
router.route("/login").post(studentController.studentsLogin);

router
  .route("/studentRequest")
  .post(authController.ensureAuth, studentController.studentRequest);

///

router
  .route("/getStudentInfo")
  .get(authController.ensureAuth, studentController.getStudentInfo);

router
  .route("/studentgetResponse")
  .get(authController.ensureAuth, studentController.studentgetResponse);




module.exports = router;
