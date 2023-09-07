const express = require("express");
const router = express.Router();
const { profController, authController } = require("../controllers");
router.route("/signup").post(profController.profSignUp);
router.route("/login").post(profController.profLogin);
router
  .route("/assignStudents")
  .post(authController.ensureAuth, profController.profAssignStudents);

router
  .route("/markAttendance")
  .post(authController.ensureAuth, profController.profMarksAttendance);


router
  .route("/updatesAttendance")
  .put(authController.ensureAuth, profController.profUpdatesAttendance);

router
  .route("/profRequestUpdate")
  .put(authController.ensureAuth, profController.profRequestUpdate);

// router.route( )

router
  .route("/getCourses")
  .get(authController.ensureAuth, profController.profGetCourse);
router
  .route("/getStudents")
  .get(authController.ensureAuth, profController.profGetStudents);

router
  .route("/chooseDate")
  .get(authController.ensureAuth, profController.profChooseDate);

router
  .route("/chooseCourse")
  .get(authController.ensureAuth, profController.profChooseCourse);

router
  .route("/getStudentList")
  .get(authController.ensureAuth, profController.profGetStudentList);


router
  .route("/getChosenDateUpdation")
  .get(authController.ensureAuth, profController.updateprofchooseDate);
  
router
  .route("/getStudentListUpdation")
  .get(authController.ensureAuth, profController.updateProfFetchStudentList);

router
  .route("/getprofRequestReceive")
  .get(authController.ensureAuth, profController.profRequestReceive);


module.exports = router;
