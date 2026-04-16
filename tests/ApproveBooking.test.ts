import { ApproveBooking } from "../src/application/use-cases/ApproveBooking";
import { Booking, BookingStatus } from "../src/domain/entities/Booking";
import { CarStatus } from "../src/domain/entities/Car";
import { IBookingRepository } from "../src/domain/repositories/IBookingRepository";
import { ICarRepository } from "../src/domain/repositories/ICarRepository";

describe("ApproveBooking use case", () => {
  let bookingRepo: jest.Mocked<IBookingRepository>;
  let carRepo: jest.Mocked<ICarRepository>;
  let approveBooking: ApproveBooking;

  beforeEach(() => {
    bookingRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findOverlapping: jest.fn(),
      updateStatus: jest.fn(),
    };

    carRepo = {
      findAllAvailable: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    approveBooking = new ApproveBooking(bookingRepo, carRepo);
  });

  it("should approve a pending booking", async () => {
    const booking = new Booking(
      "b1",
      "user1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    bookingRepo.findById.mockResolvedValue(booking);

    await approveBooking.execute("b1");

    expect(bookingRepo.updateStatus).toHaveBeenCalledWith(
      "b1",
      BookingStatus.CONFIRMED
    );
    expect(carRepo.updateStatus).toHaveBeenCalledWith(
      "car1",
      CarStatus.BOOKED
    );
  });

  it("should throw if booking does not exist", async () => {
    bookingRepo.findById.mockResolvedValue(null);

    await expect(approveBooking.execute("b1")).rejects.toThrow(
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

    await expect(approveBooking.execute("b1")).rejects.toThrow(
      "Only pending bookings can be approved"
    );
  });

  it("should throw if booking start time is in the past", async () => {
    const fakeBooking = {
      id: "b1",
      userId: "user1",
      carId: "car1",
      startTime: new Date(Date.now() - 60 * 60 * 1000),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      status: BookingStatus.PENDING,
    };

    bookingRepo.findById.mockResolvedValue(fakeBooking as Booking);

    await expect(approveBooking.execute("b1")).rejects.toThrow(
      "Cannot approve past bookings"
    );
  });
});