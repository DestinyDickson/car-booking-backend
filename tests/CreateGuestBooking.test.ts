import { CreateGuestBooking } from "../src/application/use-cases/CreateGuestBooking";
import { CreateBooking } from "../src/application/use-cases/CreateBooking";
import { Booking, BookingStatus } from "../src/domain/entities/Booking";
import { User, UserRole } from "../src/domain/entities/User";
import { IUserRepository } from "../src/domain/repositories/IUserRepository";

describe("CreateGuestBooking use case", () => {
  let userRepo: jest.Mocked<IUserRepository>;
  let createBooking: jest.Mocked<CreateBooking>;
  let createGuestBooking: CreateGuestBooking;

  beforeEach(() => {
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    createBooking = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateBooking>;

    createGuestBooking = new CreateGuestBooking(userRepo, createBooking);
  });

  it("should create a guest user and booking", async () => {
    const booking = new Booking(
      "b1",
      "guest-user-id",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    userRepo.findByEmail.mockResolvedValue(null);
    createBooking.execute.mockResolvedValue(booking);

    const result = await createGuestBooking.execute(
      "Guest User",
      "guest@test.com",
      "car1",
      booking.startTime,
      booking.endTime
    );

    expect(userRepo.save).toHaveBeenCalledTimes(1);
    expect(createBooking.execute).toHaveBeenCalledTimes(1);
    expect(result).toBe(booking);
  });

  it("should reuse existing guest user if email already exists", async () => {
    const existingUser = new User(
      "guest1",
      "Guest User",
      "guest@test.com",
      "guest123",
      UserRole.GUEST
    );

    const booking = new Booking(
      "b1",
      "guest1",
      "car1",
      new Date(Date.now() + 60 * 60 * 1000),
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      BookingStatus.PENDING
    );

    userRepo.findByEmail.mockResolvedValue(existingUser);
    createBooking.execute.mockResolvedValue(booking);

    const result = await createGuestBooking.execute(
      "Guest User",
      "guest@test.com",
      "car1",
      booking.startTime,
      booking.endTime
    );

    expect(userRepo.save).not.toHaveBeenCalled();
    expect(createBooking.execute).toHaveBeenCalledWith(
      "guest1",
      "car1",
      booking.startTime,
      booking.endTime
    );
    expect(result).toBe(booking);
  });
});