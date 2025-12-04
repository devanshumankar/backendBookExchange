import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
    {
        ownerUid: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        condition: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        status: {
            type: String,
            default: "available"
        }
    }, {
    timestamps: true
}
)

export default mongoose.model("Books", bookSchema)