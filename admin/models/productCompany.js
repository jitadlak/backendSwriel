import mongoose from "mongoose";

const productcompanySchema = mongoose.Schema({
    Image: {
        type: String,
        required: true,
    }, companyName: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("productcompany", productcompanySchema);