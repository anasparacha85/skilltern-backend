import mongoose from 'mongoose'

const AppliedEmployeesSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    } ,
    email:{
        type:String,
        required:true

    } ,
    phone: {
        type:String,
        required:true

    } ,
    cv: {
        type:String,
        required:true

    } ,
    qualifications: {
        type:String,
        required:true

    } ,
    experience: {
        type:Number,
        required:true

    } ,
    jobPosition: {
        type:String,
        required:true

    } ,
    expectedSalary: {
        type:Number,
        required:true

    } ,
    coverLetter: {
        type:String,
        required:true

    } ,
})

const AppliedEmployeesModal=new mongoose.model('AppliedEmployee',AppliedEmployeesSchema)
export default AppliedEmployeesModal