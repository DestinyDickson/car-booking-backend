import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";

const router = Router();

const userRepo = new MongoUserRepository();
const registerUser = new RegisterUser(userRepo);
const loginUser = new LoginUser(userRepo);
const authController = new AuthController(registerUser, loginUser);

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;