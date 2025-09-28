import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

const priorityColors: Record<number, string> = {
  1: "#b71c1c",   // koyu kırmızı
    2: "#f44336",   // açık kırmızı
    3: "#ff9800",   // turuncu
    4: "#ffc107",   // sarı
    5: "#4caf50",   // yeşil
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const categoriesService = app.get(CategoriesService);
  const usersService = app.get(UsersService);

  const users = await usersService.findAllUsers();

  const defaultCategories = [
    { name: 'Maaş', type: 'income', priority: 1 },
    { name: 'Bonus', type: 'income', priority: 2 },
    { name: 'Yemek', type: 'expense', priority: 1 },
    { name: 'Ulaşım', type: 'expense', priority: 2 },
    { name: 'Eğlence', type: 'expense', priority: 3 },
  ];

  for (const user of users) {
    const userIdStr = user._id.toString();

    const existing = await categoriesService.findAll(userIdStr);

    for (const cat of defaultCategories) {
      if (!existing.find(e => e.name === cat.name && e.type === cat.type)) {
        const color = priorityColors[cat.priority] || '#000000';
        await categoriesService.create(userIdStr, { ...cat, color });
      }
    }
  }
  console.log('Seed işlemi tamamlandı ✅');
  await app.close();
}

bootstrap();
