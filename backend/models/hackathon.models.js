// import { array, number, required } from 'joi'
import mongoose from 'mongoose'

const hackathonSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String
    },
    description: {
        type: String
    },
    submissions: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "submissions" }],
        //No. of participants of a hackathon are equal to submissions array no.of elements.
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    submissionStartDate : {
        type : Date
    },
    submissionEndDate : {
        type : Date
    },
    refMaterial: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String,
        enum: {
            values: ["Advanced", "Expert", "Intermediate", "Beginner"]
        }
    },
    category: {
        type: Array,
        // enum : {
        //     values : ["Web Dev" , "AI/ML" , "Blockchain" , "IoT"]
        // }
    },
    prizeMoney1: {
        type: Number
    },
    prizeMoney2 :{
        type : Number
    },
    prizeMoney3 : {
        type : Number
    },
    techStackUsed: {
        type: Array,
        // enum : {
        //     values : ["React" , "Node.js","MongoDB" , "Socket.io","Python","TensorFlow" , "OpenAI" , "FastAPI","Solidity" , "Web3.js" , "IPFS","Arduino" , "PostgreSQL"]
        // }
    },
    numParticipants: {
        type: Number,
        default: 0
    },
    overview: {
        type: String
    },
    themes: {
        type: [String]
    },
    FAQs: {
        type: [String]
    },
    teams: {
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "teams" },
        ]
    },
    aboutUs: {
        type: String
    },
    projectSubmission: {
        type: [String]
    },
    TandCforHackathon: {
        type: [String]
    },
    evaluationCriteria: {
        type: [String]
    },
    registeredParticipants: [
        { type: mongoose.Schema.Types.ObjectId, ref: "registeredParticipants" }
    ],
    allowedFileTypes: {
        docs: { type: [String], default: ["pdf", "docx"] },   // default docs
        images: { type: [String], default: ["jpg", "jpeg", "png"] }, // default images
        videos: { type: [String], default: ["mp4"] }, // default videos
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
})

hackathonSchema.pre(/^find/, async function (next) {

    const currentTime = new Date(Date.now())
    //mark status:true for active hackathons
    await this.model.updateMany(
        {
            startDate: { $lte: currentTime },
            submissionEndDate: { $gte: currentTime }
        },
        {
            status: true
        }
    )

    //mark status : false for inactive hackathons
    await this.model.updateMany(
        {
            submissionEndDate: { $lt: currentTime }
        },
        { status: false }
    )


    next();
})
const hackathonModel = mongoose.model("hackathons", hackathonSchema)

export default hackathonModel