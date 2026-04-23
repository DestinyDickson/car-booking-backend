import { BookingStatus } from "../../domain/entities/Booking";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";

export class CancelBooking {
  constructor(private readonly bookingRepo: IBookingRepository) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error("Booking is already cancelled");
    }

    if (booking.status === BookingStatus.DECLINED) {
      throw new Error("Declined bookings cannot be cancelled");
    }

    await this.bookingRepo.updateStatus(bookingId, BookingStatus.CANCELLED);
  }
}