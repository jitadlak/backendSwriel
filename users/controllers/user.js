import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";
import FCM from "fcm-node/lib/fcm.js";
var serverKey =
    "AAAATkrD4Mw:APA91bGTcbqtrEqYGFMSsOD6zQT_yXW2nXHTUL7pTVGdZNNt8lWsiLUeM7NhF3xW__GZxCBroQzYV0WlJThtD_gxv90se3qr0J56u71MdvmJzOr0ddkhUaWeOSm5JSFdMgL2voea9UPt";
var fcm = new FCM(serverKey);
const secret = "swriel";

// export const signin = async (req, res) => {
//     const { email, password, device_token } = req.body;
//     if (!email) {
//         return res.status(200).json({
//             status: 401,
//             message: "Email Required",
//         });
//     }
//     if (!password) {
//         return res.status(200).json({
//             status: 401,
//             message: "password Required",
//         });
//     }
//     try {
//         const oldUser = await UserModal.findOne({
//             email,
//         });
//         if (!oldUser) {
//             return res.status(200).json({ message: "User Doesn't Exists !!", status: 401, });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
//         if (!isPasswordCorrect) {
//             return res.status(200).json({
//                 message: "Invalid Credentiails",
//                 status: 401,
//             });
//         }
//         const token = jwt.sign(
//             { username: oldUser.username, id: oldUser._id },
//             secret,
//             { expiresIn: "2h" }
//         );
//         const data = await UserModal.findById(oldUser._id);

//         data.device_token = device_token;

//         await data.save();

//         // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//         //     to: device_token,
//         //     collapse_key: 'your_collapse_key',

//         //     notification: {
//         //         title: 'Title of your push notification',
//         //         body: 'Body of your push notification'
//         //     },

//         //     data: {  //you can send only notification or only data(or include both)
//         //         message: 'my value',
//         //         type: 'my another value'
//         //     }
//         // };

//         // fcm.send(message, function (err, response) {
//         //     if (err) {
//         //         console.log("Something has gone wrong!", err);
//         //     } else {
//         //         console.log("Successfully sent with response: ", response);
//         //     }
//         // });

//         res.status(200).json({ result: oldUser, token, status: 200 });
//     } catch (error) {
//         res.status(500).json({ message: "Something Went Wrong" });
//         console.log(error);
//     }
// };

export const signin = async (req, res) => {
    const { phone, device_token } = req.body;
    if (!phone) {
        return res.status(200).json({
            status: 401,
            message: "Phone No Is Required"
        });
    }

    try {
        const oldUser = await UserModal.findOne({
            phone
        });
        if (!oldUser) {
            return res
                .status(200)
                .json({ message: "User Doesn't Exists !!", status: 401 });
        }

        // const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        // if (!isPasswordCorrect) {
        //     return res.status(200).json({
        //         message: "Invalid Credentiails",
        //         status: 401,
        //     });
        // }
        const token = jwt.sign({ phone: oldUser.phone, id: oldUser._id }, secret, {
            expiresIn: "60h"
        });
        const data = await UserModal.findById(oldUser._id);

        data.device_token = device_token;

        await data.save();

        res.status(200).json({ result: oldUser, token, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const signup = async (req, res) => {
    const { email, password, phone, name, image, address, city, state } =
        req.body;

    if (!email) {
        return res.status(200).json({
            status: 401,
            message: "Email Is Required"
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
            message: "phone Is Required"
        });
    }
    if (!name) {
        return res.status(200).json({
            status: 401,
            message: "name Is Required"
        });
    }
    try {
        const oldUser = await UserModal.findOne({ phone });

        if (oldUser) {
            return res.status(200).json({
                status: 401,
                message: "Phone No. Already Registered !! Please Login"
            });
        }
        // const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModal.create({
            email,
            // password: hashedPassword,
            phone,
            name,
            address,
            image,
            city,
            state
        });

        const token = jwt.sign(
            { email: result.email, _id: result._id },
            secret,
            {}
        );
        res.status(200).json({ result, token, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const getalluser = async (req, res) => {
    try {
        const alluser = await UserModal.find({});
        //console.log(allservices);
        if (!alluser) {
            return res.status(200).json({
                status: 400,
                message: "Users Doesn't Exists !!"
            });
        }
        res.status(200).json({
            status: 200,
            result: alluser
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};


export const sendNotificationToUser = async (req, res) => {
    const { id, notificationTitle, notificationData } = req.body;
    try {
        const user = await UserModal.findById(id);

        console.log(user);
        if (!user) {
            return res.status(200).json({
                status: 400,
                message: "Users Doesn't Exists !!"
            });
        }


        var message = {
            to: user.device_token,
            collapse_key: 'your_collapse_key',

            notification: {
                title: notificationTitle,
                body: notificationData
            },

            data: {  //you can send only notification or only data(or include both)
                message: 'my value',
                type: 'my another value'
            }
        };

        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!", err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });

        res.status(200).json({
            status: 200,
            message: "Notification Sent Successfully !!"
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};
