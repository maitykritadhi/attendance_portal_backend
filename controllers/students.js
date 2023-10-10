const uuid = require("uuid");

const pool = require("../database/connection");
const bcrypt = require("bcrypt");
const { validateUser } = require("../util/util");

const studentsSignUp = async (req, res) => {
  try {
    const { name, roll, mail, password } = req.body;
    if (!name || !roll || !mail || !password) {
      console.log("Missing parameters");
      res.status(404).json({ message: "Please submit all valid parameters!" });
    } else {
      // Check if the email already exists in the database
      await pool.query(
        "SELECT * FROM students WHERE mail = ?",
        [mail],
        async (error, result) => {
          if (result[0]) {
            //   console.log(result[0]);
            return res
              .status(409)
              .json({ error: mail + " :Email already exists!!" });
          } else {
            // If email is not taken, bcrypt the user's password before storing it in the database
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // // Create a new user in the database
            await pool.query(
              "INSERT INTO students (name, roll, mail, password) VALUES (?, ?, ?, ?)",
              [name, roll, mail, hashedPassword]
            );

            // Registration successful
            res.status(200).json({ message: "Registration successful" });
          }
        }
      );
    }
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const studentsLogin = async (req, res) => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      console.log("Missing parameters");
      res.status(404).json({ message: "Please submit all valid parameters!" });
    } else {
      // Check if the email already exists in the database
      await pool.query(
        "SELECT id,mail,password FROM students WHERE mail = ?",
        [mail],
        async (error, result) => {
          if (!result[0]) {
            console.log("Mail not present in db");
            res.status(404).json({ message: "Email not present in db" });
          } else {
            const checkpassword = await validateUser(
              password,
              result[0].password
            );
            if (!checkpassword) {
              console.log("Wrong Password!");
              res.status(401).json({ message: "Wrong Password!" });
            } else {
              const myuuid = uuid.v4();
              // console.out("Your UUID is: " + myuuid);
              await pool.query(
                "SELECT * FROM session_table WHERE user_id = ?",
                [result[0].id],
                async (error, result1) => {
                  if (result1[0]) {
                    await pool.query(
                      "UPDATE session_table SET session_tokens = ? WHERE user_id = ?",
                      [myuuid, result[0].id]
                    );
                  } else {
                    await pool.query(
                      "INSERT INTO session_table (session_tokens,flag,user_id) VALUES (?,?,?)",
                      [myuuid, 0, result[0].id]
                    );
                  }
                }
              );
              res.status(200).json({
                message: "Logged in Successfully",
                session_token: myuuid,
              });
            }
          }
        }
      );
      // im  here
    }
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStudentInfo = async (req, res) => {
  try {
    const sid = req.userId;
    const flagofuser = Number(req.flag);
    console.log(sid);
    let result;
    await pool.query(
      "SELECT name,roll,mail FROM students WHERE id= ? ",
      [sid],
      async (error1, result1) => {
        console.log(result1);
        if (error1) {
          res.send({ message: "database error 1" });
        } else if (result1.size === 0) {
          console.log("Data not present in db");
          res.status(404).json({ message: "Data not present in db " });
        } else if (flagofuser === 1) {
          // console.log(flagofuser);
          console.log("Bad Request due to wrong user");
          res.status(400).json({ error: "Bad Request due to wrong user" });
        } else {
          result = result1[0];
          // console.log(result);
          // res.send(result);
          await pool.query(
            "SELECT course_id,DATE_FORMAT(date, '%Y-%m-%d') AS date,attendance FROM mark_attendance WHERE stud_id = ?",
            [sid],
            async (error2, result2) => {
              if (error2) {
                res.send({ message: "database error 2" });
              }
              // } else if (!result2[0]) {
              //   result["attendance"] = [];
              //   console.log("No attendance found");
              //   // res.status(404).json({ message: "Data not present in db 1" });
              // }
              else {
                if (result2[0]) result["attendance"] = result2;
                else result["attendance"] = [];
                // console.log(result);
                // res.send(result);
                await pool.query(
                  "SELECT c.cid,c.id FROM courses c JOIN student_course_mapped scm ON c.id = scm.course_id WHERE scm.stud_id = ?",
                  [sid],
                  async (error3, result3) => {
                    if (error3) {
                      res.send({ message: "database error 3" });
                    } else if (!result3[0]) {
                      console.log("Data not present in db");
                      res
                        .status(404)
                        .json({ message: "Data not present in db" });
                    } else {
                      result["courses"] = result3;
                      await pool.query(
                        "SELECT dayid,cid FROM timetable WHERE cid IN (SELECT course_id FROM student_course_mapped WHERE stud_id = ?)",
                        [sid],
                        async (error4, result4) => {
                          if (error4) {
                            res.send({ message: "database error 4" });
                          } else if (!result4[0]) {
                            console.log("Data not present in db");
                            res
                              .status(404)
                              .json({ message: "Data not present in db" });
                          } else {
                            const dayIdsToCheck = [1, 2, 3, 4, 5];
                            // Create a map to store the results
                            const resultMap = new Map();
                            // Initialize the map with the values from result4
                            result4.forEach((item) => {
                              const dayid = item.dayid;
                              const cid = item.cid;
                              if (!resultMap.has(dayid)) {
                                resultMap.set(dayid, []);
                              }
                              resultMap
                                .get(dayid)
                                .push({ dayid: dayid, cid: cid });
                            });

                            // Add missing dayids with cid as null
                            dayIdsToCheck.forEach((dayid) => {
                              if (!resultMap.has(dayid)) {
                                resultMap.set(dayid, [
                                  { dayid: dayid, cid: null },
                                ]);
                              }
                            });
                            // Flatten the map values to get the final result
                            const finalResult = Array.from(
                              resultMap.values()
                            ).flat();
                            result["timetable"] = finalResult;
                            console.log(result4);
                            res.send(result);
                          }
                        }
                      );
                      // console.log(result);
                      // res.send(result);
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const studentRequest = async (req, res) => {
  try {
    const sid = req.userId;
    let stud_mssg = req.body.mssg;
    const flagofuser = Number(req.flag);
    // let prof_id = req.body.profid;
    // let course_id = req.body.course_id;
    let id = req.body.id;
    let state = 0;
    if (!id) {
      console.log("Missing parameters");
      res.status(404).json({ message: "Missing Parameters!!!" });
    } else {
      await pool.query(
        "SELECT id,prof_id FROM courses WHERE id = ?",
        [id],
        async (error, result1) => {
          if (error) {
            console.log(error);
            res.send({ message: "database error" });
          } else if (flagofuser === 1) {
            // console.log(flagofuser);
            console.log("Bad Request due to wrong user");
            res.status(400).json({ error: "Bad Request due to wrong user" });
          } else {
            let course_id = result1[0]["id"];
            let prof_id = result1[0]["prof_id"];
            // console.log(result1);
            // res.send(result1);
            await pool.query(
              "INSERT INTO request (stud_mssg,stud_id,prof_id,state,course_id) VALUES (?,?,?,?,?)",
              [stud_mssg, sid, prof_id, state, course_id],
              async (error, result) => {
                if (error) {
                  console.log(error);
                  res.send({ message: "database error" });
                } else {
                  console.log("Successfully send request to prof!!");
                  res.send({ message: "Successfully send request to prof!!" });
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during studentRequest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const studentgetResponse = async (req, res) => {
  try {
    const sid = req.userId;
    const flagofuser = Number(req.flag);
    await pool.query(
      "SELECT r.id,r.stud_mssg,r.prof_mssg,r.stud_id,r.state,r.course_id,c.cid FROM request r JOIN courses c ON c.id = r.course_id WHERE stud_id = ?",
      [sid],
      async (error, result) => {
        if (error) {
          console.log(error);
          res.send({ message: "database error" });
        } else if (flagofuser === 1) {
          // console.log(flagofuser);
          console.log("Bad Request due to wrong user");
          res.status(400).json({ error: "Bad Request due to wrong user" });
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  } catch {
    // Handle any errors that occurred during the database operations
    console.error("Error during studentRequest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  studentsLogin,
  studentsSignUp,
  getStudentInfo,
  studentRequest,
  studentgetResponse,
};
