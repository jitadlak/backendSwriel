import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import notification from "../../admin/models/notification.js";
import serviceOrder from "../../admin/models/serviceOrder.js";
import serviceprovider from "../models/serviceprovider.js";
import serviceproviderwithdrawrequest from "../models/serviceproviderwithdrawrequest.js";
import FCM from "fcm-node/lib/fcm.js";

var serverKey =
    "AAAATkrD4Mw:APA91bGTcbqtrEqYGFMSsOD6zQT_yXW2nXHTUL7pTVGdZNNt8lWsiLUeM7NhF3xW__GZxCBroQzYV0WlJThtD_gxv90se3qr0J56u71MdvmJzOr0ddkhUaWeOSm5JSFdMgL2voea9UPt";
var fcm = new FCM(serverKey);

const secret = "swriel";

export const providersignin = async (req, res) => {
    const { phone, device_token } = req.body;
    if (!phone) {
        return res.status(200).json({
            status: 401,
            message: "Phone Is Required",
        });
    }
    // if (!password) {
    //     return res.status(200).json({
    //         status: 401,
    //         message: "password Required",
    //     });
    // }
    try {
        const oldUser = await serviceprovider.findOne({
            phone,
        });
        if (!oldUser) {
            return res
                .status(200)
                .json({ message: "Provider Doesn't Exists !!", status: 401 });
        }

        // const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        // if (!isPasswordCorrect) {
        //     return res.status(200).json({
        //         message: "Invalid Credentiails",
        //         status: 401,
        //     });
        // }
        const token = jwt.sign(
            { phone: oldUser.phone, id: oldUser._id },
            secret,
            { expiresIn: "60h" }
        );
        const data = await serviceprovider.findById(oldUser._id);

        data.device_token = device_token;
        await data.save();
        res.status(200).json({ result: oldUser, token, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const providersignup = async (req, res) => {
    const {
        email,
        name,
        password,
        phone,
        image,
        address,
        IDDocument,
        membership,
        serviceCategory,
    } = req.body;
    console.log(req.body);

    if (!email) {
        return res.status(200).json({
            status: 401,
            message: "Email Is Required",
        });
    }
    if (!name) {
        return res.status(200).json({
            status: 401,
            message: "Full Name Is Required",
        });
    }
    if (!address) {
        return res.status(200).json({
            status: 401,
            message: "Address Is Required",
        });
    }

    // if (!password) {
    //     return res.status(200).json({
    //         status: 401,
    //         message: "Password Is Required",
    //     });
    // }
    if (!phone) {
        return res.status(200).json({
            status: 401,
            message: "Phone Is Required",
        });
    }
    // if (!image) {
    //     return res.status(200).json({
    //         status: 401,
    //         message: "Profile Image Is Required",
    //     });
    // }
    if (!membership) {
        return res.status(200).json({
            status: 401,
            message: "Membership Is Required",
        });
    }

    try {
        const oldUser = await serviceprovider.findOne({ email });

        if (oldUser) {
            return res.status(200).json({
                status: 401,
                message: "Vendor Already Exists",
            });
        }
        // const hashedPassword = await bcrypt.hash(password, 12);
        let serviceID = Math.floor(Math.random() * 90000) + 10000;

        const result = await serviceprovider.create({
            email,
            name,
            password,
            phone,
            image,
            address,
            IDDocument,
            membership,
            serviceId: serviceID,
            serviceCategory,
        });

        const token = jwt.sign({ email: result.email, _id: result._id }, secret, {
            expiresIn: "1h",
        });
        res.status(200).json({ result, token, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const getallserviceprovider = async (req, res) => {
    try {
        const alluser = await serviceprovider.find({});
        //console.log(allservices);
        if (!alluser) {
            return res.status(200).json({
                status: 400,
                message: "Service Provider Doesn't Exists !!",
            });
        }
        res.status(200).json({
            status: 200,
            result: alluser,
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const getassignedserviceorder = async (req, res) => {
    try {
        const alluser = await serviceOrder.find({
            serviceProviderId: req.params.id,
        });
        //console.log(allservices);
        if (alluser.length > 0) {
            return res.status(200).json({
                status: 200,
                result: alluser,
            });
        }
        return res.status(200).json({
            status: 400,
            message: " No Assigned Services",
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const updateproviderbalance = async (req, res) => {
    const { _id, walletBalance, comment } = req.body;

    if (!_id) {
        return res.status(200).json({
            status: 400,
            message: "Service Provider Required",
        });
    }
    if (!walletBalance) {
        return res.status(200).json({
            status: 400,
            message: "Updated Balance Is Required",
        });
    }
    try {
        const oldOrder = await serviceprovider.findById(_id);

        console.log(oldOrder);

        oldOrder.walletBalance = walletBalance;

        await oldOrder.save();
        // console.log(oldOrder)
        await notification.create({
            notificationTitle: "Wallet Balance Updated ",
            notificationDescription: `Your wallet Balance Has Been Updated - ${comment} !!`,
            toId: _id,
        });
        if (oldOrder.device_token) {
            var message = {
                //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: oldOrder.device_token,
                collapse_key: "your_collapse_key",

                notification: {
                    title: "Your Wallet Balance Updated !!",
                    body: `Your wallet Balance Has Been Updated - ${comment} !!. `,
                },

                data: {
                    //you can send only notification or only data(or include both)
                    message: "my value",
                    type: "my another value",
                },
            };

            fcm.send(message, function (err, response) {
                if (err) {
                    console.log("Something has gone wrong!", err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
        // con
        res.status(200).json({
            result: {
                message: "Wallet Balance Updated Successfully",
            },
            oldOrder,
            status: 200,
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const addserviceproviderequest = async (req, res) => {
    const { amount, serviceprovider, approved } = req.body;
    console.log(req.body);

    if (!amount) {
        return res.status(200).json({
            status: 401,
            message: "Amount Is Required",
        });
    }
    if (!serviceprovider) {
        return res.status(200).json({
            status: 401,
            message: "Service Provider Is Required",
        });
    }

    try {
        const result = await serviceproviderwithdrawrequest.create({
            amount,
            serviceprovider,
            approved,
        });

        res.status(200).json({ result, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const getallserviceproviderrequest = async (req, res) => {
    try {
        const alluser = await serviceproviderwithdrawrequest.find({});
        //console.log(allservices);
        if (!alluser) {
            return res.status(200).json({
                status: 400,
                message: "Service Provider Doesn't Exists !!",
            });
        }
        res.status(200).json({
            status: 200,
            result: alluser,
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const providerVerify = async (req, res) => {
    const { serviceId } = req.body;

    if (!serviceId) {
        return res.status(200).json({
            message: "Provider ID Is Required",
            status: 400,
        });
    }

    try {
        const serviceProvider = await serviceprovider.findOne({
            serviceId: serviceId,
        });
        if (!serviceProvider) {
            return res.status(200).json({
                message: "Invalid Provider ID !!",
                status: 400,
            });
        }
        // await promos.updateOne({ $push: { users: userId } })
        return res.status(200).json({
            message: "Service ID Verfied",
            status: 200,
            result: serviceProvider,
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};
