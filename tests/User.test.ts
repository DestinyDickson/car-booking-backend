import { User, UserRole } from "../src/domain/entities/User";

describe("User entity", () => {
  it("should create a valid user", () => {
    const user = new User(
      "1",
      "Destiny",
      "destiny@example.com",
      "Password123",
      UserRole.ADMIN
    );

    expect(user.id).toBe("1");
    expect(user.role).toBe(UserRole.ADMIN);
  });

  it("should throw if name is empty", () => {
    expect(
      () => new User("1", "", "destiny@example.com", "Password123")
    ).toThrow("User name is required");
  });

  it("should throw if email is empty", () => {
    expect(
      () => new User("1", "Destiny", "", "Password123")
    ).toThrow("User email is required");
  });

  it("should throw if email format is invalid", () => {
    expect(
      () => new User("1", "Destiny", "bad-email", "Password123")
    ).toThrow("Invalid email format");
  });

  it("should throw if password is empty", () => {
    expect(
      () => new User("1", "Destiny", "destiny@example.com", "")
    ).toThrow("Password is required");
  });

  it("should throw if password is too short", () => {
    expect(
      () => new User("1", "Destiny", "destiny@example.com", "123")
    ).toThrow("Password must be at least 6 characters long");
  });
});