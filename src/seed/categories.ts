import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const categoriesService = app.get(CategoriesService);
  const usersService = app.get(UsersService);

  const users = await usersService.findAllUsers();

  const defaultCategories = [
    { name: 'Maaş', type: 'income', color: '#4caf50', priority: 1 },
    { name: 'Bonus', type: 'income', color: '#81c784', priority: 2 },
    { name: 'Yemek', type: 'expense', color: '#f44336', priority: 1 },
    { name: 'Ulaşım', type: 'expense', color: '#e57373', priority: 2 },
    { name: 'Eğlence', type: 'expense', color: '#ff9800', priority: 3 },
  ];

  for (const user of users) {
    const userIdStr = user._id.toString(); // ✅ string’e çevir

    // findAll fonksiyonuna string olarak gönder
    const existing = await categoriesService.findAll(userIdStr);

    for (const cat of defaultCategories) {
      if (!existing.find(e => e.name === cat.name && e.type === cat.type)) {
        await categoriesService.create(userIdStr, cat);
      }
    }
  }

  console.log('Seed işlemi tamamlandı ✅');
  await app.close();
}

bootstrap();
