import mongoose from "mongoose"
const InstructorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type: String
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+?[0-9]{10,15}$/, "Invalid phone number format"], // ✅ Regex validation
      },
      message:{
        type :String
      },
      document:{
        type:String

      },
      status:{
        type:String,
        enum:['none','active','pending']
       
      },
   
})

const InstructorModal=new mongoose.model('Instructor',InstructorSchema)
export default InstructorModal