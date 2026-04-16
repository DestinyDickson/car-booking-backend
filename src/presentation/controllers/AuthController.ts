import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { UserRole } from "../../domain/entities/User";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      const user = await this.registerUser.execute(
        name,
        email,
        password,
        role ?? UserRole.REGISTERED
      );

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const token = await this.loginUser.execute(email, password);

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      res.status(401).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}