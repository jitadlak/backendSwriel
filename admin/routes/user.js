import express from 'express';

const router = express.Router();

import { signin, signup } from '../controllers/user.js';
import { addservice, addcategory, allservices, caterogybyservices, addsubcategories, deleteservice, allservicecategory, deleteservicecategory, allservicesubcategory, deleteservicesubcategory, subcategorybycategory } from '../controllers/service.js';
import auth from "../middleware/auth.js";
import { addpromos, allpromos, assignPromo, deletepromotion, promocodeVerify } from '../controllers/promo.js';
import { addproduct, addproductcategory, addproductList, allproductcategory, allproducts, allproductsList, caterogybyproduct, deleteproduct, deleteproductcategory, productListbycategory, productListVendor, updateprice } from '../controllers/product.js';
import { addserviceorder, allserviceorder, assignserviceprovider, getServiceOrderById, setserviceorderstatus } from '../controllers/serviceorder.js';
import { addcompany, allCompany, deleteCompany } from '../controllers/company.js';
import { notificationbyUser } from '../controllers/notification.js';
import { addproductorder, allproductorder, assignvendorprovider, getProductOrderByAssignedId, getProductOrderById, setproductorderstatus } from '../controllers/productorder.js';
import { addserviceproviderequest } from '../../users/controllers/serviceProvider.js';
import { addfeedback, allfeedback } from '../controllers/feedback.js';
import { addbannerimg, allappbanner, deleteappbanner } from '../controllers/appbanner.js';
import { addoffer, alloffers, deleteoffer } from '../controllers/offers.js';


//authentication
router.post("/signup", signup);
router.post("/signin", signin);

//services
router.post("/addservice", addservice)
router.post("/addcategory", addcategory)
router.get("/allservices", allservices)
router.get("/allservicecategory", allservicecategory)
router.get("/allservicesubcategory", allservicesubcategory)
router.get("/category/:id", caterogybyservices)
router.get("/subcategory/:id", subcategorybycategory)
router.post("/category/addsubcategory", addsubcategories)
router.delete("/deleteservice/:id", deleteservice)
router.delete("/deleteservicecategory/:id", deleteservicecategory)
router.delete("/deleteservicesubcategory/:id", deleteservicesubcategory)

//promos
router.post("/addpromos", addpromos)
router.put("/assignPromo/:id", assignPromo)
router.post("/verifypromocode", promocodeVerify)
router.get("/allpromos", allpromos)
router.delete("/deletepromotion/:id", deletepromotion)


//products
router.post("/addproduct", addproduct)
router.get("/allproducts", allproducts)
router.get("/allproductslists", allproductsList)
router.delete("/deleteproduct/:id", deleteproduct)
router.post("/addproductcategory", addproductcategory)
router.get("/allproductcategory", allproductcategory)
router.post("/addcompany", addcompany)
router.get("/allcompany", allCompany)
router.delete("/deletecompany/:id", deleteCompany)
router.post("/addProductList", addproductList)
router.delete("/deleteproductcategory/:id", deleteproductcategory)
router.get("/productcategory/:id", caterogybyproduct)
router.get("/productList/:id", productListbycategory)
router.get("/vendorproductlist/:id", productListVendor)
router.post("/productbook", addproductorder)
router.get("/allproductbooked", allproductorder)
router.patch("/productAssign", assignvendorprovider)
router.patch("/productstatus", setproductorderstatus)
router.patch("/updateprice", updateprice)
router.get("/userproductorder/:id", getProductOrderById)
router.get("/vendorassignedorder/:id", getProductOrderByAssignedId)
//servicebook
router.post("/servicebook", addserviceorder)
router.patch("/serviceAssign", assignserviceprovider)
router.patch("/serviceStatus", setserviceorderstatus)
router.get("/allservicebooked", allserviceorder)
router.get("/userserviceorder/:id", getServiceOrderById)


//Notification byId
router.get("/notification/:id", notificationbyUser)


//feedback
router.post("/feedback", addfeedback)
router.get("/allfeedback", allfeedback)



//AppBanner

router.get("/allbanners", allappbanner)
router.post("/addbanner", addbannerimg)
router.delete("/deletebanner/:id", deleteappbanner)


//
router.get("/alloffers", alloffers)
router.post("/addoffer", addoffer)
router.delete("/deleteoffer/:id", deleteoffer)
export default router;