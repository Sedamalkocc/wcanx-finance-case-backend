import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(userId: string, dto: any): Promise<Transaction> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    const newTransaction = new this.transactionModel({
      ...dto,
      userId: new Types.ObjectId(userId),
      categoryId: dto.categoryId && Types.ObjectId.isValid(dto.categoryId)
        ? new Types.ObjectId(dto.categoryId)
        : null,
    });

    return newTransaction.save();
  }

  async findAll(userId: string): Promise<Transaction[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .populate('categoryId')
      .exec();
  }

  async findOne(userId: string, id: string): Promise<Transaction> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid id');
    }

    const transaction = await this.transactionModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .populate('categoryId')
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(userId: string, id: string, dto: any): Promise<Transaction> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid id');
    }

    const updated = await this.transactionModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      },
      dto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Transaction not found');
    }

    return updated;
  }

  async remove(userId: string, id: string): Promise<Transaction> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid id');
    }

    const deleted = await this.transactionModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!deleted) {
      throw new NotFoundException('Transaction not found');
    }

    return deleted;
  }

  async getSummary(userId: string, period: 'weekly' | 'monthly' = 'monthly') {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    const objUserId = new Types.ObjectId(userId);

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === 'weekly') {
      const currentDay = now.getDay(); // 0=Sunday
      const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

      startDate = new Date(now);
      startDate.setDate(now.getDate() + diffToMonday);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    return this.transactionModel.aggregate([
      {
        $match: {
          userId: objUserId,
          date: { $gte: startDate, $lte: endDate },
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
    ]);
  }
}
