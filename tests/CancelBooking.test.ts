import { CancelBooking } from "../src/application/use-cases/CancelBooking";
import { Booking, BookingStatus } from "../src/domain/entities/Booking";
import { IBookingRepository } from "../src/domain/repositories/IBookingRepository";

describe("CancelBooking use case", () => {
  let bookingRepo: jest.Mocked<IBookingRepository>;
  let cancelBooking: CancelBooking;

  beforeEach(() => {
    bookingRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findOverlapping: jest.fn(),
      updateStatus: jest.fn(),
      updateBooking: jest.fn(),
    };

    cancelBooking = new CancelBooking(bookingRepo);
  });

  it("should cancel a booking successfully", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    bookingRepo.findById.mockResolvedValue(booking);

    await cancelBooking.execute("b1");

    expect(bookingRepo.updateStatus).toHaveBeenCalledWith(
      "b1",
      BookingStatus.CANCELLED
    );
  });

  it("should throw if booking does not exist", async () => {
    bookingRepo.findById.mockResolvedValue(null);

    await expect(cancelBooking.execute("b1")).rejects.toThrow(
      "Booking not found"
    );
  });

  it("should throw if booking is already cancelled", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.CANCELLED
    );

    bookingRepo.findById.mockResolvedValue(booking);

    await expect(cancelBooking.execute("b1")).rejects.toThrow(
      "Booking is already cancelled"
    );
  });

  it("should throw if booking is declined", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.DECLINED
    );

    bookingRepo.findById.mockResolvedValue(booking);

    await expect(cancelBooking.execute("b1")).rejects.toThrow(
      "Declined bookings cannot be cancelled"
    );
  });
});