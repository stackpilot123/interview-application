import userModel from "../../models/userModel.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import upload from "../../config/multerConfig.js";
import debug from "debug";
import jobPostingModel from "../../models/admin/jobPostingModel.js";

const log = debug("development:candidate");

const updateProfile = async (req, res) => {
    try {
        let { backstory, combatStyle, keyBattles, powers, preferredRole, teams, username, weaknesses } = req.body.formData;
        keyBattles = keyBattles.filter((item) => item !== "");
        powers = powers.filter((item) => item !== "");
        teams = teams.filter((item) => item !== "");
        weaknesses = weaknesses.filter((item) => item !== "");
        const user = await userModel.findById(req.id);
        if (!user) {
            res.status(404).send("User not found");
        }

        if (user.backstory !== backstory) user.backstory = backstory ? backstory : "";
        if (user.combatStyle !== combatStyle) user.combatStyle = combatStyle ? combatStyle : "";
        if (user.preferredRole !== preferredRole) user.preferredRole = preferredRole ? preferredRole : "";
        if (user.username !== username) user.username = username ? username : "";

        user.teams = teams ? teams : [""];
        user.keyBattles = keyBattles ? keyBattles : [""];
        user.powers = powers ? powers : [""];
        user.weakness = weaknesses ? weaknesses : [""];

        await user.save();
        return res.status(200).json({
            user: {
                backstory: user.backstory ? user.backstory : "",
                combatStyle: user.combatStyle ? user.combatStyle : "",
                keyBattles: user.keyBattles.length === 0 ? [""] : user.keyBattles,
                powers: user.powers.length === 0 ? [""] : user.powers,
                preferredRole: user.preferredRole ? user.preferredRole : "",
                teams: user.teams.length === 0 ? [""] : user.teams,
                username: user.username ? user.username : "",
                weaknesses: user.weakness.length === 0 ? [""] : user.weakness
            }

        })
    } catch (err) {
        log("error in updating the profile ", err.message);
        return res.status(500).send("Internal server error ");
    }
}

const uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required ");
        }

        const user = await userModel.findById(req.id);

        if (user.profilePicturePublicId && user.profilePicture) {
            await cloudinary.uploader.destroy(user.profilePicturePublicId);
        }
        const fileStr = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${fileStr}`;

        const result = await cloudinary.uploader.upload(
            dataUri,
            {
                folder: "WMC-mega-project"
            }
        );

        user.profilePicture = result.secure_url;
        user.profilePicturePublicId = result.public_id;
        await user.save();

        return res.status(200).json({
            message: "uploaded successfully",
            user: {
                profilePicture: user.profilePicture,
                profilePicturePublicId: user.profilePicturePublicId
            }
        })

    } catch (err) {
        log("error in uploading the profile pic: ", err.message);
        return res.status(500).send("Internal server error");
    }
}

const deleteProfilePic = async (req, res) => {
    try {
        const user = await userModel.findById(req.id);
        if (!user) {
            log("not usser");
            return res.status(404).send("User not found");
        }
        if (user.profilePicture && user.profilePicturePublicId) {
            await cloudinary.uploader.destroy(user.profilePicturePublicId);
        }

        user.profilePicture = null;
        user.profilePicturePublicId = null;
        await user.save();

        return res.status(200).send("Profile picture removed successfully");

    } catch (err) {
        log("error in removing the profilr pic : ", err.message);
        return res.status(500).send("Internal server error ");
    }
}

const getJob = async (req, res) => {
    try {
        if (!req.body.jobId) {
            return res.status(404).send("Job id not found");
        }

        const job = await jobPostingModel.findById(req.body.jobId);

        return res.status(200).json({
            job: job
        })
    } catch (err) {
        log("error in getting the job : ", err.message);
        return res.status(500).send("Internal server error");
    }

}

const uploadResume = async (req, res) => {
    try {
        if (req.role !== "candidate") {
            return res.status(401).send("You are not authorized");
        }

        const user = await userModel.findById(req.id);
        const job = await jobPostingModel.findById(req.body.jobId);



        if (!job) {
            return res.status(404).send("Job not found");
        }

        if (!req.file && !req.body.resumeText) {
            job.candidatesApplied.push({ user: user._id });
            user.appliedJobs.push({ job: job._id });
        }
        else if (req.file) {
            console.log("file case");
            const fileStr = req.file.buffer.toString("base64");
            const dataUri = `data:${req.file.mimetype};base64,${fileStr}`;


            const result = await cloudinary.uploader.upload(
                dataUri,
                {
                    resource_type: "raw",
                    folder: "WMC-mega-project"
                }
            );
            if (!req.body.resumeText) {
                job.candidatesApplied.push({ user: user._id, resumeFile: result.secure_url });
                user.appliedJobs.push({
                    job: job._id, resume: {
                        resumeFile: result.secure_url
                    }
                })
            } else {
                job.candidatesApplied.push({ user: user._id, resumeFile: result.secure_url, resumeText: req.body.resumeText });
                user.appliedJobs.push({
                    job: job._id, resume: {
                        resumeFile: result.secure_url,
                        resumeText: req.body.resumeText
                    }
                })
            }

        }
        else if (!req.file && req.body.resumeText) {
            job.candidatesApplied.push({ user: user._id, resumeText: req.body.resumeText });
            user.appliedJobs.push({ job: job._id, resume: { resumeText: req.body.resumeText } });
        }
        await job.save();
        await user.save();
        return res.status(200).send("applied for the job successfull");
    } catch (err) {
        log("error in applying the job ", err.message);
        return res.status(500).send("Internal server error ");
    }

}

const getAppliedJobs = async (req, res) => {
    try {
        if (req.role !== "candidate") {
            return res.status(401).send("You are not authorized ");
        }

        const user = await userModel.findById(req.id).populate("appliedJobs.job");

        return res.status(200).json({
            appliedJobs: user.appliedJobs
        })
    } catch (err) {
        log("error in getting applied jobs ", err.message);
        return res.status(500).send("Internal server error");
    }

}

const getAllActiveJobs = async (req, res) => {
    try {
        const jobs = await jobPostingModel.find();
        const isActive = (deadline) => {
            const now = new Date();
            const jobDeadline = new Date(deadline);
            return jobDeadline >= now;
        };

        const activeJobs = jobs.filter((job)=>isActive(job.deadline));
        return res.status(200).json({
            activeJobs
        })
    } catch (err) {
        log("error in get all active jobs : ", err.message);
        return res.status(500).send("Internal server error ");
    }
}

const checkChatEnabled = async(req,res)=>{
    try{
        const user = await userModel.findById(req.id);
        
        if(user.appliedJobs.length === 0 || user.appliedJobs === null || user.appliedJobs === undefined){
            return res.status(200).json({
                message:"You haven’t applied for any jobs yet. Apply to a job to unlock the ability to chat with Doom and his forces.",
                isChatEnabled: false
            });
        } else {
            const isChatEnabled = user.appliedJobs.some((item)=>{
                return item.status === "accepted";
            });
            
            if(isChatEnabled){
                return res.status(200).json({
                    isChatEnabled: true 
                });
            }
            return res.status(200).json({
                    message: "You have not been selected by Doom yet. Only those who are right-swiped will be able to chat and proceed with the interview process.",
                    isChatEnabled: false
                });
        }
    } catch(err){
        log("error in checking whether the chat is anabled or not : ",err.message);
        return res.status(500).send("Internal server eror");
    }

}

export { updateProfile, uploadProfilePic, deleteProfilePic, getJob, uploadResume, getAppliedJobs, getAllActiveJobs, checkChatEnabled };