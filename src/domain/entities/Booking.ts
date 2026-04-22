export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
  CANCELLED = "CANCELLED",
}

export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly carId: string,
    public startTime: Date,
    public endTime: Date,
    public status: BookingStatus = BookingStatus.PENDING
  ) {
    this.validateBookingDates();
  }

  private validateBookingDates(): void {
    if (this.startTime >= this.endTime) {
      throw new Error("Booking start time must be before end time");
    }

    if (this.startTime < new Date()) {
      throw new Error("Cannot create a booking in the past");
    }
  }
}