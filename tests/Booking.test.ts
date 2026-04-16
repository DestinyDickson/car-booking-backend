import { Booking, BookingStatus } from "../src/domain/entities/Booking";

describe("Booking entity", () => {
  it("should create a valid booking", () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const booking = new Booking("1", "user1", "car1", start, end);

    expect(booking.id).toBe("1");
    expect(booking.status).toBe(BookingStatus.PENDING);
  });

  it("should throw if start time is after end time", () => {
    const start = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000);

    expect(() => new Booking("1", "user1", "car1", start, end)).toThrow(
      "Booking start time must be before end time"
    );
  });

  it("should throw if booking is in the past", () => {
    const start = new Date(Date.now() - 60 * 60 * 1000);
    const end = new Date(Date.now() + 60 * 60 * 1000);

    expect(() => new Booking("1", "user1", "car1", start, end)).toThrow(
      "Cannot create a booking in the past"
    );
  });
});