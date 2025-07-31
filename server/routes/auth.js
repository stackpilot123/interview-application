import express from "express";
import { signup,login, getUserInfo, logout } from "../controllers/auth/AuthControllers.js";
import { isLoggedIn } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/get-user-info",isLoggedIn,getUserInfo);
router.get("/logout",isLoggedIn,logout);


export default router ;