const jwt = require("jsonwebtoken")

const generateRefreshToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_R_EXPIRE})
}
module.exports= {generateRefreshToken};