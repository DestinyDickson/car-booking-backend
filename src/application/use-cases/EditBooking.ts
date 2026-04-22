import { BookingStatus } from "../../domain/entities/Booking";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";

export class EditBooking {
  constructor(private readonly bookingRepo: IBookingRepository) {}

  async execute(
    bookingId: string,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Only pending bookings can be edited");
    }

    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    if (startTime < new Date()) {
      throw new Error("Cannot reschedule a booking to the past");
    }

    const overlappingBooking = await this.bookingRepo.findOverlapping(
      booking.carId,
      startTime,
      endTime,
      bookingId
    );

    if (overlappingBooking) {
      throw new Error("Car is already booked for this time");
    }

    await this.bookingRepo.updateBooking(bookingId, startTime, endTime);
  }
}