import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  category: string;

  @Prop()
  note?: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
