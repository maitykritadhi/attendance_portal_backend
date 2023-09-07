const bcrypt = require("bcrypt");

/*
module.exports.validateUser = async (password,hash)=> {
  return await bcrypt
    .compare(password, hash)
    .then((res) => {
      console.log("res:",res); // return true
      return res;
    })
    .catch((err) => console.error(err.message));
}
*/

module.exports.validateUser = async (password, hash) => {
  try {
    const result = await bcrypt.compare(password, hash);
    console.log("res:", result); // true or false
    return result;
  } catch (err) {
    console.error(err.message);
    return false; // Handle the error and return false
  }
};