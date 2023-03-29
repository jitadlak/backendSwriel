import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import offers from "../models/offers.js";

export const addoffer = async (req, res) => {
    const { offertitle, offerdetail, offerimage } = req.body;

    if (!offertitle) {
        return res.status(200).json({
            status: 400,
            message: "Offer Title Is Required",
        });
    }
    if (!offerdetail) {
        return res.status(200).json({
            status: 400,
            message: "Offer Description  Is Required",
        });
    }
    if (!offerimage) {
        return res.status(200).json({
            status: 400,
            message: "Offer Image  Is Required",
        });
    }
    try {
        const result = await offers.create({
            offertitle,
            offerdetail,
            offerimage,
        });

        return res.status(200).json({ result, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const alloffers = async (req, res) => {
    try {
        const alloffers = await offers.find({});
        //console.log(allproduct);
        if (!alloffers) {
            return res.status(200).json({
                status: 400,
                message: "Offers Doesn't Exists !!",
            });
        }
        res.status(200).json({ result: alloffers, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const deleteoffer = async (req, res) => {
    try {
        const data = await offers.findById(req.params.id);
        if (!data) {
            return res.status(200).json({
                status: 400,
                message: "Offer Doesn't Exists !!",
            });
        }
        console.log(data, 'data')
        if (data) {
            const result = await offers.deleteOne({ _id: req.params.id });
            return res.status(200).json({
                status: 200,
                message: "Offer Deleted Successfully",
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
