import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    submissions: {
        type: Array
    }
})

const UserModel = mongoose.model("users", userSchema)

export default UserModel