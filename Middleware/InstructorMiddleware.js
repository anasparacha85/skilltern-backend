const InstructorMiddleware=async(req,res,next)=>{
    try {
        const Instructor=req.user.Instructor;
    if(!Instructor){
        return res.status(401).json({FailureMessage:"UnAuthorized Access Not Provided"})
    }
    next()
    } catch (error) {
       next(error) 
    }
    

}
export default InstructorMiddleware