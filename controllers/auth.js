const { auth } = require("../middleware/auth");

exports.ensureAuth = (req,res,next)=>{
    auth(req,res,next);
}

