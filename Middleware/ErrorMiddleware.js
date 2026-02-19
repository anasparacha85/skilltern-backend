const errormiddleware=(err,req,res,next)=>{
    const status=err.status || 500;
   
    const FailureMessage=err.FailureMessage || 'another Failure error '
    return res.status(status).json({FailureMessage})
}
export default errormiddleware