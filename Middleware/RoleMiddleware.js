const RoleAccess=(role)=>{
    return async(req,res,next)=>{
        try {
            const AllowedAccess=req.user.role==role;
            if(!AllowedAccess){
                return res.status(401).json({FailureMessage:`UnAuthorized Access,User is not ${role}`})
            }
            next()  
        } catch (error) {
            next(error)
            
        }
        
    }
}

export default RoleAccess