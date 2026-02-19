import { configDotenv } from 'dotenv'
import Stripe from 'stripe'
import CourseModal from '../Model/CoursesModal.js'
import EnrollmentModel from '../Model/EnrollmentModal.js'
import dotenv from 'dotenv'

configDotenv();
dotenv.config()
const stripe=Stripe(process.env.STRIPE_SECRET_KEY)

const createCheckoutSession=async(req,res)=>{
    try {
        const {courseId}=req.body;
        const user=req.user;
        const course=await CourseModal.findOne({_id:courseId});
        
        if(course.CoursePrice === 0 ||course.CoursePrice<=0){
            return res.status(400).json({FailureMessage:"This Course is Free"})
        }
        const Enrolled=await EnrollmentModel.findOne({student:user._id,course:courseId})
        if(Enrolled){
            return res.status(400).json({FailureMessage:"You are already enrolled in this course"})
        }
        const line_items=[
            {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:course.CourseName
                    },
                    unit_amount:course.CoursePrice*100
                },
                quantity:1,
            }
        ]
        const session= await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items,
            success_url:`${process.env.FRONT_END_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.FRONT_END_URL}/cancel`,
            customer_email:user.email,
            metadata:{
                userId:user._id.toString(),
                courseId:courseId,
            }
        })
        res.json({id:session.id})
    } catch (error) {
     console.error(error);
    res.status(500).json({ message: 'Stripe session creation failed' });
  }
}

export default createCheckoutSession