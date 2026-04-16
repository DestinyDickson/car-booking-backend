import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class RegisterUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.REGISTERED
  ): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User(
      crypto.randomUUID(),
      name,
      email,
      hashedPassword,
      role
    );

    await this.userRepo.save(user);

    return user;
  }
}