import { CreateBooking } from "../src/application/use-cases/CreateBooking";
import { Booking, BookingStatus } from "../src/domain/entities/Booking";
import { Car, CarStatus } from "../src/domain/entities/Car";
import { IBookingRepository } from "../src/domain/repositories/IBookingRepository";
import { ICarRepository } from "../src/domain/repositories/ICarRepository";

describe("CreateBooking use case", () => {
  let bookingRepo: jest.Mocked<IBookingRepository>;
  let carRepo: jest.Mocked<ICarRepository>;
  let createBooking: CreateBooking;

  beforeEach(() => {
    bookingRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findOverlapping: jest.fn(),
      updateStatus: jest.fn(),
      updateBooking: jest.fn(),
    };

    carRepo = {
      findAllAvailable: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    createBooking = new CreateBooking(bookingRepo, carRepo);
  });

  it("should create a booking successfully", async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000);

    carRepo.findById.mockResolvedValue(
      new Car("car1", "Toyota", "Corolla", "ABC123", CarStatus.AVAILABLE)
    );
    bookingRepo.findOverlapping.mockResolvedValue(null);

    const result = await createBooking.execute("user1", "car1", start, end);

    expect(result.userId).toBe("user1");
    expect(result.carId).toBe("car1");
    expect(result.status).toBe(BookingStatus.PENDING);
    expect(bookingRepo.save).toHaveBeenCalledTimes(1);
  });

  it("should throw if car does not exist", async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000);

    carRepo.findById.mockResolvedValue(null);

    await expect(
      createBooking.execute("user1", "car1", start, end)
    ).rejects.toThrow("Car not found");
  });

  it("should throw if car is in maintenance", async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000);

    carRepo.findById.mockResolvedValue(
      new Car("car1", "Toyota", "Corolla", "ABC123", CarStatus.MAINTENANCE)
    );

    await expect(
      createBooking.execute("user1", "car1", start, end)
    ).rejects.toThrow("Car is not available");
  });

  it("should throw if booking overlaps", async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000);

    carRepo.findById.mockResolvedValue(
      new Car("car1", "Toyota", "Corolla", "ABC123", CarStatus.AVAILABLE)
    );

    bookingRepo.findOverlapping.mockResolvedValue(
      new Booking(
        "b1",
        "user2",
        "car1",
        new Date(Date.now() + 70 * 60 * 1000),
        new Date(Date.now() + 90 * 60 * 1000)
      )
    );

    await expect(
      createBooking.execute("user1", "car1", start, end)
    ).rejects.toThrow("Car is already booked for this time");
  });
});