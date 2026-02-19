import jwt from 'jsonwebtoken'
const OTPMiddleware=async (req,res,next)=>{
    const token=req.header('Authorization')
    if(!token){
        return res.status(401).json({FailureMessage:"UnAuthorized Access Otp Token not provided"})
    }

try {
const verifiedtoken=jwt.verify(token,process.env.OTP_TOKEN)
req.token=verifiedtoken;
next()    
    
} catch (error) {
    next(error)
}
}
export default OTPMiddleware