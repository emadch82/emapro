<div align="center">
  <h1>🎙️ Soha Podcast App</h1>
  <p>یک پلتفرم جامع پادکست، ویدیو و کتاب برای محتوای فکری و اندیشمندانه</p>
</div>

---

## 📖 معرفی پروژه

**Soha Podcast App** یک اپلیکیشن وب پیشرفته و مدرن است که برای ارائه محتوای صوتی، ویدیویی و متنی طراحی شده است. این پروژه با استفاده از React و TypeScript ساخته شده و قابلیت‌های متنوعی برای مدیریت و پخش محتوا ارائه می‌دهد.

### ✨ ویژگی‌های کلیدی

- 🎧 **پخش پادکست**: پخش کننده صوت پیشرفته با قابلیت کنترل سرعت، جستجو در زمان و مدیریت لیست پخش
- 🎬 **پخش ویدیو**: پشتیبانی کامل از ویدیوهای Aparat با پخش کننده inline و minimized
- 📚 **کتابخانه دیجیتال**: دسترسی به کتاب‌ها و نویسندگان با امکان مشاهده PDF
- 👥 **محفل (Community)**: سیستم تعاملی برای نظرات، پست‌ها و بحث‌ها
- 🔐 **احراز هویت کاربر**: سیستم ورود و ثبت‌نام با ذخیره علاقه‌مندی‌ها
- ⚙️ **پنل مدیریت**: صفحه مدیریت برای افزودن و ویرایش پادکست‌ها و ویدیوها
- 📱 **PWA**: پشتیبانی کامل Progressive Web App با Service Worker
- 🌙 **رابط کاربری فارسی**: طراحی RTL با رابط کاربری زیبا و واکنش‌گرا

---

## 🛠️ تکنولوژی‌های استفاده شده

### Frontend
- **React 19** - کتابخانه UI
- **TypeScript** - تایپ‌ایمنی
- **Vite** - ابزار build و development
- **CSS3** - استایل‌دهی و انیمیشن‌ها

### Backend
- **Node.js** - محیط اجرای JavaScript
- **Express** - فریمورک وب
- **PostgreSQL** - پایگاه داده
- **CORS** - مدیریت درخواست‌های cross-origin

---

## 📁 ساختار پروژه

```
emamobilepro/
├── components/          # کامپوننت‌های React
│   ├── AppHeader.tsx
│   ├── BottomTabs.tsx
│   ├── FullScreenPlayer.tsx
│   ├── MinimizedPlayer.tsx
│   ├── InlineVideoPlayer.tsx
│   ├── PdfViewer.tsx
│   └── ...
├── pages/              # صفحات اصلی اپلیکیشن
│   ├── HomePage.tsx
│   ├── SowtPage.tsx    # صفحه پادکست‌ها
│   ├── VideoListPage.tsx
│   ├── MatnPage.tsx    # صفحه کتاب‌ها
│   ├── CommentsCommunityPage.tsx  # صفحه محفل
│   ├── AdminPage.tsx
│   └── ...
├── services/           # سرویس‌های API
│   └── api.ts
├── data/               # داده‌های محلی
│   ├── database.ts
│   └── database.json
├── utils/              # توابع کمکی
│   ├── helpers.ts
│   └── aparatApi.ts
├── types.ts            # تعریف تایپ‌های TypeScript
├── App.tsx             # کامپوننت اصلی
├── index.tsx           # نقطه ورود
├── vite.config.ts      # تنظیمات Vite
├── service-worker.js   # Service Worker برای PWA
└── soha-backend/       # Backend API
    ├── index.js
    ├── seed.js
    └── package.json
```

---

## 🚀 راه‌اندازی پروژه

### پیش‌نیازها

- **Node.js** نسخه 18 یا بالاتر
- **npm** یا **yarn** یا **pnpm**
- (اختیاری) **PostgreSQL** برای Backend

### نصب و اجرا

1. **کلون کردن پروژه**
   ```bash
   git clone https://github.com/emadch82/emapro.git
   cd emamobilepro
   ```

2. **نصب dependencies**
   ```bash
   npm install
   ```

3. **اجرای پروژه در حالت توسعه**
   ```bash
   npm run dev
   ```
   
   پروژه در آدرس `http://localhost:3000` اجرا می‌شود.

