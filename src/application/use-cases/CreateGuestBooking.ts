import crypto from "crypto";
import { Booking } from "../../domain/entities/Booking";
import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { CreateBooking } from "./CreateBooking";

export class CreateGuestBooking {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly createBooking: CreateBooking
  ) {}

  async execute(
    name: string,
    email: string,
    carId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Booking> {
    let user = await this.userRepo.findByEmail(email);

    if (!user) {
      user = new User(
        crypto.randomUUID(),
        name,
        email,
        "guest123",
        UserRole.GUEST
      );

      await this.userRepo.save(user);
    }

    return this.createBooking.execute(
      user.id,
      carId,
      startTime,
      endTime
    );
  }
}