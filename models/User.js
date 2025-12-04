import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true
        },
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
    },
    { timestamps: true }
)

export default mongoose.model("User", userSchema)
