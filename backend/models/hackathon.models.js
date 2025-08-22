// import { array, number, required } from 'joi'
import mongoose from 'mongoose'

const hackathonSchema = new mongoose.Schema({
    image : {
        type : String
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
    prizeMoney: {
        type: Number
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
    ]
})

hackathonSchema.pre(/^find/, async function (next) {

    const currentTime = new Date(Date.now())
    //mark status:true for active hackathons
    await this.model.updateMany(
        {
            startDate: { $lte: currentTime },
            endDate: { $gte: currentTime }
        },
        {
            status: true
        }
    )

    //mark status : false for inactive hackathons
    await this.model.updateMany(
        {
            endDate: { $lt: currentTime }
        },
        { status: false }
    )


    next();
})
const hackathonModel = mongoose.model("hackathons", hackathonSchema)

export default hackathonModel