import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel } from "../database/models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await UserModel.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;

    return new User(doc.id, doc.name, doc.email, doc.password, doc.role as UserRole);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;

    return new User(doc.id, doc.name, doc.email, doc.password, doc.role as UserRole);
  }
}