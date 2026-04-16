import { Router } from "express";
import { BookingController } from "../controllers/BookingController";
import { CreateBooking } from "../../application/use-cases/CreateBooking";
import { ApproveBooking } from "../../application/use-cases/ApproveBooking";
import { CreateGuestBooking } from "../../application/use-cases/CreateGuestBooking";
import { MongoBookingRepository } from "../../infrastructure/repositories/MongoBookingRepository";
import { MongoCarRepository } from "../../infrastructure/repositories/MongoCarRepository";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";
import { UserRole } from "../../domain/entities/User";

const router = Router();

const bookingRepo = new MongoBookingRepository();
const carRepo = new MongoCarRepository();
const userRepo = new MongoUserRepository();

const createBooking = new CreateBooking(bookingRepo, carRepo);
const approveBooking = new ApproveBooking(bookingRepo, carRepo);
const createGuestBooking = new CreateGuestBooking(userRepo, createBooking);

const bookingController = new BookingController(
  createBooking,
  approveBooking,
  bookingRepo,
  createGuestBooking
);

router.post("/", bookingController.create);
router.post("/guest", bookingController.guestCreate);
router.get("/user/:userId", bookingController.getBookingsByUser);
router.patch(
  "/:bookingId/approve",
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  bookingController.approve
);

export default router;