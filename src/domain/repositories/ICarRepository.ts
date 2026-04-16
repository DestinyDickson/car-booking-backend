import { Car, CarStatus } from "../entities/Car";

export interface ICarRepository {
  findAllAvailable(): Promise<Car[]>;
  findById(id: string): Promise<Car | null>;
  updateStatus(id: string, status: CarStatus): Promise<void>;
}