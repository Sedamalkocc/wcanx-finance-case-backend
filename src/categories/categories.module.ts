import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { Category,CategorySchema } from './schema/category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  providers: [CategoriesService],
  exports: [CategoriesService], // ✅ export et ki seed script bulabilsin
})
export class CategoriesModule {}
