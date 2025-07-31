import userModel from "../../models/userModel.js";
import jobModel from "../../models/admin/jobPostingModel.js";
import debug from "debug";
import jobPostingModel from "../../models/admin/jobPostingModel.js";

const log = debug("development:adminControllers");

const jobPosting = async (req, res) => {
    try {
        const { title, description, requiredPowers, experienceLevel, location, deadline, openings, visibility } = req.body.form;
        if (req.role !== "admin") {
            return res.status(401).send("You are not authorized");
        }

        if (!title || !description || !requiredPowers || !experienceLevel || !location || !deadline || !openings || visibility === undefined
        ) {
            return res.status(400).send("All required fields must be provided.");
        }

        const raritys = ["legendary", "epic", "rare", "common"];
        const randIdx = Math.floor(Math.random() * 4);

        const job = await jobModel.create({ title, description, requiredPowers, experienceLevel, location, deadline, openings, visibility, rarity: raritys[randIdx] });



        return res.status(200).send("Job posted successfully!");
    } catch (err) {
        log("error in creating the job: ", err.message);
        return res.status(500).send("Internal server error");
    }

};

const displayJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find();

        return res.status(200).json({
            jobs
        });

    } catch (err) {
        log("error in display all the jobs : ", err.message);
        return res.status(500).send("Internal server error ");
    }
};

const getJobApplications = async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(401).send("You are not authorized");
        }

        const nonEmptyCandidatesQuery = {
            candidatesApplied: { $exists: true, $not: { $size: 0 } }
        };

        const jobs = await jobPostingModel.find(nonEmptyCandidatesQuery).populate({
            path: "candidatesApplied.user",
            select: 'username fullName backstory combatStyle keyBattles powers preferredRole teams weakness profilePicture'
        });

        jobs.forEach((job) => {
            job.candidatesApplied = job.candidatesApplied.filter((item) => item.status === "pending");
        });

        return res.status(200).json({
            jobData: jobs ? jobs : []
        });
    } catch (err) {
        log("error in get job applications: ", err.message);
        return res.status(500).send("Internal server error ");
    }

};

//accept
const applicationRightSwipe = async (req, res) => {
    try {
        const { jobId, userId, resumeFile, resumeText, status } = req.body;
        if (!jobId || !userId) {
            return res.status(400).send("job Id and user Id are required ");
        }
        if (req.role !== "admin") {
            return res.status(401).send("You are not authorized ");
        }

        const admin = await userModel.findById(req.id);
        const appliedUser = await userModel.findById(userId);
        const job = await jobPostingModel.findById(jobId);

        const appliedJob = appliedUser.appliedJobs.find((item) => item.job.equals(jobId));
        appliedJob.status = "accepted";
        await appliedUser.save();

        const thisUser = job.candidatesApplied.find((item) => item.user.equals(userId));
        thisUser.status = "accepted";
        await job.save();

        const item = admin.shortlistedCandidates.find((item) => item.user.equals(userId));

        if (!resumeFile && !resumeText) {
            if (item) {
                item.jobs.push({ job: jobId });
            } else {
                admin.shortlistedCandidates.push({ user: userId, jobs: [{ job: jobId }] });
            }
        }
        else if (resumeFile && resumeText) {
            if (item) {
                item.jobs.push({ job: jobId, resumeFile: resumeFile, resumeText: resumeText });
            } else {
                admin.shortlistedCandidates.push({ user: userId, jobs: [{ job: jobId, resumeFile: resumeFile, resumeText: resumeText }] });
            }
        } else if (resumeText && !resumeFile) {
            if (item) {
                item.jobs.push({ job: jobId, resumeText: resumeText });
            } else {
                admin.shortlistedCandidates.push({ user: userId, jobs: [{ job: jobId, resumeText: resumeText }] });
            }
        } else if (!resumeText && resumeFile) {
            if (item) {
                item.jobs.push({ job: jobId, resumeFile: resumeFile });
            } else {
                admin.shortlistedCandidates.push({ user: userId, jobs: [{ job: jobId, resumeFile: resumeFile }] });
            }
        }

        if (status === "saved") {
            admin.savedCandidates = admin.savedCandidates.filter((item) => !(item.user.equals(userId) && item.job.equals(jobId)));
        }

        await admin.save();
        return res.status(200).send("User application accepted successfully");
    } catch (err) {
        log("error in right swipe: ", err.message);
        return res.status(500).send("Internal server error ");
    }

};

