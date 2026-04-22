import { Booking, BookingStatus } from "../entities/Booking";

export interface IBookingRepository {
  save(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findOverlapping(
    carId: string,
    start: Date,
    end: Date,
    excludeBookingId?: string
  ): Promise<Booking | null>;
  updateStatus(id: string, status: BookingStatus): Promise<void>;
  updateBooking(id: string, startTime: Date, endTime: Date): Promise<void>;
}