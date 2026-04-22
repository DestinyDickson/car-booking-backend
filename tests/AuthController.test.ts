import { Request, Response } from "express";
import { AuthController } from "../src/presentation/controllers/AuthController";
import { RegisterUser } from "../src/application/use-cases/RegisterUser";
import { LoginUser } from "../src/application/use-cases/LoginUser";
import { UserRole } from "../src/domain/entities/User";

describe("AuthController", () => {
  let registerUser: jest.Mocked<RegisterUser>;
  let loginUser: jest.Mocked<LoginUser>;
  let controller: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    registerUser = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RegisterUser>;

    loginUser = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<LoginUser>;

    controller = new AuthController(registerUser, loginUser);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should register a user", async () => {
    req.body = {
      name: "Destiny",
      email: "destiny@example.com",
      password: "Password123",
    };

    registerUser.execute.mockResolvedValue({
      id: "u1",
      name: "Destiny",
      email: "destiny@example.com",
      password: "hashed",
      role: UserRole.REGISTERED,
    } as any);

    await controller.register(req as Request, res as Response);

    expect(registerUser.execute).toHaveBeenCalledWith(
      "Destiny",
      "destiny@example.com",
      "Password123",
      UserRole.REGISTERED
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      user: {
        id: "u1",
        name: "Destiny",
        email: "destiny@example.com",
        role: UserRole.REGISTERED,
      },
    });
  });

  it("should handle register error", async () => {
    req.body = {
      name: "Destiny",
      email: "destiny@example.com",
      password: "Password123",
    };

    registerUser.execute.mockRejectedValue(new Error("Email already exists"));

    await controller.register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email already exists",
    });
  });

  it("should login a user", async () => {
    req.body = {
      email: "destiny@example.com",
      password: "Password123",
    };

    loginUser.execute.mockResolvedValue("fake-jwt-token");

    await controller.login(req as Request, res as Response);

    expect(loginUser.execute).toHaveBeenCalledWith(
      "destiny@example.com",
      "Password123"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token: "fake-jwt-token",
    });
  });

  it("should handle login error", async () => {
    req.body = {
      email: "destiny@example.com",
      password: "wrong",
    };

    loginUser.execute.mockRejectedValue(new Error("Invalid email or password"));

    await controller.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email or password",
    });
  });
});