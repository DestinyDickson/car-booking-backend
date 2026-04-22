import { Request, Response } from "express";
import { CarController } from "../src/presentation/controllers/CarController";
import { ICarRepository } from "../src/domain/repositories/ICarRepository";
import { Car, CarStatus } from "../src/domain/entities/Car";

describe("CarController", () => {
  let carRepo: jest.Mocked<ICarRepository>;
  let controller: CarController;
  let res: Partial<Response>;

  beforeEach(() => {
    carRepo = {
      findAllAvailable: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    controller = new CarController(carRepo);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return available cars", async () => {
    carRepo.findAllAvailable.mockResolvedValue([
      new Car("c1", "Toyota", "Corolla", "ABC123", CarStatus.AVAILABLE),
      new Car("c2", "Honda", "Civic", "XYZ789", CarStatus.AVAILABLE),
    ]);

    await controller.getAvailableCars({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Available cars retrieved successfully",
      cars: expect.any(Array),
    });
  });

  it("should handle repository error", async () => {
    carRepo.findAllAvailable.mockRejectedValue(new Error("DB error"));

    await controller.getAvailableCars({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "DB error",
    });
  });
});