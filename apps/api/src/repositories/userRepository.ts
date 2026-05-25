import { User, type UserDocument } from "../models/User";

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }).exec(),
  findById: (id: string) => User.findById(id).exec(),
  create: (data: Partial<UserDocument>) => User.create(data),
  markEmailVerified: (id: string) => User.findByIdAndUpdate(id, { emailVerified: true }).exec(),
  updatePassword: (id: string, passwordHash: string) =>
    User.findByIdAndUpdate(id, { passwordHash }).exec(),
};
