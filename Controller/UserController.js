import bcrypt from 'bcrypt'
import UserModal from '../Model/UserModal.js';

const getUserProfile=async(req,res)=>{
    try {
        const user=req.user;
        const data=await UserModal.findOne({email:user.email},{password:0})
        if(!data){
return res.status(400).json({FailureMessage:"User profile not found Not Found"})
        }
        console.log("user profile data");
        
        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({SuccessMessage:"Internal Server Error from User Profile"})
        console.log("user profile error",error);
        
        
    }
}

const updateUserProfile=async(req,res)=>{
    try {
        const {FirstName,LastName,Age,BioGraphy,Linkedin,Facebook,Instagram}=req.body;
       
        console.log(FirstName,Age,BioGraphy,Linkedin);
        const name=FirstName.concat(" "+LastName);
        
        const user=req.user;
        console.log(user);
        
        const updateddata=await UserModal.updateOne({email:user.email},{$set:{name:name,Age:Age,BioGraphy:BioGraphy,Linkedin:Linkedin,Facebook:Facebook,Instagram:Instagram}})
        
        if(!updateddata){
            return res.status(400).json({FailureMessage:"Profile Not Updated"})
        }
        console.log(updateddata);
        const finddata=await UserModal.findOne({email:user.email},{password:0})
        res.status(200).json({SuccessMessage:"Profile Updated Successfully ",finddata})
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Error from UpdatedUserProfile"})
    }
}
const UpdateUserpassword=async(req,res)=>{
    try {
        const {email,password,NewPassword,ConfirmNewPassword}=req.body;
        const user=req.user;
        const compare=await user.comparePassword(password)
        if(!compare){
            return res.status(401).json({FailureMessage:"Please Write Correct Old Password!"})
        }
        if(NewPassword!=ConfirmNewPassword){
            return res.status(401).json({FailureMessage:" Re-Typed same New Password!"})
        }
        const gensalt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(NewPassword,gensalt);
        const data=await UserModal.updateOne({email:user.email},{$set:{email:email,password:hashedpassword}});
        if(!data){
            res.status(400).json({SuccessMessage:"Credentials Not updated successfully!"})
        }
        const updateddata=await UserModal.findOne({email:email},{password:0})
        res.status(200).json({SuccessMessage:"Credentials updated successfully!",updateddata})

    } catch (error) {
        res.status(500).json({FailureMessage:"Internal server error from update password"})
        console.log(error);
        
        
    }
}

const UpdateProfilePicture=async(req,res)=>{
    try {
        const file=req.file;
        console.log("photo",file);
        
        if(!file){
            return res.status(401).json({FailureMessage:"Inavlid file types only jpg,png,jpeg allowed"})
        }
        const user=req.user;
        const updatephoto=await UserModal.updateOne({email:user.email},{$set:{profilePicture:req.file.path}})
        const finddata=await UserModal.findOne({email:user.email})
        if(!updatephoto){
            return res.status(400).json({FailureMessage:"Can't Upload Profile Picture"})
        }
         res.status(200).json({SuccessMessage:"Profile picture has been uploaded successfully",finddata})
    } catch (error) {
        console.log('user photo',error);
        res.status(500).json({FailureMessage:"Internal Server Error from Update profilepic"})
      
        
        
    }
}


export default{
    getUserProfile,updateUserProfile,UpdateUserpassword,UpdateProfilePicture
}