import { Booking, BookingStatus } from "../../domain/entities/Booking";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { BookingModel } from "../database/models/BookingModel";

export class MongoBookingRepository implements IBookingRepository {
  async save(booking: Booking): Promise<void> {
    await BookingModel.create({
      _id: booking.id,
      userId: booking.userId,
      carId: booking.carId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
    });
  }

  async findById(id: string): Promise<Booking | null> {
    const doc = await BookingModel.findById(id);
    if (!doc) return null;

    return new Booking(
      doc.id,
      doc.userId,
      doc.carId,
      new Date(doc.startTime),
      new Date(doc.endTime),
      doc.status as BookingStatus
    );
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const docs = await BookingModel.find({ userId });

    return docs.map(
      (doc) =>
        new Booking(
          doc.id,
          doc.userId,
          doc.carId,
          new Date(doc.startTime),
          new Date(doc.endTime),
          doc.status as BookingStatus
        )
    );
  }

  async findOverlapping(
    carId: string,
    start: Date,
    end: Date
  ): Promise<Booking | null> {
    const doc = await BookingModel.findOne({
      carId,
      status: { $ne: BookingStatus.CANCELLED },
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (!doc) return null;

    return new Booking(
      doc.id,
      doc.userId,
      doc.carId,
      new Date(doc.startTime),
      new Date(doc.endTime),
      doc.status as BookingStatus
    );
  }

  async updateStatus(id: string, status: BookingStatus): Promise<void> {
    await BookingModel.findByIdAndUpdate(id, { status });
  }
}