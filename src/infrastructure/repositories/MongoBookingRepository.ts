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
      doc._id.toString(),
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
          doc._id.toString(),
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
    end: Date,
    excludeBookingId?: string
  ): Promise<Booking | null> {
    const query: any = {
      carId,
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      startTime: { $lt: end },
      endTime: { $gt: start },
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const doc = await BookingModel.findOne(query);

    if (!doc) return null;

    return new Booking(
      doc._id.toString(),
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

  async updateBooking(
    id: string,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    await BookingModel.findByIdAndUpdate(id, { startTime, endTime });
  }
}