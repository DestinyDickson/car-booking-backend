import { EditBooking } from "../src/application/use-cases/EditBooking";
import { Booking, BookingStatus } from "../src/domain/entities/Booking";
import { IBookingRepository } from "../src/domain/repositories/IBookingRepository";

describe("EditBooking use case", () => {
  let bookingRepo: jest.Mocked<IBookingRepository>;
  let editBooking: EditBooking;

  beforeEach(() => {
    bookingRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findOverlapping: jest.fn(),
      updateStatus: jest.fn(),
      updateBooking: jest.fn(),
    };

    editBooking = new EditBooking(bookingRepo);
  });

  it("should edit a pending booking", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    const newStart = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const newEnd = new Date(Date.now() + 4 * 60 * 60 * 1000);

    bookingRepo.findById.mockResolvedValue(booking);
    bookingRepo.findOverlapping.mockResolvedValue(null);

    await editBooking.execute("b1", newStart, newEnd);

    expect(bookingRepo.updateBooking).toHaveBeenCalledWith(
      "b1",
      newStart,
      newEnd
    );
  });

  it("should throw if booking does not exist", async () => {
    const newStart = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const newEnd = new Date(Date.now() + 4 * 60 * 60 * 1000);

    bookingRepo.findById.mockResolvedValue(null);

    await expect(editBooking.execute("b1", newStart, newEnd)).rejects.toThrow(
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

    const newStart = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const newEnd = new Date(Date.now() + 4 * 60 * 60 * 1000);

    bookingRepo.findById.mockResolvedValue(booking);

    await expect(editBooking.execute("b1", newStart, newEnd)).rejects.toThrow(
      "Only pending bookings can be edited"
    );
  });

  it("should throw if start time is after end time", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    const newStart = new Date(Date.now() + 5 * 60 * 60 * 1000);
    const newEnd = new Date(Date.now() + 4 * 60 * 60 * 1000);

    bookingRepo.findById.mockResolvedValue(booking);

    await expect(editBooking.execute("b1", newStart, newEnd)).rejects.toThrow(
      "Start time must be before end time"
    );
  });

  it("should throw if new time overlaps", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    const newStart = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const newEnd = new Date(Date.now() + 4 * 60 * 60 * 1000);

    const overlap = new Booking(
      "b2",
      "user2",
      "car1",
      newStart,
      newEnd,
      BookingStatus.CONFIRMED
    );

    bookingRepo.findById.mockResolvedValue(booking);
    bookingRepo.findOverlapping.mockResolvedValue(overlap);

    await expect(editBooking.execute("b1", newStart, newEnd)).rejects.toThrow(
      "Car is already booked for this time"
    );
  });
});