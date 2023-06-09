import express from 'express';
import { addbankaccount, allbankdetails, getbankdetailbyid } from '../controllers/bankaccounts.js';
import { addserviceproviderequest, getallserviceprovider, getallserviceproviderrequest, getassignedserviceorder, providersignin, providersignup, providerVerify, updateproviderbalance } from '../controllers/serviceProvider.js';

const router = express.Router();

import { getalluser, sendNotificationToUser, signin, signup } from '../controllers/user.js';
import { addvendorrequest, getallvendor, getallvendorrequest, getvendorproductList, selectVendorProduct, sendNotificationToVendor, updatevendorbalance, vendorsignin, vendorsignup } from '../controllers/vendor.js';
import auth from "../middleware/auth.js";


//user
router.post("/signup", signup);
router.post("/signin", signin);
router.get('/users', getalluser)
router.post('/sendnotificationuser', sendNotificationToUser)


//vendor
router.post("/vendor/signup", vendorsignup);
router.post("/vendor/signin", vendorsignin);
router.get("/vendor/all", getallvendor);
router.post("/vendor/withdraw", addvendorrequest)
router.get("/vendor/allrequests", getallvendorrequest)
router.get("/vendor/allproducts/:id", getvendorproductList)
router.post("/vendor/selectproduct", selectVendorProduct);
router.patch("/updatewalletvendor", updatevendorbalance)
router.get("/vendor/allrequests", getallvendorrequest)
router.post('/sendnotificationvendor', sendNotificationToVendor)

//serviceProvider
router.post("/provider/signup", providersignup);
router.post("/provider/signin", providersignin);
router.post("/verifyprovider", providerVerify);
router.get("/provider/all", getallserviceprovider);
router.get("/assignservices/:id", getassignedserviceorder)
router.patch("/updatewallet", updateproviderbalance)
router.post("/provider/withdraw", addserviceproviderequest)
router.get("/provider/allrequests", getallserviceproviderrequest)


router.post("/bankadd", addbankaccount);
router.get("/allbanks", allbankdetails);
router.get("/bankbyid/:id", getbankdetailbyid)

export default router;