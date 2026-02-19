import mongoose from 'mongoose';
import { type } from 'os';
const EnrollmentSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true,


    },
    PaymentStatus:{
        type:String,
        enum:['paid','not paid'],
        default:'not paid'

    }

})


const EnrollmentModel = mongoose.model("Enrollment", EnrollmentSchema);
export default EnrollmentModel;