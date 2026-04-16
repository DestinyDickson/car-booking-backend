import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class LoginUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const secret = process.env.JWT_SECRET || "supersecretkey";

    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "1h" }
    );
  }
}