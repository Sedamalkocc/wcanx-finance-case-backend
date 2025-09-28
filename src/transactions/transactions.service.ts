import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { PipelineStage } from 'mongoose';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(userId: string, dto: any): Promise<Transaction> {
    const newTransaction = new this.transactionModel({
      ...dto,
      userId: Types.ObjectId.createFromHexString(userId),
      categoryId: Types.ObjectId.createFromHexString(dto.categoryId),
    });
    return newTransaction.save();
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({ userId: Types.ObjectId.createFromHexString(userId) })
      .sort({ date: -1 })
      .populate('categoryId')
      .exec();
  }

async findOne(userId: string, id: string): Promise<Transaction | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid transaction id');
  }

  return this.transactionModel.findOne({ 
    _id: new Types.ObjectId(id), 
    userId: new Types.ObjectId(userId) 
  }).exec();
}

  async update(userId: string, id: string, dto: any): Promise<Transaction | null> {
    return this.transactionModel.findOneAndUpdate(
      { _id: Types.ObjectId.createFromHexString(id), userId: Types.ObjectId.createFromHexString(userId) },
      dto,
      { new: true },
    );
  }

  async remove(userId: string, id: string): Promise<Transaction | null> {
    return this.transactionModel.findOneAndDelete({
      _id: Types.ObjectId.createFromHexString(id),
      userId: Types.ObjectId.createFromHexString(userId),
    });
  }

async getSummary(
  userId: string,
  period: 'weekly' | 'monthly' = 'monthly',
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }
  const objUserId = new Types.ObjectId(userId);

  const startDate = new Date();
  if (period === 'weekly') {
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate.setMonth(startDate.getMonth() - 1);
  }
const pipeline: any[] = [
  {
    $match: {
      userId: new Types.ObjectId(userId),
      date: { $gte: startDate },
    },
  },
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  },
  { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: '$category._id',
      totalAmount: { $sum: '$amount' },
      type: { $first: '$type' },
      categoryName: { $first: '$category.name' },
      color: { $first: '$category.color' },
    },
  },
  {
    $project: {
      _id: 0,
      categoryName: 1,
      type: 1,
      color: 1,
      totalAmount: 1,
    },
  },
  { $sort: { totalAmount: -1 } },
];

return this.transactionModel.aggregate(pipeline);

}

}
