import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import adminRouter from "./admin/routes/user.js";
import userRouter from "./users/routes/user.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import twilio from "twilio";
const accountSid = 'AC6ae85b5b94d0f0f95fe2371f01acc85e'
const authToken = '81742035bc4478c30a73df7d4b8729c1'
const serviceId = 'VAada1fef0ff9ef84ef2544a43965b70c5'

const client = new twilio(accountSid, authToken)
dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const port = 8000;
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(port, () => console.log(`server running on port ${port}`));
    })
    .catch((error) => console.log(`${error} did not connect`));

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
    res.send("Welcome to tour API");
});
app.use("/public", express.static(path.join(__dirname, "public")));
const storage = multer.diskStorage({
    destination: "./public/images",
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const diskStorage = multer({ storage: storage });

app.post("/imageupload", diskStorage.single("image"), async (req, res) => {
    try {
        // console.log(req.file); // File which is uploaded in /uploads folder.
        // console.log(req.body); // Body
        res.send({ path: req.file.path });
    } catch (error) {
        res.status(500).send("Error");
    }
});

app.get('/login', async (req, res) => {
    const to = req.params.to
    console.log('hi')
    client.verify
        .services(serviceId)
        .verifications.create({
            to: `+${req.query.to}`
            , channel: 'sms'
        })
        .then((verification) => {
            res.json(verification)
        })
        .catch((err) => {
            res.json(err)
        })
})

app.get('/verify', async (req, res) => {
    // const to = req.params.to
    // const code = req.params.code
    client.verify
        .services(serviceId)
        .verificationChecks.create(
            {
                to: `+${req.query.to}`
                , code: req.query.code
            }
        )
        .then((verification) => {
            res.json(verification)
        })
        .catch((err) => {
            res.json(err)
        })
})