import EmployeeModal from "../Model/AppliedEmlpoyeesModel.js";
import jobmodal from "../Model/JobModal.js";
import InstructorModal from "../Model/InstructorModal.js";
import User from "../Model/UserModal.js";
import transporter from "../Middleware/transporter.js";
import EnrollmentModel from "../Model/EnrollmentModal.js";

const ViewJobApplications = async (req, res) => {
  try {
    const FindData = await EmployeeModal.find();
    if (!FindData) {
      return res.status(400).json({ FailureMessage: "No Users Applied" });
    }
    res.status(200).json(FindData);
  } catch (error) {
    console.log("Internal Server Error jobapplictionvew", error);
    res.status(500).json({ FailureMessage: "Internal Server Error ", error });
  }
};

const deletejob = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedjob = await jobmodal.deleteOne({ _id: id });
    if (!deletedjob) {
      return res.status(400).json({ FailureMessage: "Job not Deleted" });
    }
    res.status(200).json({ SuccessMessage: "Job Deleted Successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ FailureMessage: "Internal Server Error" });
  }
};
const AppliedInstructors = async (req, res) => {
  try {
    const finddta = await InstructorModal.find();
    if (!finddta) {
      return res
        .status(400)
        .json({ FailureMessage: "No Instructors Application Available" });
    }
    res.status(200).json(finddta);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ FailureMessage: "Internal Server Error" });
  }
};

const alljobs = async (req, res) => {
  try {
    const jobsdta = await jobmodal.find();
    if (!jobsdta) {
      return re.status(400).json({ FailureMessage: "No Jobs Found" });
    }
    console.log(jobsdta);

    res.status(200).json(jobsdta);
  } catch (error) {
    console.log(error);

    res.status(500).json({ FailureMessage: "Internal Server Error" });
  }
};

const makeInstructor = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);
    const finduser = await User.findOne({ email: email });
    if (finduser.Instructor && finduser.InstructorStatus == "active") {
      return res
        .status(400)
        .json({ FailureMessage: "The User is Already a Instructor" });
    }
    const updateuser = await User.updateOne(
      { email: email },
      { $set: { Instructor: true, InstructorStatus: "active" } }
    );

    const findupdateduser = await User.findOne({ email: email });

    if (!findupdateduser) {
      return res.status(401).json({ FailureMessage: "No user found" });
    }
    const updateInstructor = await InstructorModal.updateOne(
      { email: findupdateduser.email },
      { $set: { status: "active" } }
    );
    if (!updateuser || !updateInstructor) {
      return res
        .status(401)
        .json({ FailureMessage: "Instructor status not updated" });
    }
    const info = await transporter.sendMail({
      from: "'AnasInternee.pk' <amiranas761@gmail.com>",
      to: email,
      subject: `Instructor Application Accepted`,
      html: `<p>Dear ${findupdateduser.name}, <br>We hope you are doing well. We are pleased to inform you that  We have Accepted Your Application and now Your Are The instructor of AnasInternee.pk You Can visit the Website to Upload Courses</p>`,
    });
    if (info.messageId) {
      const findinstructor = await InstructorModal.find();
      res
        .status(200)
        .json({
          SuccessMessage: "Instructor status updated successfully",
          findinstructor,
        });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ FailureMessage: "Internal Server Error" });
  }
};

const removeinstructor = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);
    const finduser = await User.findOne({ email: email });
    if (finduser.Instructor && finduser.InstructorStatus == "pending") {
      return res
        .status(400)
        .json({ FailureMessage: "The User is not a Instructor" });
    }
    const updateuser = await User.updateOne(
      { email: email },
      { $set: { Instructor: false, InstructorStatus: "pending" } }
    );

    const findupdateduser = await User.findOne({ email: email });

    if (!findupdateduser) {
      return res.status(401).json({ FailureMessage: "No user found" });
    }
    const updateInstructor = await InstructorModal.updateOne(
      { email: findupdateduser.email },
      { $set: { status: "pending" } }
    );
    if (!updateuser || !updateInstructor) {
      return res
        .status(401)
        .json({ FailureMessage: "Instructor status not updated" });
    }
    const findinstructor = await InstructorModal.find();
    res
      .status(200)
      .json({
        SuccessMessage: "Instructor status updated successfully",
        findinstructor,
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({ FailureMessage: "Internal Server Error" });
  }
};
const getAllUsers=async(req,res)=>{
    try {
        const users=await User.find();
        if(users.length==0){
            return res.status(400).json({FailureMessage:"No Users Found"})
        }
        res.status(200).json(users)

    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server error",Message:error.message})
    }
}
const ToggleActivate=async(req,res)=>{
    try {
    
      
      let updatedUsers
        const {userId,Action}=req.body;
        console.log(Action);
        
        const userdata=await User.findOne({_id:userId})
        if(Action=="Activate"){
         await  User.updateOne({_id:userdata._id},{$set:{Status:"Activated"}})
        res.status(200).json({SuccessMessage:"User has been Activated"})
      
         
        }
        if(Action=="DeActivate"){
            await  User.updateOne({_id:userdata._id},{$set:{Status:"DeActivated"}})
        res.status(200).json({SuccessMessage:"User has been DeActivated"})
      

        }
        
    } catch (error) {
      console.log(error);
      
       res.status(500).json({FailureMessage:"Internal Server error",Message:error.message})
        
    }
}

const GetEnrolledStudents=async(req,res)=>{
  try {
    const enrolledstudentsdata=await EnrollmentModel.find().populate('student').populate('course')
    if(enrolledstudentsdata.length==0){
      return res.status(400).json({FailureMessage:"No Students Enrolled"})
    }
    res.status(200).json(enrolledstudentsdata)
  } catch (error) {
    console.log(error);
    res.status(500).json({FailureMessage:"Internal Server Error",error:error.message})
    
    
  }
}

const getRoles=async(req,res)=>{
  try {
    const roles=await User.distinct('role');
    res.status(200).json(roles)
  } catch (error) {
    res.status(500).json({FailureMessage:"Internal Server Error"})
    
  }
}

const ChangeRole=async(req,res)=>{
  try {
    console.log(req.user._id);
    
    const {Role,userId}=req.body;
    const user=await User.findOne({_id:userId});
    if(user.role==Role){
      return res.status(400).json({FailureMessage:`${user.name}  is Already an ${Role}`})
    }
    await User.updateOne({_id:userId},{$set:{role:Role,Instructor:true,InstructorStatus:'active'}})
    res.status(200).json({SuccessMessage:"Role has been changed Successfully"})
  } catch (error) {
    console.log("Error from Change Role",error);
    
    res.status(500).json({FailureMessage:"Internal Server Error"})
    
  }

}
export default {
  ViewJobApplications,
  deletejob,
  AppliedInstructors,
  alljobs,
  makeInstructor,
  removeinstructor,
  getAllUsers,
  ToggleActivate,
  GetEnrolledStudents,
  getRoles,
  ChangeRole
};
