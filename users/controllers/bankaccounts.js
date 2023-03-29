import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bankaccount from "../models/bankaccount.js";

export const addbankaccount = async (req, res) => {
    const { bankName, ifsc, accountNo, branch, userid } = req.body;
    console.log(req.body);

    if (!bankName) {
        return res.status(200).json({
            status: 401,
            message: "Bank Name Is Required",
        });
    }
    if (!ifsc) {
        return res.status(200).json({
            status: 401,
            message: "IFSC Code Is Required",
        });
    }
    if (!branch) {
        return res.status(200).json({
            status: 401,
            message: "branch Is Required",
        });
    }
    if (!accountNo) {
        return res.status(200).json({
            status: 401,
            message: "Account No Is Required",
        });
    }
    try {
        const result = await bankaccount.create({
            bankName,
            ifsc,
            accountNo,
            branch,
            userid,
        });

        res.status(200).json({ result, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const allbankdetails = async (req, res) => {
    try {
        const alldetails = await bankaccount.find({});
        //console.log(allproduct);
        if (!alldetails) {
            return res.status(200).json({
                status: 400,
                message: "Details Not Available !!",
            });
        }
        res.status(200).json({ result: alldetails, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const getbankdetailbyid = async (req, res) => {
    try {
        const data = await bankaccount.find({ userid: req.params.id });
        console.log(data)
        if (data.length <= 0) {
            return res
                .status(200)
                .json({ message: "No Account Linked !!", status: 400 });
        }
        if (data.length > 0) {
            return res.status(200).json({ result: data, status: 200 });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};