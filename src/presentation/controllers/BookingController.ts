import { Request, Response } from "express";
import { CreateBooking } from "../../application/use-cases/CreateBooking";
import { ApproveBooking } from "../../application/use-cases/ApproveBooking";
import { CreateGuestBooking } from "../../application/use-cases/CreateGuestBooking";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";

export class BookingController {
  constructor(
    private readonly createBooking: CreateBooking,
    private readonly approveBooking: ApproveBooking,
    private readonly bookingRepo: IBookingRepository,
    private readonly createGuestBooking: CreateGuestBooking
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body) {
        res.status(400).json({ error: "Request body is required" });
        return;
      }

      const { userId, carId, startTime, endTime } = req.body;

      const booking = await this.createBooking.execute(
        userId,
        carId,
        new Date(startTime),
        new Date(endTime)
      );

      res.status(201).json({
        message: "Booking created successfully",
        booking,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = String(req.params.bookingId);

      await this.approveBooking.execute(bookingId);

      res.status(200).json({
        message: "Booking approved successfully",
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getBookingsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = String(req.params.userId);

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const bookings = await this.bookingRepo.findByUserId(userId);

      res.status(200).json({
        message: "User bookings retrieved successfully",
        bookings,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  guestCreate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, carId, startTime, endTime } = req.body;

      const booking = await this.createGuestBooking.execute(
        name,
        email,
        carId,
        new Date(startTime),
        new Date(endTime)
      );

      res.status(201).json({
        message: "Guest booking created successfully",
        booking,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}