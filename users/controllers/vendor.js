import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import vendor from "../models/vendor.js";
import vendorproducts from "../models/vendorproducts.js";
import vendorwithdrawrequest from "../models/vendorwithdrawrequest.js";
import productList from "../../admin/models/productList.js";
import notification from "../../admin/models/notification.js";
const secret = "swriel";
import FCM from "fcm-node/lib/fcm.js";

var serverKey =
    "AAAATkrD4Mw:APA91bGTcbqtrEqYGFMSsOD6zQT_yXW2nXHTUL7pTVGdZNNt8lWsiLUeM7NhF3xW__GZxCBroQzYV0WlJThtD_gxv90se3qr0J56u71MdvmJzOr0ddkhUaWeOSm5JSFdMgL2voea9UPt";
var fcm = new FCM(serverKey);
export const vendorsignin = async (req, res) => {
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
        const oldUser = await vendor.findOne({
            phone,
        });
        if (!oldUser) {
            return res
                .status(200)
                .json({ message: "Vendor Doesn't Exists !!", status: 401 });
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
        const data = await vendor.findById(oldUser._id);

        data.device_token = device_token;

        await data.save();
        res.status(200).json({ result: oldUser, token, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const vendorsignup = async (req, res) => {
    const {
        email,
        name,
        storename,
        storecontactno,
        password,
        phone,
        image,
        storeaddress,
        websitelink,
        membership,
        productCategory,
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

    if (!storename) {
        return res.status(200).json({
            status: 401,
            message: "Store Name Is Required",
        });
    }
    // if (!password) {
    //     return res.status(200).json({
    //         status: 401,
    //         message: "Password Is Required",
    //     });
    // }
    if (!storecontactno) {
        return res.status(200).json({
            status: 401,
            message: "Store Contact No Is Required",
        });
    }
    if (!phone) {
        return res.status(200).json({
            status: 401,
            message: "Phone Is Required",
        });
    }
    // if (image) {
    //     return res.status(200).json({
    //         status: 401,
    //         message: "Profile Image Is Required",
    //     });
    // }
    if (!storeaddress) {
        return res.status(200).json({
            status: 401,
            message: "Store Address Is Required",
        });
    }

    try {
        const oldUser = await vendor.findOne({ phone });

        if (oldUser) {
            return res.status(200).json({
                status: 401,
                message: "Vendor Phone No Already Registered !! Please Login",
            });
        }
        // const hashedPassword = await bcrypt.hash(password, 12);

        const result = await vendor.create({
            email,
            name,
            storename,
            password,
            storecontactno,
            password,
            phone,
            image,
            storeaddress,
            websitelink,
            membership,
            productCategory,
        });

        const token = jwt.sign(
            { email: result.email, _id: result._id },
            process.env.SECRET_KEY,
            {}
        );

        const result1 = await vendorproducts.create({
            vendorId: result._id,
            products: [],
        });
        res.status(200).json({ result, token, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const getallvendor = async (req, res) => {
    try {
        const alluser = await vendor.find({});
        //console.log(allservices);
        if (!alluser) {
            return res.status(200).json({
                status: 400,
                message: "Vendor Doesn't Exists !!",
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

export const addvendorrequest = async (req, res) => {
    const { amount, vendor, approved } = req.body;
    console.log(req.body);

    if (!amount) {
        return res.status(200).json({
            status: 401,
            message: "Amount Is Required",
        });
    }
    if (!vendor) {
        return res.status(200).json({
            status: 401,
            message: "Vendor Is Required",
        });
    }

    try {
        const result = await vendorwithdrawrequest.create({
            amount,
            vendor,
            approved,
        });

        res.status(200).json({ result, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};

export const getallvendorrequest = async (req, res) => {
    try {
        const alluser = await vendorwithdrawrequest.find({});
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

export const getvendorproductList = async (req, res) => {
    try {
        const alluser = await vendorproducts.findOne({ vendorId: req.params.id });
        console.log(alluser, "hjhjkjhjkh");
        if (!alluser) {
            return res.status(200).json({
                status: 400,
                message: "vendor Products Doesn't Exists !!",
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
export const selectVendorProduct = async (req, res) => {
    const { vendorId, product } = req.body;

    if (!vendorId) {
        return res.status(200).json({
            status: 401,
            message: "ID Required",
        });
    }
    if (!product) {
        return res.status(200).json({
            status: 400,
            message: "Product Is Required",
        });
    }
    try {
        // serviceOrder.findByIdAndUpdate(_id, { $set: serviceProviderId }, { new: true }, function (err, result) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log("RESULT: " + result);
        //     res.send('Done')

        // });
        // console.log(data);

        // res.status(200).json({ result: user, status: 200 });
        const oldOrder = await vendorproducts.findOne({ vendorId: vendorId });

        console.log(product);
        const data = [...oldOrder.products, product];

        oldOrder.products = data;

        await oldOrder.save();
        // await notification.create({
        //     notificationTitle: "Congrates !! New Service Order Assigned To You ",
        //     notificationDescription: ` Service Order Assigned To You Address - ${oldOrder.addressLine1} ${oldOrder.city} , Please Check !! `,
        //     toId: serviceProviderId,
        // })
        // console.log(oldOrder)
        res.status(200).json({
            result: {
                message: "Selected Successfully !!",
            },
            status: 200,
        });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
        console.log(error);
    }
};
export const updatevendorbalance = async (req, res) => {
    const { _id, walletBalance, comment } = req.body;

    if (!_id) {
        return res.status(200).json({
            status: 400,
            message: "Vendor Required",
        });
    }
    if (!walletBalance) {
        return res.status(200).json({
            status: 400,
            message: "Updated Balance Is Required",
        });
    }
    try {
        const oldOrder = await vendor.findById(_id);

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
