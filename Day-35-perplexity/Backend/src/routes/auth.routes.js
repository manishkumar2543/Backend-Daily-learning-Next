import { Router } from "express";
import { register, emailVerify, login, getMe } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register",registerValidator, register);

router.post('/login',loginValidator,login)

router.get("/verify-email", emailVerify);
router.get("/get-me",authUser,getMe);

export default router;