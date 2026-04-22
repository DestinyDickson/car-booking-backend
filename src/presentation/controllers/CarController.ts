import { Request, Response } from "express";
import { ICarRepository } from "../../domain/repositories/ICarRepository";

export class CarController {
  constructor(private readonly carRepo: ICarRepository) {}

  getAvailableCars = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cars = await this.carRepo.findAllAvailable();

      res.status(200).json({
        message: "Available cars retrieved successfully",
        cars,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}