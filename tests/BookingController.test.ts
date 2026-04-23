import { Request, Response } from "express";
import { BookingController } from "../src/presentation/controllers/BookingController";
import { CreateBooking } from "../src/application/use-cases/CreateBooking";
import { ApproveBooking } from "../src/application/use-cases/ApproveBooking";
import { DeclineBooking } from "../src/application/use-cases/DeclineBooking";
import { EditBooking } from "../src/application/use-cases/EditBooking";
import { CreateGuestBooking } from "../src/application/use-cases/CreateGuestBooking";
import { CancelBooking } from "../src/application/use-cases/CancelBooking";
import { IBookingRepository } from "../src/domain/repositories/IBookingRepository";
import { Booking, BookingStatus } from "../src/domain/entities/Booking";

describe("BookingController", () => {
  let createBooking: jest.Mocked<CreateBooking>;
  let approveBooking: jest.Mocked<ApproveBooking>;
  let declineBooking: jest.Mocked<DeclineBooking>;
  let editBooking: jest.Mocked<EditBooking>;
  let cancelBooking: jest.Mocked<CancelBooking>;
  let createGuestBooking: jest.Mocked<CreateGuestBooking>;
  let bookingRepo: jest.Mocked<IBookingRepository>;
  let controller: BookingController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    createBooking = { execute: jest.fn() } as any;
    approveBooking = { execute: jest.fn() } as any;
    declineBooking = { execute: jest.fn() } as any;
    editBooking = { execute: jest.fn() } as any;
    cancelBooking = { execute: jest.fn() } as any;
    createGuestBooking = { execute: jest.fn() } as any;

    bookingRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findOverlapping: jest.fn(),
      updateStatus: jest.fn(),
      updateBooking: jest.fn(),
    };

    controller = new BookingController(
      createBooking,
      approveBooking,
      declineBooking,
      editBooking,
      cancelBooking,
      bookingRepo,
      createGuestBooking
    );

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create a booking", async () => {
    req.body = {
      userId: "u1",
      carId: "c1",
      startTime: "2030-01-01T10:00:00.000Z",
      endTime: "2030-01-01T11:00:00.000Z",
    };

    const booking = new Booking(
      "b1",
      "u1",
      "c1",
      new Date("2030-01-01T10:00:00.000Z"),
      new Date("2030-01-01T11:00:00.000Z"),
      BookingStatus.PENDING
    );

    createBooking.execute.mockResolvedValue(booking);

    await controller.create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should create a guest booking", async () => {
    req.body = {
      name: "Guest",
      email: "guest@test.com",
      carId: "c1",
      startTime: "2030-01-01T12:00:00.000Z",
      endTime: "2030-01-01T13:00:00.000Z",
    };

    const booking = new Booking(
      "b2",
      "g1",
      "c1",
      new Date("2030-01-01T12:00:00.000Z"),
      new Date("2030-01-01T13:00:00.000Z"),
      BookingStatus.PENDING
    );

    createGuestBooking.execute.mockResolvedValue(booking);

    await controller.guestCreate(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should approve a booking", async () => {
    req.params = { bookingId: "b1" };

    await controller.approve(req as Request, res as Response);

    expect(approveBooking.execute).toHaveBeenCalledWith("b1");
  });

  it("should decline a booking", async () => {
    req.params = { bookingId: "b1" };

    await controller.decline(req as Request, res as Response);

    expect(declineBooking.execute).toHaveBeenCalledWith("b1");
  });

  it("should edit a booking", async () => {
    req.params = { bookingId: "b1" };
    req.body = {
      startTime: "2030-01-01T14:00:00.000Z",
      endTime: "2030-01-01T15:00:00.000Z",
    };

    await controller.edit(req as Request, res as Response);

    expect(editBooking.execute).toHaveBeenCalled();
  });

  it("should cancel a booking", async () => {
    req.params = { bookingId: "b1" };

    await controller.cancel(req as Request, res as Response);

    expect(cancelBooking.execute).toHaveBeenCalledWith("b1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Booking cancelled successfully",
    });
  });

  it("should get bookings by user", async () => {
    req.params = { userId: "u1" };
    bookingRepo.findByUserId.mockResolvedValue([]);

    await controller.getBookingsByUser(req as Request, res as Response);

    expect(bookingRepo.findByUserId).toHaveBeenCalledWith("u1");
  });

  it("should handle create error", async () => {
    req.body = {
      userId: "u1",
      carId: "c1",
      startTime: "2030-01-01T10:00:00.000Z",
      endTime: "2030-01-01T11:00:00.000Z",
    };

    createBooking.execute.mockRejectedValue(new Error("Car not found"));

    await controller.create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});