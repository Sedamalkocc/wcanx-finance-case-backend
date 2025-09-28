import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: { username: string; email: string; password: string }) {
    const user = new this.userModel(data);
    return user.save();
  }

  async findAllUsers() {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, data: Partial<{ username: string; email: string; password: string }>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
