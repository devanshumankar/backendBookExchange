import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    requesterId: {
        type: String,
        required: true
    },
    requesteeId: {
        type: String,
        required: true
    },
    requestedBookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        required: true
    },
    ownerBookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        required: true
    },
    requestStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const Requests = mongoose.model("Requests", requestSchema);
export default Requests;
