import mongoose from "mongoose";

const userSchema = mongoose.Schema( {
    name: String,
    email: String,
    photoUrl: String,
    friends: Array
})

export default mongoose.model('Users',userSchema)