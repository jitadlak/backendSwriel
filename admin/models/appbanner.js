import mongoose from "mongoose";

const appbannerSchema = mongoose.Schema({
    Image: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("appbanner", appbannerSchema);