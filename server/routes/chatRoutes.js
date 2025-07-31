import express from "express";
import { isLoggedIn, requiredRole } from "../middlewares/AuthMiddleware.js";
import { getContactsForDmList, getMessages, markMessagesAsSeen, messageFileUpload, searchContacts } from "../controllers/ChatControllers.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/get-all-contacts-for-dm-list",isLoggedIn,getContactsForDmList);

router.post("/search-contacts",isLoggedIn, requiredRole("admin"),searchContacts);
router.post("/get-messages",isLoggedIn,getMessages);
router.post("/mark-messages-seen",isLoggedIn,markMessagesAsSeen);
router.post("/upload-file-message",upload.single("fileForMessage"),isLoggedIn,messageFileUpload);

export default router;