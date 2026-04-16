import { BookingStatus } from "../../domain/entities/Booking";
import { CarStatus } from "../../domain/entities/Car";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { ICarRepository } from "../../domain/repositories/ICarRepository";

export class ApproveBooking {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly carRepo: ICarRepository
  ) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.startTime < new Date()) {
      throw new Error("Cannot approve past bookings");
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Only pending bookings can be approved");
    }

    await this.bookingRepo.updateStatus(bookingId, BookingStatus.CONFIRMED);
    await this.carRepo.updateStatus(booking.carId, CarStatus.BOOKED);
  }
}