import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "../src/presentation/middleware/authMiddleware";
import { UserRole } from "../src/domain/entities/User";

describe("authenticateToken middleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should call next for a valid token", () => {
    const token = jwt.sign(
      {
        userId: "1",
        email: "admin@example.com",
        role: UserRole.ADMIN,
      },
      "supersecretkey"
    );

    req.headers = {
      authorization: `Bearer ${token}`,
    };

    authenticateToken(req as AuthenticatedRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user?.email).toBe("admin@example.com");
  });

  it("should return 401 if no token is provided", () => {
    authenticateToken(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access token is required",
    });
  });

  it("should return 403 for an invalid token", () => {
    req.headers = {
      authorization: "Bearer invalid-token",
    };

    authenticateToken(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
  });
});