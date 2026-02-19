import Courses from '../Model/CoursesModal.js'
import Lessons from '../Model/LessonModal.js'
import Enrollment from '../Model/EnrollmentModal.js'
import Favorites from '../Model/FavouritesModel.js';

const uploadCourses=async(req,res)=>{
    try {
        console.log(req.body);
        
        const { CourseName, CourseCategory, CourseDescription, CoursePrice, CoursePic, CoursePreviewVideo, lessons } = req.body;
        const savedCourse=await Courses.create({CourseName,CourseCategory,CourseDescription,CoursePrice,CoursePic,CoursePreviewVideo})
        const lessondocs=lessons.map((value,ind)=>({
            ...value,
            course:savedCourse._id
        }))
        const savedLessons=await Lessons.insertMany(lessondocs)
        savedCourse.CourseContent=savedLessons.map((l)=>l._id)
        await savedCourse.save()
        console.log(savedCourse);
        
        res.status(201).json({ message: "Course uploaded!", course: savedCourse });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
     
        // https://github.com/anasparacha85/SKillTern#
    }
}

const getAllCourses=async(req,res)=>{
    try {
        const coursesdata=await Courses.find()
        if(!coursesdata){
return res.status(401).json({FailureMessage:"No Courses Available"})
        }
        res.status(200).json(coursesdata)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Interner Server Error",error:error.message})

        
    }
}
const getcoursebyid=async(req,res)=>{
    try {
        const Course=await Courses.findOne({_id:req.params.id}).populate('CourseContent')
        if(!Course){
            return res.status(401).json({FailureMessage:"No prodcts details avaialbel"})
        }
        const relatedcourses=await Courses.find({CourseCategory:Course.CourseCategory})
        res.status(200).json({Course,relatedcourses})
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Erorr",error:error.message})
    }

}
const addlessonsbycourseid=async(req,res)=>{
    try {
        const {title,videoURL}=req.body;
        console.log(title,"",videoURL);
        
        const searchcourse=await Courses.findOne({_id:req.params.id})
        console.log(searchcourse);
        
        if(!searchcourse){
            return res.status(400).json({FailureMessage:"No Courses found"})
        }
       
        //  const findLessons=await Lessons.find();
        //  console.log(findLessons);
        // const fc=await Courses.findOne({_id:req.params.id}).populate('CourseContent');
        // console.log(fc);
        
        const savelesson=await Lessons.create({course:searchcourse._id,title:title,videoUrl:videoURL})
        searchcourse.CourseContent.push(savelesson._id);
        await searchcourse.save()
            res.status(200).json({SuccessMessage:"Lessons Uploaded Successfully",savelesson})
        
        
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({FailureMessage:"Internal Server Error",error:error.message})
        
    }

}

const enrolledStudent=async(req,res)=>{
try {
    const user=req.user;
    const id=req.params.id;
  if(!user){
    return res.status(400).json({FailureMessage:"User is not Authorized"})
  }
  if(!id){
    return res.status(400).json({FailureMessage:"Course id not correct"})
  }
  const findenrolleddata=await Enrollment.findOne({student:user._id,course:id})
  if(findenrolleddata){
    return res.status(401).json({FailureMessage:"You are Already Enrolled in this course" })
  }
  const enrolleddata=await Enrollment.create({student:user._id,course:id})
  res.status(200).json({SuccessMessage:"Student Enrolled SuccessFully",enrolleddata})
} catch (error) {
    console.log(error);
    
    res.status(500).json({FailureMessage:"Internal Server Error",error:error.message})
}
}

const getEnrolledCourses=async(req,res)=>{
    try {
        const user=req.user;
        const EnrolledCourseData=await Enrollment.find({student:user._id}).populate('course')
        if(!EnrolledCourseData){
            return res.status(400).json({FailureMessage:"No Courses Enrolled"})
        }
        res.status(200).json({EnrolledCourseData})
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Error",error:error.message})
        
    }
}

const CoursesCount = async (req, res) => {
        try {
            const courses = await Courses.aggregate([
                  {
                    $lookup: {
                            from: "lessons", // Ensure this is your actual collection name
                            localField: "_id",
                            foreignField: "course", // Field in lessons referencing course _id
                            as: "CourseContent"
                        }
                    },
                    {
                        $addFields: {
                            lessonCount: { $size: "$CourseContent" } // Correcting syntax
                        }
                    },
                    {
                        $project: {
                            CourseContent: 0 // Hiding lesson details, keeping only count
                        }
                    }
                ]);
        
                if (!courses.length) { // Checking if courses exist
                    return res.status(400).json({ FailureMessage: "No Courses Found" });
                }
        
                // console.log(courses);
                res.status(200).json(courses);
            } catch (error) {
                console.log(error);
                res.status(500).json({ FailureMessage: "Internal Server Error", error: error.message });
    }
 };
        
