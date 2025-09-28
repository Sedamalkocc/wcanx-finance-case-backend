import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findByType(userId: string, type: 'income' | 'expense'): Promise<Category[]> {
  return this.categoryModel.find({ userId: new Types.ObjectId(userId), type }).sort({ priority: 1 }).exec();
}

async getStats(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('Invalid userId');
  }

  const objUserId = new Types.ObjectId(userId);

  return this.categoryModel.aggregate([
    { $match: { userId: objUserId } },
    {
      $lookup: {
        from: 'transactions', 
        localField: '_id',
        foreignField: 'categoryId',
        as: 'transactions',
      },
    },
    {
      $addFields: {
        totalAmount: { $sum: '$transactions.amount' },
        count: { $size: '$transactions' },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        type: 1,
        totalAmount: 1,
        count: 1,
      },
    },
    { $sort: { name: 1 } },
  ]);
}


}
