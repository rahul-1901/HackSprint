import mongoose from 'mongoose'

const hackathonSchema = new mongoose.Schema({
    title: {
        type: String
    }, 
    subTitle: {
        type: String
    },
    description: {
        type: String
    },
    submissions: {
        type: Array
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
        type: Boolean
    }
})

const hackathonModel = mongoose.model("hackathons", hackathonSchema)

export default hackathonModel