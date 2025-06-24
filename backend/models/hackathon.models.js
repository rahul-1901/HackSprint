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
        type: Boolean,
        default : false
    }
})

hackathonSchema.pre(/^find/ , async function(next){

    const currentTime = new Date(Date.now())
    //mark status:true for active hackathons
    await this.model.updateMany(
        {
            startDate : {$lte : currentTime},
            endDate : {$gte : currentTime}
        },
        {status : true}
    )

    //mark status : false for inactive hackathons
    await this.model.updateMany(
        {
            endDate : {$lt : currentTime}
        },
        {status : false}
    )
    next();
})
const hackathonModel = mongoose.model("hackathons", hackathonSchema)

export default hackathonModel