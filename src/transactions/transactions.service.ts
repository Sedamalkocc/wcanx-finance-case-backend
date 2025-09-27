import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
  ) {}

  async create(userId: string, dto: any): Promise<Transaction> {
    const newTransaction = new this.transactionModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return newTransaction.save();
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ userId }).sort({ date: -1 }).exec();
  }

async findOne(userId: string, id: string): Promise<Transaction | null> {
  return this.transactionModel.findOne({ _id: id, userId }).exec();
}

  async update(userId: string, id: string, dto: any) {
    return this.transactionModel.findOneAndUpdate(
      { _id: id, userId },
      dto,
      { new: true },
    );
  }

  async remove(userId: string, id: string) {
    return this.transactionModel.findOneAndDelete({ _id: id, userId });
  }
}