//reject
const applicationLeftSwipe = async (req, res) => {
    try {
        const { jobId, userId, resumeFile, resumeText, status } = req.body;
        if (!jobId || !userId) {
            return res.status(400).send("job Id and user Id are required ");
        }
        if (req.role !== "admin") {
            return res.status(401).send("You are not authorized ");
        }

        const admin = await userModel.findById(req.id);
        const appliedUser = await userModel.findById(userId);
        const job = await jobPostingModel.findById(jobId);

        const appliedJob = appliedUser.appliedJobs.find((item) => item.job.equals(jobId));
        appliedJob.status = "rejected";
        await appliedUser.save();

        const thisUser = job.candidatesApplied.find((item) => item.user.equals(userId));
        thisUser.status = "rejected";
        await job.save();

        if (status === "saved") {
            admin.savedCandidates = admin.savedCandidates.filter((item) => !(item.user.equals(userId) && item.job.equals(jobId)));
        }

        await admin.save();

        return res.status(200).send("User application rejected successfully");
    } catch (err) {
        log("error in left swipe: ", err.message);
        return res.status(500).send("Internal server error ");
    }
};

//like
const applicationUpSwipe = async (req, res) => {
    try {
        const { jobId, userId, resumeFile, resumeText } = req.body;
        if (!jobId || !userId) {
            return res.status(400).send("job Id and user Id are required ");
        }
        if (req.role !== "admin") {
            return res.status(401).send("You are not authorized ");
        }

        const admin = await userModel.findById(req.id);
        const appliedUser = await userModel.findById(userId);
        const job = await jobPostingModel.findById(jobId);

        const appliedJob = appliedUser.appliedJobs.find((item) => item.job.equals(jobId));
        appliedJob.status = "accepted";
        await appliedUser.save();

        const thisUser = job.candidatesApplied.find((item) => item.user.equals(userId));
        thisUser.status = "accepted";
        await job.save();

        const item = admin.likedCandidates.find((item) => item.user.equals(userId));

        if (!resumeFile && !resumeText) {
            if (item) {
                item.jobs.push({ job: jobId });
            } else {
                admin.likedCandidates.push({ user: userId, jobs: [{ job: jobId }] });
            }
        }
        else if (resumeFile && resumeText) {
            if (item) {
                item.jobs.push({ job: jobId, resumeFile: resumeFile, resumeText: resumeText });
            } else {
                admin.likedCandidates.push({ user: userId, jobs: [{ job: jobId, resumeFile: resumeFile, resumeText: resumeText }] });
            }
        } else if (resumeText && !resumeFile) {
            if (item) {
                item.jobs.push({ job: jobId, resumeText: resumeText });
            } else {
                admin.likedCandidates.push({ user: userId, jobs: [{ job: jobId, resumeText: resumeText }] });
            }
        } else if (!resumeText && resumeFile) {
            if (item) {
                item.jobs.push({ job: jobId, resumeFile: resumeFile });
            } else {
                admin.likedCandidates.push({ user: userId, jobs: [{ job: jobId, resumeFile: resumeFile }] });
            }
        }


        await admin.save();

        return res.status(200).send("User application liked successfully");
    } catch (err) {
        log("error in right swipe: ", err.message);
        return res.status(500).send("Internal server error ");
    }
};

//save
const applicationDownSwipe = async (req, res) => {
    try {
        const { jobId, userId, resumeFile, resumeText } = req.body;
        if (!jobId || !userId) {
            return res.status(400).send("job Id and user Id are required ");
        }
        if (req.role !== "admin") {
            return res.status(401).send("You are not authorized ");
        }

        const admin = await userModel.findById(req.id);
        const appliedUser = await userModel.findById(userId);
        const job = await jobPostingModel.findById(jobId);

        const appliedJob = appliedUser.appliedJobs.find((item) => item.job.equals(jobId));
        appliedJob.status = "savedPending";
        await appliedUser.save();

        const thisUser = job.candidatesApplied.find((item) => item.user.equals(userId));
        thisUser.status = "savedPending";
        await job.save();

        if (!resumeFile && !resumeText) {
            admin.savedCandidates.push({ user: userId, job: jobId });
        }
        else if (resumeFile && resumeText) {
            admin.savedCandidates.push({ user: userId, job: jobId, resume: { resumeFile: resumeFile, resumeText: resumeText } });
        } else if (resumeText && !resumeFile) {
            admin.savedCandidates.push({ user: userId, job: jobId, resume: { resumeText: resumeText } });
        } else if (!resumeText && resumeFile) {
            admin.savedCandidates.push({ user: userId, job: jobId, resume: { resumeFile: resumeFile } });
        }

        await admin.save();

        return res.status(200).send("User application saved successfully");
    } catch (err) {
        log("error in right swipe: ", err.message);
        return res.status(500).send("Internal server error ");
    }

};


