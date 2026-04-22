import { BookingStatus } from "../../domain/entities/Booking";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";

export class DeclineBooking {
  constructor(private readonly bookingRepo: IBookingRepository) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Only pending bookings can be declined");
    }

    await this.bookingRepo.updateStatus(bookingId, BookingStatus.DECLINED);
  }
}