import mongoose from "mongoose"
const CourseSchema=new mongoose.Schema({
    
CourseCategory:{
    type:String,
    required:true
},
CourseName:{
    type:String,
    required:true
},
CoursePic:{
    type:String,
    required:true,
    default:""
},
CourseDescription:{
type:String,
required:true
}
,
StudentsEnrolled:{
    type:Number,

},
CoursePrice:{
    type:Number,

},
CoursePreviewVideo:{
    type:String,
    default:""
},
CourseContent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], 


},{timestamps:true})

const CourseModal=new mongoose.model('Course',CourseSchema)

export default CourseModal