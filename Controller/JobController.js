import JobModal from "../Model/JobModal.js";

const PostJob = async (req, res) => {
  try {
    const { JobCategory, JobName, JobDescription, JobType, JobLocation, JobDuration } = req.body;

    // 🔹 Ensure `req.files` exists before accessing properties
    if (!req.files || !req.files.CategoryImage || !req.files.JobImage) {
      return res.status(400).json({ FailureMessage: "CategoryImage and JobImage are required!" });
    }

    const CategoryImage = req.files.CategoryImage[0].path;
    const JobImage = req.files.JobImage[0].path;

    // 🔹 Validate Required Fields
    if (!JobCategory || !JobName || !JobType || !JobImage || !CategoryImage) {
      return res.status(400).json({ FailureMessage: "Please fill all required fields!" });
    }

    // 🔹 Save Job in Database
    const newJob = await JobModal.create({
      JobCategory,
      CategoryImage,
      JobName,
      JobImage,
      JobType,
      JobDescription,
      JobLocation,
      JobDuration,
    });

    res.status(201).json({ SuccessMessage: "Job Posted Successfully", job: newJob });
  } catch (error) {
    console.error("Job post error:", error);
    res.status(500).json({ FailureMessage: "Internal Server Error" });
  }
};

const getJobsCategories=async(req,res)=>{
    try {
        const jobdata=await JobModal.aggregate([
            {
                $group:{
                    _id:"$JobCategory",
                    CategoryImage:{$first:"$CategoryImage"}
                }
            },
            {
                $project:{
                    _id:0,
                    JobCategory:"$_id",
                    CategoryImage:1
                }
            }
        ])
        res.status(200).json(jobdata)
        console.log('helloo');
        
    } catch (error) {
        res.status(500).json({FailureMessage:"Internal server error from jobs categories"})
        
    }
}
const getjobsbycategories=async(req,res)=>{
    try {
        let category = req.params.Category; // Decode %20 to space
        console.log("Received Category:", category); 

        const jobs = await JobModal.find({ JobCategory: category });
        
        
        res.status(200).json(jobs)
        console.log(jobs);
        
        
    } catch (error) {
      console.log("getjobsbycategories",error);
      
        res.status(500).json({FailureMessage:"Internal server error from get jobs by categories"})

        
    }
}

const getjobsbyid=async(req,res)=>{
  try {
    const id=req.params.id;
    const findjobnamebyid=await JobModal.findOne({_id:id});
    console.log(findjobnamebyid);
    
    res.status(200).json(findjobnamebyid)
  } catch (error) {
    res.status(500).json({FailureMessage:"Internal Server error from jobs by id"})
    console.log(error);
    
    
  }
}
const findjobs = async (req, res) => {
  try {
    const name = req.query.name || "FrontEnd Development"; // Debug ke liye default
    const type = req.query.type || "Part-time"; // Debug ke liye default

    console.log("Searching for:", name, type); // DEBUG: Console check

    const data = await JobModal.aggregate([
      {
        $match: {
          JobCategory: { $regex: name, $options: "i" }, // 👈 Partial + Case-insensitive
          JobType: { $regex: type, $options: "i" },
        }
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }], 
          jobs: [{ 
            $project: { 
              _id: 1, 
              JobName: 1, 
              JobCategory: 1, 
              JobType: 1, 
              JobDescription: 1 ,
              JobImage:1,
              CategoryImage:1,
              JobDuration:1

            } 
          }]
        }
      }
    ]);

    console.log("Aggregation Result:", JSON.stringify(data, null, 2)); // DEBUG: Console output

    if (!data || data.length === 0 || (data[0].totalCount.length === 0 && data[0].jobs.length === 0)) {
      return res.status(404).json({ FailureMessage: "No Jobs Found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Jobs find error", error);
    res.status(500).json({ FailureMessage: "Internal Server Error from Find Jobs", error });
  }
};


export default {
  PostJob ,getJobsCategories,getjobsbycategories,getjobsbyid,findjobs
}