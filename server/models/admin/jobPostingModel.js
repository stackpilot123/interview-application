import mongoose from "mongoose";

const jobPostingSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    requiredPowers:{
        type: [String],
        required: true 
    },

    experienceLevel:{
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        required: true
    },

    location:{
        type: String,
        required: true
    },

    
    deadline:{
        type: Date,
        required: true
    },
    
    openings:{
        type: Number,
        required: true
    },

    visibility:{
        type: Boolean,
        default: true
    },

    rarity:{
        type: String,
        required: false
    },

    candidatesApplied:[
        {
           user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
           },
           resumeFile:{
            type: String,
            required: false
           },
           resumeText:{
            type: String,
            required: false
           },
           status:{
            type: String,
            default: "pending"
           }
            
        }

    ]

    

},{timestamps: true });


export default mongoose.model("job",jobPostingSchema);

