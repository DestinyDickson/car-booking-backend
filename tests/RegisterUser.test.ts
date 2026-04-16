import { RegisterUser } from "../src/application/use-cases/RegisterUser";
import { User, UserRole } from "../src/domain/entities/User";
import { IUserRepository } from "../src/domain/repositories/IUserRepository";

describe("RegisterUser use case", () => {
  let userRepo: jest.Mocked<IUserRepository>;
  let registerUser: RegisterUser;

  beforeEach(() => {
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    registerUser = new RegisterUser(userRepo);
  });

  it("should register a new user successfully", async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    const user = await registerUser.execute(
      "Destiny",
      "destiny@example.com",
      "password123"
    );

    expect(user.name).toBe("Destiny");
    expect(user.email).toBe("destiny@example.com");
    expect(user.role).toBe(UserRole.REGISTERED);
    expect(user.password).not.toBe("password123");
    expect(userRepo.save).toHaveBeenCalledTimes(1);
  });

  it("should throw if email already exists", async () => {
    userRepo.findByEmail.mockResolvedValue(
      new User(
        "1",
        "Existing User",
        "destiny@example.com",
        "hashedpassword",
        UserRole.REGISTERED
      )
    );

    await expect(
      registerUser.execute("Destiny", "destiny@example.com", "password123")
    ).rejects.toThrow("User with this email already exists");
  });
});