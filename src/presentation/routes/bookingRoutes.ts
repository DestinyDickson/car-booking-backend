import { Router } from "express";
import { BookingController } from "../controllers/BookingController";
import { CreateBooking } from "../../application/use-cases/CreateBooking";
import { ApproveBooking } from "../../application/use-cases/ApproveBooking";
import { DeclineBooking } from "../../application/use-cases/DeclineBooking";
import { EditBooking } from "../../application/use-cases/EditBooking";
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
const approveBooking = new ApproveBooking(bookingRepo);
const declineBooking = new DeclineBooking(bookingRepo);
const editBooking = new EditBooking(bookingRepo);
const createGuestBooking = new CreateGuestBooking(userRepo, createBooking);

const bookingController = new BookingController(
  createBooking,
  approveBooking,
  declineBooking,
  editBooking,
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

router.patch(
  "/:bookingId/decline",
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  bookingController.decline
);

router.patch(
  "/:bookingId/edit",
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  bookingController.edit
);

export default router;