4. **ساخت نسخه production**
   ```bash
   npm run build
   ```

5. **پیش‌نمایش نسخه production**
   ```bash
   npm run preview
   ```

### راه‌اندازی Backend (اختیاری)

اگر می‌خواهید از Backend استفاده کنید:

```bash
cd soha-backend
npm install
```

سپس یک فایل `.env` ایجاد کنید:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soha_db
DB_USER=your_username
DB_PASSWORD=your_password
PORT=5000
```

و اجرا کنید:

```bash
npm start
# یا برای seed کردن دیتابیس
npm run seed
```

---

## 📱 صفحات و قابلیت‌ها

### 🎧 صفحه صوت (Sowt)
- لیست پادکست‌ها با دسته‌بندی
- جستجو در پادکست‌ها
- نمایش نویسندگان و استادان
- پخش اپیزودها
- لیست پخش خودکار

### 🎬 صفحه ویدیو (Videos)
- نمایش ویدیوهای Aparat
- پخش کننده inline و minimized
- نظرات ویدیوها
- جستجو و فیلتر

### 📚 صفحه متن (Matn)
- کتابخانه دیجیتال
- نمایش کتاب‌ها و نویسندگان
- مشاهده PDF کتاب‌ها
- ارتباط کتاب‌ها با پادکست‌ها

### 👥 محفل (Mahfel)
- فید تعاملی پست‌ها
- نظرات و پاسخ‌ها
- لایک و تعامل
- پست‌های سنجاق شده
- پست‌های مرتبط با پادکست و ویدیو

### ⚙️ پنل مدیریت
- افزودن و ویرایش پادکست
- مدیریت ویدیوها
- ویرایش اطلاعات محتوا

### 👤 پروفایل کاربر
- مدیریت علاقه‌مندی‌ها
- کتابخانه شخصی
- تاریخچه پخش
- تنظیمات

---

## 🎮 نحوه استفاده

### پخش پادکست
1. به صفحه **صوت** بروید
2. یک پادکست را انتخاب کنید
3. اپیزود مورد نظر را انتخاب و پخش کنید
4. از کنترل‌های پخش کننده برای جستجو، تغییر سرعت و مدیریت استفاده کنید

### پخش ویدیو
1. به صفحه **ویدیو** بروید
2. ویدیو مورد نظر را انتخاب کنید
3. ویدیو به صورت inline پخش می‌شود
4. می‌توانید ویدیو را minimized کنید و به صفحات دیگر بروید

### افزودن نظر
1. در حین پخش پادکست یا ویدیو، می‌توانید نظر خود را ثبت کنید
2. نظرات به صورت خودکار در محفل نمایش داده می‌شوند
3. می‌توانید به نظرات دیگران پاسخ دهید

### مدیریت محتوا
1. از هدر، به پنل مدیریت بروید
2. پادکست یا ویدیو جدید اضافه کنید
3. اطلاعات موجود را ویرایش کنید

---

## 🔧 تنظیمات پیشرفته

### متغیرهای محیطی

می‌توانید یک فایل `.env.local` ایجاد کنید:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### تنظیمات Vite

فایل `vite.config.ts` را برای تنظیمات خاص خود ویرایش کنید:

```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  // ...
});
```

---

## 📦 ساختار داده

### Podcast
```typescript
interface Podcast {
  id: number;
  title: string;
  description: string;
  cover: string;
  speakerId: number;
  duration: string;
  episodes: Episode[];
  year: number;
  categories: string[];
}
```

### Video
```typescript
interface Video {
  id: string;
  embedId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  viewCount: number;
  uploadDate: string;
  duration: number;
  categories: string[];
}
```

### Book
```typescript
interface Book {
  id: number;
  title: string;
  authorId: number;
  cover: string;
  relatedEpisodes: Array<{podcastId: number; episodeIndex: number}>;
  categories: string[];
}
```

---

## 🎨 طراحی و تجربه کاربری (UI/UX)

این پروژه با تمرکز بر **تجربه کاربری حرفه‌ای** و **طراحی تعاملی** ساخته شده است. تمام جزئیات UI/UX با دقت و با استانداردهای روز صنعت طراحی شده‌اند.

### ✨ ویژگی‌های طراحی تعاملی

#### 🎭 انیمیشن‌ها و ترنزیشن‌ها
- **انیمیشن‌های نرم و روان** با استفاده از CSS transitions و transforms
- **Micro-interactions** در کلیک‌ها و تعاملات کاربر
- **Loading states** برای بهبود درک کاربر از وضعیت سیستم
- **Smooth scrolling** با scroll behavior برای تجربه بهتر

#### 📱 طراحی واکنش‌گرا (Responsive Design)
- **Mobile-First Approach**: طراحی اول برای موبایل سپس برای دسکتاپ
- **Breakpoints دقیق** برای همه اندازه‌های صفحه نمایش
- **Adaptive Layout**: تغییر خودکار چیدمان بر اساس فضای موجود
- **Touch-friendly**: دکمه‌ها و عناصر با اندازه مناسب برای لمس

#### 🎯 تعاملات کاربری پیشرفته
- **Sticky Header**: هدر هوشمند که هنگام اسکرول مخفی می‌شود
- **Minimized Player**: پخش کننده که در پایین صفحه شناور می‌ماند
- **Inline Video Player**: پخش ویدیو بدون نیاز به باز کردن صفحه جدید
- **Toast Notifications**: اعلان‌های ظریف و غیر مزاحم
- **Pull-to-Refresh**: امکان رفرش محتوا با کشیدن صفحه

#### 🌐 پشتیبانی RTL کامل
- **Layout RTL**: چیدمان کامل راست‌به‌چپ برای فارسی
- **Typography RTL**: فونت‌ها و فاصله‌گذاری‌های بهینه شده برای فارسی
- **Direction-aware Components**: همه کامپوننت‌ها از RTL پشتیبانی می‌کنند
- **Icon Alignment**: آیکون‌ها و المان‌های بصری برای RTL تنظیم شده‌اند

#### 🎨 اصول طراحی بصری
- **Visual Hierarchy**: سلسله مراتب بصری واضح برای راهنمایی کاربر
- **Color System**: استفاده از رنگ‌های هماهنگ و معنادار
- **Typography Scale**: سایزهای فونت استاندارد و خوانا
- **Spacing System**: سیستم فاصله‌گذاری منسجم و هماهنگ
- **Shadow & Depth**: استفاده از سایه برای ایجاد عمق و لایه‌بندی

#### 💡 بهبودهای تجربه کاربری
- **Progressive Disclosure**: نمایش تدریجی اطلاعات برای کاهش بار شناختی
- **Feedback Loops**: بازخورد فوری به هر عمل کاربر
- **Error Handling**: نمایش خطاها به صورت کاربرپسند و راهنما
- **Empty States**: طراحی صفحات خالی برای بهبود درک کاربر
- **Loading States**: نمایش وضعیت بارگذاری با انیمیشن و placeholder

#### 🎪 کامپوننت‌های تعاملی
- **Player Controls**: کنترل‌های پخش با hover effects و animations
- **Card Interactions**: کارت‌ها با hover و active states
- **Modal Animations**: باز و بسته شدن مدال‌ها با انیمیشن
- **Form Elements**: فرم‌ها با validation feedback و focus states
- **Navigation**: منوی ناوبری با smooth transitions

---

## 📝 ویژگی‌های PWA

این پروژه یک **Progressive Web App** کامل است که تجربه اپلیکیشن بومی را ارائه می‌دهد:

- **Service Worker** برای کار آفلاین و cache هوشمند
- **Notification API** برای اعلان‌های push با پشتیبانی از Service Worker
- **Installable**: قابلیت نصب روی موبایل و دسکتاپ
- **Offline Support**: دسترسی به محتوای cache شده در حالت آفلاین
- **Fast Loading**: بارگذاری سریع با استفاده از cache استراتژی
- **Background Sync**: همگام‌سازی داده‌ها در پس‌زمینه

---

## 👨‍💻 توسعه‌دهنده

- **Emad Ch** - [GitHub](https://github.com/emadch82)

---

<div align="center">
  <p>ساخته شده با ❤️ برای جامعه ایرانی</p>
</div>
