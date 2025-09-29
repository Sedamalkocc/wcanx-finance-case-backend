# 💰 Finance Case - Backend

---

## 📌 Açıklama

Bu backend, kişisel finans uygulaması için geliştirilmiştir.  
- **NestJS** kullanılarak inşa edilmiştir.  
- **MongoDB (Mongoose)** ile veri tabanı bağlantısı vardır.  
- **JWT Authentication** ile kullanıcı doğrulaması yapılır.  
- Kullanıcılar giriş yaptıktan sonra **Transaction** verilerini ekleyebilir, görüntüleyebilir ve **Raporları** görüntüleyebilirler.  

---

## 🚀 Başlangıç

### 1. Gereksinimler
- [Node.js](https://nodejs.org/) v18+ (önerilen: v20 veya v22)
- [MongoDB](https://www.mongodb.com/) (lokal veya Atlas bağlantısı)

### 2. Projeyi Klonla
```bash
git clone https://github.com/Sedamalkocc/wcanx-finance-case-backend.git
cd finance-case/backend-app
3. Bağımlılıkları Kur
npm install

4. Ortam Değişkenleri

Proje köküne .env dosyası oluştur:

MONGO_URI=mongodb://localhost:27017/wcanx
JWT_SECRET=supersecret123
PORT=4000

5. Çalıştırma
# development (hot reload)
npm run start:dev

# production build
npm run build
npm run start:prod


Backend şu adreste çalışır:
👉 http://localhost:4000

📂 Proje Yapısı
backend-app/
├── src/
│   ├── auth/           # Kullanıcı kayıt ve giriş işlemleri
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── users/             # Kullanıcı verileri
│   │   ├── schemas/user.schema.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │   └── users.controller.ts
│   │
│   ├── transactions/      # Harcama ve gelir işlemleri
│   │   ├── schemas/transaction.schema.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.module.ts
│   │
│   ├── seed/      
│   │   ├── categories.ts
│   │
│   ├── categories/        # Kategoriler
│   │   ├── schema/category.schema.ts
│   │   └── categories.module.ts
│   │   └── categories.service.ts
│   │   └── categories.controller.ts
│   │
│   ├── app.module.ts      # Ana modül
│   └── main.ts            # Uygulama giriş noktası
│
├── test/                  # Test dosyaları
├── .env                   # Ortam değişkenleri
├── package.json
└── tsconfig.json

