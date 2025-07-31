import debug from "debug";
import userModel from "../../models/userModel.js";
import generateToken from "../../utils/generateToken.js";
import bcrypt from "bcrypt";
import jobModel from "../../models/admin/jobPostingModel.js";

const log = debug("development:authControllers");

const signup = async (req, res) => {
    try {
        const { email, fullName, password } = req.body;
        if (!email || !fullName || !password) {
            return res.status(400).send("Email, Full Name and Password are required");
        }
        const isUser = await userModel.findOne({ email });
        if (isUser) {
            return res.status(409).send("Email already exists. Please login");
        }

        const user = await userModel.create({
            email,
            fullName,
            password
        });
        console.log(user);

        const token = generateToken(user);
        res.cookie("token", token);

        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                
                backstory : user.backstory ? user.backstory:"",
                combatStyle: user.combatStyle?user.combatStyle:"",
                keyBattles: user.keyBattles.length===0?[""]:user.keyBattles,
                powers: user.powers.length===0?[""]:user.powers,
                preferredRole: user.preferredRole?user.preferredRole:"",
                teams: user.teams.length===0?[""]:user.teams,
                username: user.username?user.username:"",
                weaknesses: user.weakness.length===0?[""]:user.weakness,

                profilePicture: user.profilePicture,
                appliedJobs: user.appliedJobs
            }
        })

    } catch (err) {
        log("error in signup: ", err.message);
        return res.status(500).send("Internal server error ");
    }

};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(409).send("Invalid email or password");
        }
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).send("Invalid email or password");
        }

        const token = generateToken(user);
        res.cookie("token", token);

        return res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,

                backstory : user.backstory ? user.backstory:"",
                combatStyle: user.combatStyle?user.combatStyle:"",
                keyBattles: user.keyBattles.length===0?[""]:user.keyBattles,
                powers: user.powers.length===0?[""]:user.powers,
                preferredRole: user.preferredRole?user.preferredRole:"",
                teams: user.teams.length===0?[""]:user.teams,
                username: user.username?user.username:"",
                weaknesses: user.weakness.length===0?[""]:user.weakness,

                profilePicture: user.profilePicture,

                appliedJobs: user.appliedJobs

            }
        });
    } catch (err) {
        log("error in login: ", err.message);
        return res.status(500).send("Internal server error");
    }

};

const getUserInfo = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.id });
        if (!user) return res.status(404).send("User not found");


        return res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role,

                backstory : user.backstory ? user.backstory:"",
                combatStyle: user.combatStyle?user.combatStyle:"",
                keyBattles: user.keyBattles.length===0?[""]:user.keyBattles,
                powers: user.powers.length===0?[""]:user.powers,
                preferredRole: user.preferredRole?user.preferredRole:"",
                teams: user.teams.length===0?[""]:user.teams,
                username: user.username?user.username:"",
                weaknesses: user.weakness.length===0?[""]:user.weakness,

                appliedJobs: user.appliedJobs
            }
        })
    } catch (err) {
        log("error in get user info: ", err.message);
        return res.status(500).sned("Internal server error");
    }

}

const logout = (req, res) => {
    try {
        res.cookie("token", "");
        return res.status(200).send("Logout successfull!");
    } catch (err) {
        log("error in logout controller: ",err.message);
        return res.status(500).send("Internal server error");
    }

};
export { signup, login, getUserInfo, logout };