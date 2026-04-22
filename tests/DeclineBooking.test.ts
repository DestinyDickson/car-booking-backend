import { DeclineBooking } from "../src/application/use-cases/DeclineBooking";
import { Booking, BookingStatus } from "../src/domain/entities/Booking";
import { IBookingRepository } from "../src/domain/repositories/IBookingRepository";

describe("DeclineBooking use case", () => {
  let bookingRepo: jest.Mocked<IBookingRepository>;
  let declineBooking: DeclineBooking;

  beforeEach(() => {
    bookingRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findOverlapping: jest.fn(),
      updateStatus: jest.fn(),
      updateBooking: jest.fn(),
    };

    declineBooking = new DeclineBooking(bookingRepo);
  });

  it("should decline a pending booking", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    bookingRepo.findById.mockResolvedValue(booking);

    await declineBooking.execute("b1");

    expect(bookingRepo.updateStatus).toHaveBeenCalledWith(
      "b1",
      BookingStatus.DECLINED
    );
  });

  it("should throw if booking does not exist", async () => {
    bookingRepo.findById.mockResolvedValue(null);

    await expect(declineBooking.execute("b1")).rejects.toThrow(
      "Booking not found"
    );
  });

  it("should throw if booking is not pending", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.CONFIRMED
    );

    bookingRepo.findById.mockResolvedValue(booking);

    await expect(declineBooking.execute("b1")).rejects.toThrow(
      "Only pending bookings can be declined"
    );
  });
});