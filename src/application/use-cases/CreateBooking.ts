import crypto from "crypto";
import { Booking, BookingStatus } from "../../domain/entities/Booking";
import { CarStatus } from "../../domain/entities/Car";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { ICarRepository } from "../../domain/repositories/ICarRepository";

export class CreateBooking {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly carRepo: ICarRepository
  ) {}

  async execute(
    userId: string,
    carId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Booking> {
    const car = await this.carRepo.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    if (car.status !== CarStatus.AVAILABLE) {
      throw new Error("Car is not available");
    }

    const overlappingBooking = await this.bookingRepo.findOverlapping(
      carId,
      startTime,
      endTime
    );

    if (overlappingBooking) {
      throw new Error("Car is already booked for this time");
    }

    const booking = new Booking(
      crypto.randomUUID(),
      userId,
      carId,
      startTime,
      endTime,
      BookingStatus.PENDING
    );

    await this.bookingRepo.save(booking);

    return booking;
  }
}