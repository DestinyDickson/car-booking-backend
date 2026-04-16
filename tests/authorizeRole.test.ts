import { Response, NextFunction } from "express";
import {
  authorizeRole,
  AuthenticatedRequest,
} from "../src/presentation/middleware/authMiddleware";
import { UserRole } from "../src/domain/entities/User";

describe("authorizeRole middleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should call next when user has an allowed role", () => {
    req.user = {
      userId: "1",
      email: "admin@example.com",
      role: UserRole.ADMIN,
    };

    const middleware = authorizeRole(UserRole.ADMIN);

    middleware(req as AuthenticatedRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if user is not authenticated", () => {
    const middleware = authorizeRole(UserRole.ADMIN);

    middleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication required",
    });
  });

  it("should return 403 if user role is not allowed", () => {
    req.user = {
      userId: "2",
      email: "user@example.com",
      role: UserRole.REGISTERED,
    };

    const middleware = authorizeRole(UserRole.ADMIN);

    middleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access denied",
    });
  });
});