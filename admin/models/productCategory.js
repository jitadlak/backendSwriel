import mongoose from "mongoose";

const productCategorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    companyId: {
        type: String,
        required: false,
    },

    id: { type: String },
    createdAt: { type: Date, default: Date.now },
    productData: {
        type: Object,
        required: false,
    },
});

export default mongoose.model("productcategories", productCategorySchema);