//optimisation
const applicationSwipe = async (req, res) => {
    try {
        const { jobId, userId, resumeFile, resumeText, direction } = req.body;
        if (!jobId || !userId || !direction) {
            return res.status(400).send("job Id, user Id and direction are required ");
        }
        if (req.role !== "admin") {
            return res.status(401).send("You are not authorized ");
        }

        const admin = await userModel.findById(req.id);
        const appliedUser = await userModel.findById(userId);
        const job = await jobPostingModel.findById(jobId);

        const appliedJob = appliedUser.appliedJobs.find((item) => item.job.equals(jobId));
        appliedJob.status = "accepted";
        await appliedUser.save();

        const thisUser = job.candidatesApplied.find((item) => item.user.equals(userId));
        thisUser.status = "accepted";
        await job.save();

        if (!resumeFile && !resumeText) {
            admin.shortlistedCandidates.push({ user: userId, job: jobId });
        }
        else if (resumeFile && resumeText) {
            admin.shortlistedCandidates.push({ user: userId, job: jobId, resume: { resumeFile: resumeFile, resumeText: resumeText } });
        } else if (resumeText && !resumeFile) {
            admin.shortlistedCandidates.push({ user: userId, job: jobId, resume: { resumeText: resumeText } });
        } else if (!resumeText && resumeFile) {
            admin.shortlistedCandidates.push({ user: userId, job: jobId, resume: { resumeFile: resumeFile } });
        }

        await admin.save();

        return res.status(200).send("User application accepted successfully");
    } catch (err) {
        log("error in right swipe: ", err.message);
        return res.status(500).send("Internal server error ");
    }
}


//undo the swipe 
const undoSwipe = async (req, res) => {
    try {
        const { userId, jobId, direction } = req.body;
        if (!userId || !jobId || !direction) {
            return res.status(400).send("userId , jobId and previous direction are required");
        }
        if (req.role !== "admin") {
            log("yes")
            return res.status(401).send("You are not authorized ");
        }

        const admin = await userModel.findById(req.id);
        const appliedUser = await userModel.findById(userId);
        const job = await jobPostingModel.findById(jobId);


        const appliedJob = appliedUser.appliedJobs.find((item) => item.job.equals(jobId));
        appliedJob.status = "pending";
        await appliedUser.save();

        const thisUser = job.candidatesApplied.find((item) => item.user.equals(userId));
        thisUser.status = "pending";
        await job.save();

        if (direction === "right") {
            const item = admin.shortlistedCandidates.find((item) => item.user.equals(userId));

            if (item.jobs.length > 1) {
                item.jobs = item.jobs.filter((item) => !(item.job.equals(jobId)));
            } else {
                admin.shortlistedCandidates = admin.shortlistedCandidates.filter((item) => !item.user.equals(userId));
            }
        } else if (direction === "up") {

            const item = admin.likedCandidates.find((item) => item.user.equals(userId));

            if (item.jobs.length > 1) {
                item.jobs = item.jobs.filter((item) => !(item.job.equals(jobId)));
            } else {
                admin.likedCandidates = admin.likedCandidates.filter((item) => !item.user.equals(userId));
            }
        } else if (direction === "down") {
            admin.savedCandidates = admin.savedCandidates.filter((item) => !(item.user.equals(userId) && item.job.equals(jobId)));
        }

        await admin.save();

        return res.status(200).send("Undo successful");
    } catch (err) {
        log("error in undo swipe: ", err.message);
        return res.status(500).send("Internal server error ");
    }

}

// for saved candidate
const getSavedApplicants = async (req, res) => {

    try {
        const savedApplicantsData = await userModel.findById(req.id).populate({ path: 'savedCandidates.user', select: 'username fullName backstory combatStyle keyBattles powers preferredRole teams weakness profilePicture' }).populate({ path: 'savedCandidates.job', select: 'title description requiredPowers experienceLevel location deadline openings createdAt' });
        if (!savedApplicantsData) {
            return res.status(404).send("Admin not found");
        }

        return res.status(200).json({
            savedCandidatesData: savedApplicantsData.savedCandidates
        });

    } catch (err) {
        log("error in getting the saved applicants: ", err.message);
        return res.status(500).send("Internal server error ");
    }
}


const getShortlistedCandidates = async (req, res) => {
    try {

        const user = await userModel.findById(req.id)
            .populate([
                {
                    path: "shortlistedCandidates.user",
                    select: "fullName email username backstory powers weakness keyBattles teams combatStyle preferredRole profilePicture"
                },
                {
                    path: "shortlistedCandidates.jobs.job", 
                    select: "title description requiredPowers experienceLevel location deadline openings createdAt"
                },
                {
                    path: "likedCandidates.user",
                    select: "fullName email username backstory powers weakness keyBattles teams combatStyle preferredRole profilePicture"
                },
                {
                    path: "likedCandidates.jobs.job", 
                    select: "title description requiredPowers experienceLevel location deadline openings createdAt"
                }
            ]);

        return res.status(200).json({
            acceptedCandidates: user.shortlistedCandidates,
            likedCandidates: user.likedCandidates
        })

    } catch (err) {
        log("error in getting the shortlisted candidates: ", err.message);
        return res.status(500).send("Internal server error ");
    }
}

export { jobPosting, displayJobs, getJobApplications, applicationRightSwipe, applicationLeftSwipe, applicationUpSwipe, applicationDownSwipe, undoSwipe, getSavedApplicants, getShortlistedCandidates };