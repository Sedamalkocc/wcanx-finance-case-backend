import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/categories/schema/category.schema';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['income', 'expense'], required: true })
  type: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: String })
  note: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
