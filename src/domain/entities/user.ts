export enum UserRole {
  GUEST = "GUEST",
  REGISTERED = "REGISTERED",
  ADMIN = "ADMIN",
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public password: string,
    public readonly role: UserRole = UserRole.REGISTERED
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name.trim()) {
      throw new Error("User name is required");
    }

    if (!this.email.trim()) {
      throw new Error("User email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error("Invalid email format");
    }

    if (!this.password.trim()) {
      throw new Error("Password is required");
    }

    if (this.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  }
}