import express from "express";
import { isLoggedIn, requiredRole } from "../middlewares/AuthMiddleware.js";
import { jobPosting, displayJobs ,getJobApplications, applicationRightSwipe, applicationLeftSwipe,applicationUpSwipe, applicationDownSwipe, undoSwipe, getSavedApplicants, getShortlistedCandidates} from "../controllers/admin/AdminControllers.js";

const router = express.Router();

router.get("/get-job-applications",isLoggedIn,getJobApplications);
router.get("/get-all-jobs",isLoggedIn,requiredRole("admin"),displayJobs);
router.get("/get-saved-applicants",isLoggedIn,requiredRole("admin"),getSavedApplicants);
router.get("/get-shortlisted-candidates",isLoggedIn,requiredRole("admin"),getShortlistedCandidates);


router.post("/job-posting",isLoggedIn,jobPosting);
router.post("/application-right-swipe",isLoggedIn,applicationRightSwipe);
router.post("/application-left-swipe",isLoggedIn,applicationLeftSwipe);
router.post("/application-up-swipe",isLoggedIn,applicationUpSwipe);
router.post("/application-down-swipe",isLoggedIn,applicationDownSwipe);
router.post("/undo-swipe",isLoggedIn,undoSwipe);

export default router;