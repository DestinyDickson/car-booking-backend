import { User, UserRole } from "../src/domain/entities/User";

describe("User entity", () => {
  it("should create a valid user", () => {
    const user = new User("1", "Destiny", "destiny@example.com", UserRole.ADMIN);

    expect(user.id).toBe("1");
    expect(user.role).toBe(UserRole.ADMIN);
  });

  it("should throw if name is empty", () => {
    expect(() => new User("1", "", "destiny@example.com")).toThrow(
      "User name is required"
    );
  });

  it("should throw if email is empty", () => {
    expect(() => new User("1", "Destiny", "")).toThrow(
      "User email is required"
    );
  });

  it("should throw if email format is invalid", () => {
    expect(() => new User("1", "Destiny", "bad-email")).toThrow(
      "Invalid email format"
    );
  });
});