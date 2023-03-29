import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appbanner from "../models/appbanner.js";

export const addbannerimg = async (req, res) => {
    const { Image } = req.body;
    // console.log(req.body, 'serviceImage');

    if (!Image) {
        return res.status(200).json({
            status: 400,
            message: " Image Is Required",
        });
    }

    try {
        const result = await appbanner.create({
            Image,
        });

        res.status(200).json({ result, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const allappbanner = async (req, res) => {
    try {
        const allappbanner = await appbanner.find({});
        //console.log(allproduct);
        if (!allappbanner) {
            return res.status(200).json({
                status: 400,
                message: "App banner Doesn't Exists !!",
            });
        }
        res.status(200).json({ result: allappbanner, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const deleteappbanner = async (req, res) => {
    try {
        const data = await appbanner.find({ _id: req.params.id });
        if (!data) {
            return res.status(200).json({
                status: 400,
                message: "App Banner  Doesn't Exists !!",
            });
        }
        if (data.length > 0) {
            const result = await appbanner.deleteOne({ _id: req.params.id });
            return res.status(200).json({
                status: 200,
                message: "App Banner Deleted Successfully",
            });
        }
        return res.status(200).json({
            status: 400,
            message: "App Banner Doesn't Exists !!",
        });
    } catch (err) {
        res.status(500).json(err);
    }
};
