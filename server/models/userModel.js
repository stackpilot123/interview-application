import mongoose from "mongoose";
import bcrypt from "bcrypt";
import debug from "debug";

const log = debug("development:model");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required "],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required "],
        trim: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ["candidate", "admin"],
        required: [true, "role is required"],
        default: "candidate"
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    profilePicturePublicId: {
        type: String,
        required: false
    },

    username: {
        type: String,
        required: false
    },
    backstory: {
        type: String,
        required: false
    },
    powers: {
        type: [String],
        required: false
    },
    weakness: {
        type: [String],
        required: false
    },
    keyBattles: {
        type: [String],
        required: false
    },
    teams: {
        type: [String],
        required: false
    },
    combatStyle: {
        type: String,
        required: false
    },
    preferredRole: {
        type: String,

        required: false
    },

    // candidate 
    appliedJobs: [
        {
            job:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "job"
            },
            resume:{
                resumeFile:{
                    type: String,
                    required: false
                },
                resumeText:{
                    type: String,
                    required: false
                }
            },
            status:{
                type: String,
                default: "pending"
            }
        }
    ],

    //admin
    shortlistedCandidates: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            jobs:[
                {
                    job: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "job"
                    },
                    resumeFile:{
                        type: String,
                        required: false 
                    },
                    resumeText:{
                        type: String,
                        required: false 
                    }
                }
            ]
        }
    ],
    
    likedCandidates: [
       {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            jobs:[
                {
                    job: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "job"
                    },
                    resumeFile:{
                        type: String,
                        required: false 
                    },
                    resumeText:{
                        type: String,
                        required: false 
                    }
                }
            ]
        }
    ],

    savedCandidates: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            resume:{
                resumeFile:{
                    type: String,
                    required: false 
                },
                resumeText:{
                    type: String,
                    required: false
                }
            },
            job:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "job"
            }
            
        }
        
    ],
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        log("error in hashing the password: ", err.message);
    }
})

export default mongoose.model("user", userSchema);