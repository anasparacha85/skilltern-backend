import dotenv from "dotenv";
dotenv.config();

import { networkInterfaces } from "os";
import cron from "node-cron";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import Stripe from "stripe";
import connectdb from "./utils/db.js";

import AuthRouter from "./Router/AuthRouter.js";
import AdminRouter from "./Router/AdminRouter.js";
import JobRouter from "./Router/JobRouter.js";
import errormiddleware from "./Middleware/ErrorMiddleware.js";
import UserRouter from "./Router/UserRouter.js";

import CourseRouter from "./Router/CourseRouter.js";
import InstructorRouter from "./Router/InstructorRouter.js";
import StripeRouter from "./Router/StripeRouter.js";

import Enrollment from "./Model/EnrollmentModal.js";

import "./Config/passport.js";
import "./Middleware/MulterMiddleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const server = express();


// Stripe webhook
server.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.WEBHOOK_SECRET_KEY
      );
    } catch (error) {
      console.log("webhook error ", error);
      return res.status(400).json({ FailureMessage: `webhook error ${error}` });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, courseId } = session.metadata;

      try {
        const EnrolledStatus = await Enrollment.findOne({
          student: userId,
          course: courseId,
        });
        if (EnrolledStatus) {
          return res.status(400).json({
            FailureMessage: "You are Already enrolled in this course",
          });
        }

        const Enroll = await Enrollment.create({
          student: userId,
          course: courseId,
          PaymentStatus:'paid'
        });
        console.log("Enrollment successful");

        return res
          .status(200)
          .json({ SuccessMessage: "Student Enrolled Successfully", Enroll });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          FailureMessage: "Internal Server Error",
          error: error.message,
        });
      }
    }
  }
);

server.use(cors());
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(express.urlencoded({ extended: true }));
server.get('/',(req,res)=>{
  res.status(200).json({Message:"server is Running"})

})
server.use("/api/courses", CourseRouter);
server.use("/Api/Auth", AuthRouter);
server.use("/api/jobs", JobRouter);
server.use("/api/user", UserRouter);
server.use("/api/admin", AdminRouter);
server.use("/api/instructor", InstructorRouter);
server.use("/api/stripe", StripeRouter);

server.use(errormiddleware);

const PORT = process.env.PORT || 5000;
// connectdb();

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled cron job at midnight...");
});

// server.listen(PORT, "0.0.0.0", () => {
//   function getServerIp() {
//     const networkInterf = networkInterfaces();
//     for (const interfaceName in networkInterf) {
//       const interf = networkInterf[interfaceName];
//       for (const alias of interf) {
//         if (alias.family === "IPv4" && !alias.internal) {
//           return alias.address;
//         }
//       }
//     }
//     return "Unknown IP";
//   }
//   console.log(`Server is running on http://${getServerIp()}:${PORT}`);
// });
connectdb().then(()=>{
    server.listen(PORT,()=>{
      console.log("server started");
      
    })
})
