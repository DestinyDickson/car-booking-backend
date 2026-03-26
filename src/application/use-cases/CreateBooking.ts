import crypto from "crypto";

import { Booking, BookingStatus } from "../../domain/entities/Booking";
import { CarStatus } from "../../domain/entities/Car";

import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { ICarRepository } from "../../domain/repositories/ICarRepository";

export class CreateBooking {
  constructor(
    private bookingRepo: IBookingRepository,
    private carRepo: ICarRepository
  ) {}

  async execute(
    userId: string,
    carId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Booking> {

    //1. Check if car exists
    const car = await this.carRepo.findById(carId);
    if (!car) {
      throw new Error("Car not found");
    }

    //2. Check if car is available
    if (car.status !== CarStatus.AVAILABLE) {
      throw new Error("Car is not available");
    }

    //3. Check overlapping bookings
    const overlappingBooking = await this.bookingRepo.findOverlapping(
      carId,
      startTime,
      endTime
    );

    if (overlappingBooking) {
      throw new Error("Car is already booked for this time");
    }

    //4. Create booking (entity validates dates)
    const booking = new Booking(
      crypto.randomUUID(),
      userId,
      carId,
      startTime,
      endTime,
      BookingStatus.PENDING
    );

    //5. Save booking
    await this.bookingRepo.save(booking);

    return booking;
  }
}