import express from "express";
import { isLoggedIn, requiredRole } from "../middlewares/AuthMiddleware.js";
import { createChannel, getAllCandidatesForChannel, getAllChannels, getChannelMessages, removeCandidate } from "../controllers/ChannelControllers.js";

const router = express.Router();

router.get("/get-all-contacts-for-channel",isLoggedIn,requiredRole("admin"),getAllCandidatesForChannel);
router.get("/get-all-channels",isLoggedIn,getAllChannels);
router.get("/get-channel-messages/:channelId",isLoggedIn,getChannelMessages);


router.post("/create-channel",isLoggedIn,requiredRole("admin"),createChannel);
router.post("/remove-candidate-or-channel",isLoggedIn,requiredRole("admin"),removeCandidate);


export default router;