import { Car, CarStatus } from "../../domain/entities/Car";
import { ICarRepository } from "../../domain/repositories/ICarRepository";
import { CarModel } from "../database/models/CarModel";

export class MongoCarRepository implements ICarRepository {
  async findAllAvailable(): Promise<Car[]> {
    const docs = await CarModel.find({ status: CarStatus.AVAILABLE });

    return docs.map(
      (doc) =>
        new Car(
          doc._id.toString(),
          doc.make,
          doc.model,
          doc.plateNumber,
          doc.status as CarStatus
        )
    );
  }

  async findById(id: string): Promise<Car | null> {
    const doc = await CarModel.findById(id);

    if (!doc) return null;

    return new Car(
      doc._id.toString(),
      doc.make,
      doc.model,
      doc.plateNumber,
      doc.status as CarStatus
    );
  }

  async updateStatus(id: string, status: CarStatus): Promise<void> {
    await CarModel.findByIdAndUpdate(id, { status });
  }
}