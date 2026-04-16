import { Router } from "express";
import { CarController } from "../controllers/CarController";
import { MongoCarRepository } from "../../infrastructure/repositories/MongoCarRepository";

const router = Router();

const carRepo = new MongoCarRepository();
const carController = new CarController(carRepo);

router.get("/available", carController.getAvailableCars);

export default router;