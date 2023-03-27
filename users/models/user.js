import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    phone: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false
    },
    id: { type: String },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    type: {
        type: String,
        default: "User"
    },
    device_token: {
        type: String,
        required: false
    }
});

export default mongoose.model("user", userSchema);
