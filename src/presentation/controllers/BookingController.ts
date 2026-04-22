import { Request, Response } from "express";
import { CreateBooking } from "../../application/use-cases/CreateBooking";
import { ApproveBooking } from "../../application/use-cases/ApproveBooking";
import { DeclineBooking } from "../../application/use-cases/DeclineBooking";
import { EditBooking } from "../../application/use-cases/EditBooking";
import { CreateGuestBooking } from "../../application/use-cases/CreateGuestBooking";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";

export class BookingController {
  constructor(
    private readonly createBooking: CreateBooking,
    private readonly approveBooking: ApproveBooking,
    private readonly declineBooking: DeclineBooking,
    private readonly editBooking: EditBooking,
    private readonly bookingRepo: IBookingRepository,
    private readonly createGuestBooking: CreateGuestBooking
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
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

  decline = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = String(req.params.bookingId);

      await this.declineBooking.execute(bookingId);

      res.status(200).json({
        message: "Booking declined successfully",
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  edit = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = String(req.params.bookingId);
      const { startTime, endTime } = req.body;

      await this.editBooking.execute(
        bookingId,
        new Date(startTime),
        new Date(endTime)
      );

      res.status(200).json({
        message: "Booking updated successfully",
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
}