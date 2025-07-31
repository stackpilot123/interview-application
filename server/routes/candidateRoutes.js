import express from "express";
import { isLoggedIn, requiredRole } from "../middlewares/AuthMiddleware.js";
import { checkChatEnabled, deleteProfilePic, getAllActiveJobs, getAppliedJobs, getJob, updateProfile, uploadProfilePic, uploadResume } from "../controllers/candidate/CandidateControllers.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/get-applied-jobs",isLoggedIn,getAppliedJobs);
router.get("/get-job-board",isLoggedIn,requiredRole("candidate"),getAllActiveJobs);
router.get("/check-chat-enabled",isLoggedIn,requiredRole("candidate"),checkChatEnabled);


router.post("/update-profile",isLoggedIn,updateProfile);
router.post("/upload-profile-pic",upload.single("profilePic"),isLoggedIn,uploadProfilePic);
router.post("/get-application-job",isLoggedIn,getJob);
router.post("/upload-resume",upload.single("resume"),isLoggedIn,uploadResume);

router.delete("/delete-profile-pic",isLoggedIn,deleteProfilePic);


export default router;