const CourseCountbbyName= async (req,res)=>{
    try {
        const CourseName=req.query.CourseName;
        const courses=await Courses.aggregate([
            {
                $match:{
                    CourseName:{$regex:new RegExp(`^${CourseName}$`,"i")}

                }
            },
            {
                $lookup:{
                    from:'lessons',
                    localField:'_id',
                    foreignField:'course',
                    as:'CourseContent'
                }
            },
            {
                $addFields:{
                    lessonCount:{$size:'$CourseContent'}

            }
        },
        {
            $project:{
                CourseContent:0
            }
        }
        ])
        if (!courses.length) { // Checking if courses exist
            return res.status(400).json({ FailureMessage: "No Courses Found" });
        }

        console.log("name",courses);
        res.status(200).json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ FailureMessage: "Internal Server Error", error: error.message });
}    
}
        
       
const CourseCountbbyCategory= async (req,res)=>{
    try {
        const CourseCategory=req.query.CourseCategory;
        const courses=await Courses.aggregate([
            {
                $match:{
                    CourseCategory:{$regex:new RegExp(`^${CourseCategory}$`,"i")}

                }
            },
            {
                $lookup:{
                    from:'lessons',
                    localField:'_id',
                    foreignField:'course',
                    as:'CourseContent'
                }
            },
            {
                $addFields:{
                    lessonCount:{$size:'$CourseContent'}

            }
        },
        {
            $project:{
                CourseContent:0
            }
        }
        ])
        if (!courses.length) { // Checking if courses exist
            return res.status(400).json({ FailureMessage: "No Courses Found" });
        }

        console.log("category",courses);
        res.status(200).json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ FailureMessage: "Internal Server Error", error: error.message });
}    
}
        
const DeleteCourses=async(req,res)=>{
    try {
        const findCourse=await Courses.findOne({_id:req.params.id})
        if(!findCourse){
            return res.status(400).json({FailureMessage:"Course ALready Deleted  "})
        }
        const deletecourse=await Courses.deleteOne({_id:req.params.id});
        const deleteLessons=await Lessons.deleteMany({course:req.params.id})
        const deleteENrollment=await Enrollment.deleteOne({course:req.params.id})
         res.status(200).json({SuccessMessage:"Courses Deleted Successfully"})


    } catch (error) {
        console.log(error);
        res.status(500).json({FailureMessage:"Internal Server Error",error:error.message})
        
        
    }
}

const AddFavourites=async(req,res)=>{
    try {
        const user=req.user;

        const id=req.params.id;
if(!user){
    return res.status(401).json({SuccessMessage:"User is not Authorized"})
}
const findfav=await Favorites.findOne({user:user._id,course:id})
console.log(findfav);



if(findfav){
    return res.status(400).json({FailureMessage:"Course Already Added to Favorites"})
}
        const findCOurse=await Courses.findOne({_id:id})
        if(!findCOurse){
            return res.status.json({FailureMessage:"No Courses Found"})
        }
      
        const AddtoFav=await Favorites.create({user:user._id,course:findCOurse._id})
        if(!AddtoFav){
            return res.status(400).json({FailureMessage:"Not Added to Favorites"})
        }
        res.status(200).json({SuccessMessage:"COurse Added to Favorites Successfully"})
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Error"})
        
    }
}

const RemoveFavourites=async(req,res)=>{
    try {
        const user=req.user;

        const id=req.params.id;
if(!user){
    return res.status(401).json({SuccessMessage:"User is not Authorized"})
}
const findfav=await Favorites.findOne({user:user._id,course:id})


if(!findfav){
    return res.status(400).json({FailureMessage:"Course Already removed to Favorites"})
}
        const findCOurse=await Courses.findOne({_id:id})
        if(!findCOurse){
            return res.status.json({FailureMessage:"No Courses Found"})
        }
        const AddtoFav=await Favorites.deleteOne({user:user._id})
        if(!AddtoFav){
            return res.status(400).json({FailureMessage:"Not Added to Favorites"})
        }
        res.status(200).json({SuccessMessage:"Course removed from Favorites Successfully"})
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Error"})
        
    }
}
const getAllFavourites=async(req,res)=>{
    try {
        const user=req.user;
        const data=await Favorites.find({user:user._id},{user:0}).populate('course')
        if(!data){
            return res.status(400).json({FailureMessage:"No Courses are Added to Favorites"})
        }
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Error"})
        
    }
}

export default {
    uploadCourses,
    getAllCourses,
    getcoursebyid,
    addlessonsbycourseid,
    enrolledStudent,
    getEnrolledCourses,
    CoursesCount,
    CourseCountbbyName,
    CourseCountbbyCategory,
    DeleteCourses,
    AddFavourites,
    RemoveFavourites,
    getAllFavourites
}