import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginUser } from "../src/application/use-cases/LoginUser";
import { User, UserRole } from "../src/domain/entities/User";
import { IUserRepository } from "../src/domain/repositories/IUserRepository";

describe("LoginUser use case", () => {
  let userRepo: jest.Mocked<IUserRepository>;
  let loginUser: LoginUser;

  beforeEach(() => {
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    loginUser = new LoginUser(userRepo);
  });

  it("should return a token for valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    userRepo.findByEmail.mockResolvedValue(
      new User(
        "1",
        "Destiny",
        "destiny@example.com",
        hashedPassword,
        UserRole.REGISTERED
      )
    );

    const token = await loginUser.execute("destiny@example.com", "password123");

    expect(typeof token).toBe("string");

    const decoded = jwt.decode(token) as {
      userId: string;
      email: string;
      role: string;
    };

    expect(decoded.email).toBe("destiny@example.com");
    expect(decoded.role).toBe(UserRole.REGISTERED);
  });

  it("should throw if user does not exist", async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      loginUser.execute("missing@example.com", "password123")
    ).rejects.toThrow("Invalid email or password");
  });

  it("should throw if password is invalid", async () => {
    const hashedPassword = await bcrypt.hash("differentpassword", 10);

    userRepo.findByEmail.mockResolvedValue(
      new User(
        "1",
        "Destiny",
        "destiny@example.com",
        hashedPassword,
        UserRole.REGISTERED
      )
    );

    await expect(
      loginUser.execute("destiny@example.com", "password123")
    ).rejects.toThrow("Invalid email or password");
  });
});