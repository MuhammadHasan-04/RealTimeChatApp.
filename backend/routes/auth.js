


import express from "express";
import { login, signup ,getUsers} from "../controllers/authcontroller.js";

const router = express.Router();
router.get('/' , getUsers); 
router.post("/signup", signup);
router.post("/login", login);



export default router;