import { BookingStatus } from "../../domain/entities/Booking";
import { CarStatus } from "../../domain/entities/Car";

import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { ICarRepository } from "../../domain/repositories/ICarRepository";

export class ApproveBooking {
  constructor(
    private bookingRepo: IBookingRepository,
    private carRepo: ICarRepository
  ) {}

  async execute(bookingId: string): Promise<void> {
    
    // 1. Find booking
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.startTime < new Date()) {
      throw new Error("Cannot approve past bookings");
    }

    //2. Ensure booking is still pending
    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Only pending bookings can be approved");
    }

    //3. Update booking status → CONFIRMED
    await this.bookingRepo.updateStatus(
      bookingId,
      BookingStatus.CONFIRMED
    );

    //4. Update car status → BOOKED
    await this.carRepo.updateStatus(
      booking.carId,
      CarStatus.BOOKED
    );
  }
}