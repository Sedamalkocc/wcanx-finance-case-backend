import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // "income" veya "expense"

  @Prop({ default: '#000000' })
  color: string;

  @Prop({ default: 0 })
  priority: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
