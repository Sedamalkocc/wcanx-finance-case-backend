import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(userId: string, dto: any): Promise<Category> {
    const category = new this.categoryModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return category.save();
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ priority: 1 })
      .exec();
  }

  async update(userId: string, id: string, dto: any): Promise<Category | null> {
    return this.categoryModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      dto,
      { new: true },
    );
  }

  async remove(userId: string, id: string): Promise<Category | null> {
    return this.categoryModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
  }
}
