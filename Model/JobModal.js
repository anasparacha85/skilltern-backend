import mongoose from "mongoose"
const JobSchema=new mongoose.Schema({
   
    JobCategory:{
        type:String,
        required:true
    },
    CategoryImage:{
        type:String,
        required:true
    },
    JobName:{
        type:String,
        required:true
    },
    JobImage:{
        type:String,
        required:true
    },
    JobDescription:{
        type:String,
      
    },
    JobType:{
        type:String,
     
    },
    JobDuration:{
        type:String,
       

    },
    JobLocation:{
        type:String,
        
    }


})

const JobModal=new mongoose.model('Job',JobSchema)
export default JobModal