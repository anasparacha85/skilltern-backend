import AppliedEmployeesModal from "../Model/AppliedEmlpoyeesModel.js";
import nodemailer from "nodemailer";
import JobModal from "../Model/JobModal.js";
import transporter from "../Middleware/transporter.js";

const ApplyEmplooyee = async (req, res) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return res
        .status(400)
        .json({
          FailureMessage: "Invalid File Type Only PDFs or DOCS are allowed",
        });
    }
    const {
      name,
      email,
      phone,

      qualifications,
      experience,
      jobPosition,
      expectedSalary,
      coverLetter,
    } = req.body;
    console.log("Job Application Received:", {
      name,
      email,
      phone,
      qualifications,
      experience,
      jobPosition,
      expectedSalary,
      coverLetter,
      cvPath: req.file.path,
    });
    const findjobtype = await JobModal.findOne({ JobName: jobPosition });

    const info = await transporter.sendMail({
      from: "'SkillTern' <amiranas761@gmail.com>",
      to: email,
      subject: `${jobPosition} ${findjobtype.JobType} Application Viewed`,
      html: `<p>Dear ${name}, <br>We hope you are doing well. We are pleased to inform you that we have successfully received your application for the ${jobPosition} position at <strong>Anas Internee.pk</strong>. We truly appreciate the time and effort you put into submitting your application and sharing your qualifications with us.
Our recruitment team is currently reviewing all applications to ensure we select the most suitable candidates for the next stage of the hiring process. If your profile matches our requirements, we will reach out to you with further details regarding the next steps. This may include an interview or additional assessments to better understand your skills and experience.
We understand how important this opportunity is for you, and we appreciate your patience during our review process. If you do not hear from us immediately, please rest assured that we are carefully considering every application and will provide an update as soon as possible.
In the meantime, if you have any questions or need to update any information related to your application, please feel free to reach out to us at amiranas761@gmail.com.<br>
Thank you once again for your interest in joining <strong>Anas Internee.pk</strong>. We look forward to the possibility of working together and wish you the best of luck in the hiring process.</p>`,
    });
    if (info.messageId) {
      const UploadEmployees = await AppliedEmployeesModal.create({
        name,
        email,
        phone,
        qualifications,
        experience,
        jobPosition,
        expectedSalary,
        coverLetter,
        cv: req.file.path,
      });
      res
        .status(201)
        .json({
          SuccessMessage: "Application submitted successfully!",
          UploadEmployees,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ FailureMessage: "Internal Server Error from Applied Employees" });
    console.log("job application error",error);
  }
};

export default ApplyEmplooyee;
