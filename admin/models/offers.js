import mongoose from "mongoose";

const offersSchema = mongoose.Schema({
    offertitle: {
        type: String,
        required: true,
    },
    offerdetail: {
        type: String,
        required: true,
    },
    offerimage: {
        type: String,
        required: true,
    },
    time: { type: Date, default: Date.now }
});

export default mongoose.model("offers", offersSchema);