
const correctAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const now = new Date();
const anHourAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000));
const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
const sixHoursAgo = new Date(now.getTime() - (6 * 60 * 60 * 1000));
const twelveHoursAgo = new Date(now.getTime() - (12 * 60 * 60 * 1000));
const aDayAgo = new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000));
const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
const fourDaysAgo = new Date(now.getTime() - (4 * 24 * 60 * 60 * 1000));
const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));
const aWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
const tenDaysAgo = new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000));
const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
const threeWeeksAgo = new Date(now.getTime() - (21 * 24 * 60 * 60 * 1000));
const aMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

const generateViewCount = () => Math.floor(Math.random() * 5000) + 100;

const authors = [
    { "id": 1, "name": "رضا داوری اردکانی", "avatar": "https://www.cgie.org.ir/uploads/news/2018/5/3(9).jpg", "coverImage": "https://www.cgie.org.ir/uploads/news/2018/5/3(9).jpg", "bio": "فیلسوف و متفکر ایرانی، چهره ماندگار فلسفه و رئیس فرهنگستان علوم ایران.", "role": "master" },
    { "id": 2, "name": "امیر نجات‌بخش", "avatar": "https://soha-sima.ir/wp-content/uploads/2024/03/%D8%A7%D9%85%DB%8C%D8%B1-%D9%86%D8%AC%D8%A7%D8%AA-%D8%A8%D8%AE%D8%B4.jpg", "coverImage": "https://soha-sima.ir/wp-content/uploads/2024/03/%D8%A7%D9%85%DB%8C%D8%B1-%D9%86%D8%AC%D8%A7%D8%AA-%D8%A8%D8%AE%D8%B4.jpg", "bio": "پژوهشگر حوزه فلسفه و اندیشه سیاسی.", "role": "secretary" },
    { "id": 3, "name": "حمیدرضا امینی", "avatar": "https://soha-sima.ir/wp-content/uploads/2024/03/%D8%AD%D9%85%DB%8C%D8%AF%D8%B1%D8%B6%D8%A7-%D8%A7%D9%85%DB%8C%D9%86%DB%8C.jpg", "coverImage": "https://soha-sima.ir/wp-content/uploads/2024/03/%D8%AD%D9%85%DB%8C%D8%AF%D8%B1%D8%B6%D8%A7-%D8%A7%D9%85%DB%8C%D9%86%DB%8C.jpg", "bio": "پژوهشگر و مدرس در زمینه تعلیم و تربیت اسلامی.", "role": "secretary" },
    { "id": 4, "name": "یاسر مرکزی", "avatar": "https://soha-sima.ir/wp-content/uploads/2024/03/%DB%8C%D8%A7%D8%B3%D8%B1-%D9%85%D8%B1%DA%A9%D8%B2%DB%8C.jpg", "coverImage": "https://soha-sima.ir/wp-content/uploads/2024/03/%DB%8C%D8%A7%D8%B3%D8%B1-%D9%85%D8%B1%DA%A9%D8%B2%DB%8C.jpg", "bio": "پژوهشگر و کارشناس مسائل فرهنگی و سیاسی.", "role": "secretary" },
    { "id": 5, "name": "اصغر طاهرزاده", "avatar": "https://simacdn1.iribtv.ir//12//original/2025/01/15/638725394476292855.jpg", "coverImage": "https://simacdn1.iribtv.ir//12//original/2025/01/15/638725394476292855.jpg", "bio": "اندیشمند و نویسنده اسلامی، معروف به تحلیل‌های عمیق در حکمت و عرفان.", "role": "master" },
    { "id": 6, "name": "مرتضی مطهری", "avatar": "https://i1.delgarm.com/images/news/2022/01/31/l_2022_1_31_17_54_58_32001.jpg", "coverImage": "https://i1.delgarm.com/images/news/2022/01/31/l_2022_1_31_17_54_58_32001.jpg", "bio": "فیلسوف، متکلم، مفسر قرآن، نویسنده و از نظریه‌پردازان نظام جمهوری اسلامی ایران.", "role": "master" },
    { "id": 7, "name": "سید علی خامنه‌ای", "avatar": "https://farsi.khamenei.ir/ndata/news/34098/B/34098.jpg", "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj3YuzLKe2ahmxPJJpm3X_NBfHUGmGcQqiKm5H0wQdCgi0IWY8ThOXdm0&s=10", "bio": "دومین رهبر جمهوری اسلامی ایران.", "role": "master" },
    { "id": 8, "name": "سید مهدی شجاعی", "avatar": "https://admin.sooremehr.ir/UPLOAD/Author/e9c122ce-1296-4172-ac24-644b4131af5a.jpg", "coverImage": "https://admin.sooremehr.ir/UPLOAD/Author/e9c122ce-1296-4172-ac24-644b4131af5a.jpg", "bio": "نویسنده و روزنامه‌نگار معاصر ایرانی، مشهور به آثار ادبی با مضامین مذهبی.", "role": "master" },
    { "id": 9, "name": "سیدمرتضی آوینی", "avatar": "https://aviny.com/albums/aviny/Aviny-2/slides/aviny_003.jpg", "coverImage": "https://aviny.com/albums/aviny/Aviny-2/slides/aviny_003.jpg", "bio": "کارگردان فیلم مستند، نویسنده و نظریه‌پرداز «سینمای اشراقی».", "role": "master" },
    { "id": 10, "name": "یوسفعلی میرشکاک", "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhbq9NEOt_TFrwmRGX4P5Qcu19elFDspf5U7_o7tXJYJY1K3o-zpkkqOxu&s=10", "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhbq9NEOt_TFrwmRGX4P5Qcu19elFDspf5U7_o7tXJYJY1K3o-zpkkqOxu&s=10", "bio": "شاعر، نویسنده، طنزپرداز و منتقد هنری ایرانی.", "role": "master" },
    { "id": 11, "name": "یانیس واروفاکیس", "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUzFdhW9T9HjsNm6oZleiKC8pt5zW1Tgapj4GhJD0pRA&s=10", "coverImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUzFdhW9T9HjsNm6oZleiKC8pt5zW1Tgapj4GhJD0pRA&s=10", "bio": "اقتصاددان، سیاستمدار و وزیر دارایی سابق یونان.", "role": "master" },
    { "id": 12, "name": "سُها", "avatar": "https://uploadkon.ir/uploads/ce6e18_25sohamedia.png", "coverImage": "https://uploadkon.ir/uploads/ce6e18_25sohamedia.png", "bio": "رسانه تفکر و اندیشه سُها.", "role": "secretary" }
];
const podcasts = [
    {
        "id": 1,
        "title": "وضع کنونی تفکّر در ایران",
        "description": "اگر جان آزاد شود فهم نیز از بند می‌رهد. با فهم آزاد و به آزادی رسیده است که بی قیل و قال می‌توان از سرگردانی در ذیل یک تاریخ و از غربت و بی خانمانی تاریخی آزاد شد.",
        "cover": "https://soha-sima.ir/wp-content/uploads/2025/05/photo_2025-05-04_13-51-23.jpg",
        "speakerId": 2,
        "duration": "02:45:00",
        "episodes": [
            {
                "title": "جلسه اول",
                "description": "اگر جان آزاد شود فهم نیز از بند می‌رهد...",
                "duration": "01:15:00", "audioUrl": correctAudioUrl, "date": "2025-05-03", "isNew": true, "viewCount": generateViewCount()
            },
            {
                "title": "جلسه دوم",
                "description": "با فهم آزاد و به آزادی رسیده است که بی قیل و قال می‌توان...",
                "duration": "01:30:00", "audioUrl": correctAudioUrl, "date": "2025-05-10", "isNew": true, "viewCount": generateViewCount()
            }
        ],
        "year": 1404, "categories": ["فلسفه و تفکر"]
    },
    {
        "id": 2,
        "title": "دانش‌بنیان و تعلیم و تربیت",
        "description": "چیستی تعلیم و تربیت و جایگاه معلم در نسبت با مسأله‌ی دانش‌بنیان",
        "cover": "https://s6.uupload.ir/files/دانش-بنیان-و-تعلیم-و-تربیت_o6ll.jpg",
        "speakerId": 3,
        "duration": "05:09:00",
        "episodes": [
            {
                "title": "جلسه اول", "description": "با محوریت مقاله؛ نظام آموزشی و آرمان توسعه یافتگله‌ی دانش‌بنیان",
                "duration": "01:40:00", "audioUrl": correctAudioUrl, "date": "2025-05-05", "isNew": true, "viewCount": generateViewCount(), "relatedFileUrl": "https://cdn.lobolmizan.ir/uploads/maaref/hekmat/document/eG2_tarikhe%20falsafe%20va%20kalam%20ta%20ebne%20sina.pdf"
            },
            {
                "title": "جلسه دوم", "description": "آرمان توسعه یافتگی دانش‌بنیان",
                "duration": "01:43:00", "audioUrl": correctAudioUrl, "date": "2025-05-12", "isNew": false, "viewCount": generateViewCount()
            },
            {
                "title": "جلسه سوم", "description": "چیستی تعلیم و تربیت و جایگاه معلم در نسبت با مسأله‌ی دانش‌بنیان",
                "duration": "01:46:00", "audioUrl": correctAudioUrl, "date": "2025-05-19", "isNew": false, "viewCount": generateViewCount()
            }
        ],
        "year": 1404, "categories": ["تعلیم و تربیت"]
    },
    {
        "id": 3,
        "title": "سرمایه‌گذاری برای تولید",
        "description": "گفتگو به مناسبت نام گذاری سال توسط رهبر انقلاب با عنوان: «سرمایه‌گذاری برای تولید»",
        "cover": "https://abrehamrahi.ir/o/bvqHHI-NosffFgdmHnn_Vw/",
        "speakerId": 2,
        "duration": "02:57:00",
        "episodes": [
            {
                "title": "جلسه اول", "description": "گفتگو به مناسبت نام گذاری سال توسط رهبر انقلاب...",
                "duration": "01:37:00", "audioUrl": correctAudioUrl, "date": "2025-04-30", "isNew": true, "viewCount": generateViewCount()
            },
            {
                "title": "جلسه دوم", "description": "گفتگو به مناسبت نام گذاری سال توسط رهبر انقلاب...",
                "duration": "01:20:00", "audioUrl": correctAudioUrl, "date": "2025-05-07", "isNew": false, "viewCount": generateViewCount()
            }
        ],
        "year": 1404, "categories": ["گفتمان پیشرفت"]
    },
    {
        "id": 4,
        "title": "شهید تفکر",
        "description": "متن‌خوانی مقاله‌ی 'اصل اجتهاد در اسلام' نوشته استاد شهید مرتضی مطهری",
        "cover": "https://soha-sima.ir/wp-content/uploads/2025/05/photo_2025-05-04_13-42-48.jpg",
        "speakerId": 4,
        "duration": "01:31:00",
        "episodes": [
            {
                "title": "جلسه اول", "description": "متن‌خوانی مقاله‌ی 'اصل اجتهاد در اسلام'...",
                "duration": "01:31:00", "audioUrl": correctAudioUrl, "date": "2025-05-02", "isNew": true, "viewCount": generateViewCount()
            }
        ],
        "year": 1404, "categories": ["فلسفه و تفکر"]
    },
    {
        "id": 5,
        "title": "شهید مطهری و حضور ایمانی ما",
        "description": "بمناسبت سال‌روزِ شهادتِ شهیدِتفکُّر آیت‌الله؛ مرتضی مطهری (ره)",
        "cover": "https://uploadkon.ir/uploads/fc3918_25photo-2025-10-18-20-05-38.jpg",
        "speakerId": 5,
        "duration": "01:11:00",
        "episodes": [
            {
                "title": "بمناسبت سال‌روزِ شهادتِ شهیدِتفکُّر", "description": "بمناسبت سال‌روزِ شهادتِ شهیدِتفکُّر آیت‌الله؛ مرتضی مطهری (ره)",
                "duration": "01:11:00", "audioUrl": correctAudioUrl, "date": "2025-05-02", "isNew": false, "viewCount": generateViewCount()
            }
        ],
        "year": 1404, "categories": ["فلسفه و تفکر"]
    },
    {
        "id": 6,
        "title": "نظر به‌جایگاه تاریخی حوزه علمیه قم",
        "description": "نظر به‌پیام مقام معظم رهبری به‌مناسبت یکصدمین سالگرد حوزه علمیه‌ی قم",
        "cover": "https://soha-sima.ir/wp-content/uploads/2025/05/photo_2025-05-17_13-41-59.jpg",
        "speakerId": 4,
        "duration": "01:13:00",
        "episodes": [
            {
                "title": "جلسه اول: نظر به‌پیام مقام معظم رهبری", "description": "نظر به‌پیام مقام معظم رهبری به‌مناسبت یکصدمین سالگرد حوزه علمیه‌ی قم",
                "duration": "01:13:00", "audioUrl": correctAudioUrl, "date": "2025-05-09", "isNew": true, "viewCount": generateViewCount()
            }
        ],
        "year": 1404, "categories": ["مدرسه سیاست"]
    },
    {
        "id": 7,
        "title": "کربلا و رازی که شهدا متوجه آن بودند",
        "description": "اَلسَّلامُ عَلَیْکَ یا اَباعَبْدِاللَّهِ وَ عَلَى الاَْرْواحِ الَّتى حَلَّتْ بِفِناَّئِکَ",
        "cover": "https://soha-sima.ir/wp-content/uploads/2024/03/%DA%A9%D8%B1%D8-A8%D9%84%D8%A7-%D9-88-%D8-B1%D8-A7%D8-B2%DB%8C-%DA%A9%D9%87-%D8-B4%D9-87%D8-AF%D8-A7-%D9-85%D8-AA%D9-88%D8-AC%D9%87-%D8-A2%D9-86-%D8-A8%D9-88%D8-AF%D9-86%D8-AF.jpg",
        "speakerId": 2,
        "duration": "00:46:00",
        "episodes": [
            {
                "title": "جلسه اول، اول محرم‌الحرام ۱۴۴۵", "description": "اَلسَّلامُ عَلَیْکَ یا اَباعَبْدِاللَّهِ...",
                "duration": "00:46:00", "audioUrl": correctAudioUrl, "date": "2023-07-16", "isNew": false, "viewCount": generateViewCount()
            }
        ],
        "year": 1402, "categories": ["روضه سها"]
    },
    {
        "id": 8,
        "title": "گفتمان پیشرفت",
        "description": "چگونه پیشرفت در دانشگاه گفتمان می‌شود؟",
        "cover": "https://soha-sima.ir/wp-content/uploads/2024/03/%DA%AF%D9%81%D8%AA%D9%85%D8%A7%D9%86-%D9%BE%DB%8C%D8%B4%D8%B1%D9%81%D8%AA.jpg",
        "speakerId": 2,
        "duration": "01:21:00",
        "episodes": [
            {
                "title": "جلسه اول", "description": "چگونه پیشرفت در دانشگاه گفتمان می‌شود؟",
                "duration": "01:21:00", "audioUrl": correctAudioUrl, "date": "2022-04-04", "isNew": false, "viewCount": generateViewCount()
            }
        ],
        "year": 1401, "categories": ["گفتمان پیشرفت"]
    },
    {
        "id": 9,
        "title": "یوم الفصل – تفسیر سوره نبا",
        "description": "محفل تلاوت قرآن و تفکر در محضر سوره مبارکه 'نباء' با محوریت جزوه تفسیر انفسی سوره نباء استاد طاهرزاده",
        "cover": "https://soha-sima.ir/wp-content/uploads/2024/03/%DB%8C%D9-88%D9-85-%D8-A7%D9-84%D9-81%D8-B5%D9-84-%D8-B3%D9-88%D8-B1%D9-87-%D9-86%D8-A8%D8-A7.jpg",
        "speakerId": 2,
        "duration": "01:00:00",
        "episodes": [
            {
                "title": "محفل تلاوت قرآن و تفکر", "description": "محفل تلاوت قرآن و تفکر در محضر سوره مبارکه 'نباء'...",
                "duration": "01:00:00", "audioUrl": correctAudioUrl, "date": "2024-04-30", "isNew": false, "viewCount": generateViewCount()
            }
        ],
        "year": 1403, "categories": ["هیئت کتاب"]
    },
    {
        "id": 10,
        "title": "جلسات مرشد",
        "description": "بررسی و خوانش کتاب‌های شهید آوینی",
        "cover": "https://aviny.com/albums/aviny/Aviny-2/slides/aviny_003.jpg",
        "speakerId": 4,
        "duration": "02:10:00",
        "episodes": [
            { "title": "جلسه اول - توسعه و مبانی تمدن غرب", "description": "خوانش بخش اول کتاب...", "duration": "01:05:00", "audioUrl": correctAudioUrl, "date": "2022-10-10", "isNew": false, "viewCount": generateViewCount() },
            { "title": "جلسه دوم - توسعه و مبانی تمدن غرب", "description": "خوانش بخش دوم کتاب...", "duration": "01:05:00", "audioUrl": correctAudioUrl, "date": "2022-10-17", "isNew": false, "viewCount": generateViewCount() }
        ],
        "year": 1401, "categories": ["دیدار آوینی", "فلسفه و تفکر"]
    },
    {
        "id": 11,
        "title": "جلسات بهیارصنعت",
        "description": "بررسی اقتصاد از دیدگاه‌های مختلف",
        "cover": "https://cdn.fidibo.com/phoenixpub/content/70b033b9-3460-4e00-933a-73f560282b48/8159570d-2fa1-4dd9-a909-2d8659ca2255.jpg",
        "speakerId": 2,
        "duration": "02:00:00",
        "episodes": [
            { "title": "جلسه اول - حرف‌هایی با دخترم درباره اقتصاد", "description": "بررسی فصل اول و دوم...", "duration": "01:00:00", "audioUrl": correctAudioUrl, "date": "2020-11-05", "isNew": false, "viewCount": generateViewCount() },
            { "title": "جلسه دوم - حرف‌هایی با دخترم درباره اقتصاد", "description": "بررسی فصل سوم و چهارم...", "duration": "01:00:00", "audioUrl": correctAudioUrl, "date": "2020-11-12", "isNew": false, "viewCount": generateViewCount() }
        ],
        "year": 1399, "categories": ["گفتمان پیشرفت"]
    },
    {
        "id": 101, "title": "تکیه‌گاه", "description": "پادکست تکیه‌گاه", "cover": "https://uploadkon.ir/uploads/4eb019_25تکیه-گاه.jpg", "speakerId": 12, "duration": "00:05:00", "episodes": [
            { "title": "تکیه‌گاه", "description": "پادکست تکیه‌گاه", "duration": "00:05:00", "audioUrl": correctAudioUrl, "date": "2024-05-05", "isNew": false, "viewCount": generateViewCount() }
        ], "year": 1403, "categories": ["پادکست"], "isSquare": true
    },
    {
        "id": 102, "title": "این فصل، فصل منوتوست", "description": "پادکست این فصل، فصل منوتوست", "cover": "https://uploadkon.ir/uploads/ccb619_25این-فصل-فصل-منوتوست.jpg", "speakerId": 12, "duration": "00:04:30", "episodes": [
            { "title": "این فصل، فصل منوتوست", "description": "پادکست این فصل، فصل منوتوست", "duration": "00:04:30", "audioUrl": correctAudioUrl, "date": "2024-05-10", "isNew": false, "viewCount": generateViewCount() }
        ], "year": 1403, "categories": ["پادکست"], "isSquare": true
    },
    {
        "id": 103, "title": "وه چه بی رنگ و بی نشان که منم", "description": "پادکست وه چه بی رنگ و بی نشان که منم", "cover": "https://uploadkon.ir/uploads/286619_25وه-چی-بی-رنگ-و-بی-نشان-که-منم.jpg", "speakerId": 12, "duration": "00:06:15", "episodes": [
            { "title": "وه چه بی رنگ و بی نشان که منم", "description": "پادکست وه چه بی رنگ و بی نشان که منم", "duration": "00:06:15", "audioUrl": correctAudioUrl, "date": "2024-05-15", "isNew": false, "viewCount": generateViewCount() }
        ], "year": 1403, "categories": ["پادکست"], "isSquare": true
    }
];
const books = [
    {
        "id": 201, "title": "وضع کنونی تفکر در ایران", "authorId": 1, "cover": "https://www.iranketab.ir/Images/ProductImages/3c2a376cc9ef4abdae439ebef3fe0540.jpg",
        "relatedEpisodes": [{ "podcastId": 1, "episodeIndex": 0 }, { "podcastId": 1, "episodeIndex": 1 }],
        "categories": ["فلسفه و تفکر"], "addedDate": "2024-07-20T12:00:00.000Z",
        "description": "این کتاب به بررسی عمیق وضعیت تفکر در ایران معاصر می‌پردازد و ریشه‌های تاریخی و فلسفی آن را واکاوی می‌کند. داوری اردکانی با نگاهی انتقادی، چالش‌ها و فرصت‌های پیش روی اندیشه ایرانی را به تصویر می‌کشد."
    },
    {
        "id": 202, "title": "ما و راه دشوار تجدد", "authorId": 1, "cover": "https://www.iranketab.ir/Images/ProductImages/3c2a376cc9ef4abdae439ebef3fe0540.jpg",
        "relatedEpisodes": [{ "podcastId": 1, "episodeIndex": 0 }],
        "categories": ["فلسفه و تفکر"], "addedDate": "2024-07-16T12:00:00.000Z",
        "description": "در این اثر، نویسنده به تحلیل مفهوم تجدد و چالش‌های رویارویی جامعه ایران با آن می‌پردازد. کتاب سفری است در تاریخ اندیشه معاصر ایران برای فهم بهتر موقعیت کنونی ما."
    },
    {
        "id": 203, "title": "راز دانش‌بنیانی اقتصاد و فرهنگ", "authorId": 3, "cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjohW0qUPxE1QdevksY0l7XmuTIjhhd9N_96F2OfpPMQ&s=10",
        "relatedEpisodes": [{ "podcastId": 2, "episodeIndex": 0 }, { "podcastId": 2, "episodeIndex": 1 }, { "podcastId": 2, "episodeIndex": 2 }],
        "categories": ["تعلیم و تربیت", "گفتمان پیشرفت"], "addedDate": "2024-07-14T12:00:00.000Z",
        "description": "این کتاب به ارتباط متقابل و حیاتی میان توسعه دانش‌بنیان، اقتصاد پویا و فرهنگ غنی می‌پردازد و راهکارهایی برای هم‌افزایی این سه حوزه ارائه می‌دهد."
    },
    {
        "id": 204, "title": "بی‌شعوری", "authorId": 2, "cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0uBOAArxi2fFgMIOSQPtwTdpBb2rNuxho05yXnb75HGQ5AvIUVsG36DQw&s=10",
        "relatedEpisodes": [{ "podcastId": 3, "episodeIndex": 0 }, { "podcastId": 3, "episodeIndex": 1 }],
        "categories": ["گفتمان پیشرفت"], "addedDate": "2024-07-19T12:00:00.000Z",
        "description": "تحلیلی روانشناختی و اجتماعی از پدیده‌ی بی‌شعوری در جوامع مدرن که با زبانی طنزآمیز و در عین حال عمیق، به نقد رفتارهای فردی و اجتماعی می‌پردازد."
    },
    {
        "id": 205, "title": "انسان ۲۵۰ ساله", "authorId": 7, "cover": "https://patoghketab.ir/file/attach/202309/20647-FD660A57-5EF0-45A9-B20C-12501393F7E6.jpg",
        "relatedEpisodes": [{ "podcastId": 6, "episodeIndex": 0 }],
        "categories": ["مدرسه سیاست"], "addedDate": "2024-07-11T12:00:00.000Z",
        "description": "مجموعه‌ای از بیانات رهبر معظم انقلاب درباره سیره سیاسی و مبارزاتی ائمه معصومین (ع) که تصویری یکپارچه از حرکت جهادی آن بزرگواران در طول ۲۵۰ سال را ارائه می‌دهد."
    },
    {
        "id": 206, "title": "ده گفتار", "authorId": 6, "cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHFSXKfzketUaunh1urBbG0ShYYFZRgPTOGcmJTSJjwg&s=10",
        "relatedEpisodes": [{ "podcastId": 4, "episodeIndex": 0 }],
        "categories": ["فلسفه و تفکر"], "addedDate": "2024-06-21T12:00:00.000Z",
        "description": "کتابی شامل ده سخنرانی از استاد شهید مطهری در موضوعات گوناگون فکری و اجتماعی از جمله تقوا، امر به معروف و نهی از منکر، و ریشه‌های انقلاب اسلامی ایران."
    },
    {
        "id": 207, "title": "آفتاب در حجاب", "authorId": 8, "cover": "https://sooremehr.ir/wp-content/uploads/2023/07/39364-1.jpg",
        "relatedEpisodes": [{ "podcastId": 7, "episodeIndex": 0 }],
        "categories": ["روضه سها"], "addedDate": "2024-07-07T12:00:00.000Z",
        "description": "روایتی ادبی و جانسوز از زندگی و مصائب حضرت زینب (س) از کودکی تا واقعه کربلا و پس از آن، که با نثری شیوا و احساسی به رشته تحریر درآمده است."
    },
    {
        "id": 208, "title": "تفسیر سوره حمد", "authorId": 5, "cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmo-ic1g_-k2oAn4ngaK6kqEJvDj3goNnT44A16d4xIA&s=10",
        "relatedEpisodes": [{ "podcastId": 9, "episodeIndex": 0 }],
        "categories": ["هیئت کتاب"], "addedDate": "2024-07-18T12:00:00.000Z",
        "description": "اثری عمیق و عرفانی در شرح و تفسیر ام‌الکتاب، سوره حمد، که با نگاهی توحیدی به لایه‌های باطنی آیات این سوره مبارکه می‌پردازد."
    },
    {
        "id": 209, "title": "توسعه و مبانی تمدن غرب", "authorId": 9, "cover": "https://img.ketabrah.ir/img/l/216341519098485.jpg",
        "relatedEpisodes": [{ "podcastId": 10, "episodeIndex": 0 }, { "podcastId": 10, "episodeIndex": 1 }],
        "categories": ["دیدار آوینی", "فلسفه و تفکر"], "addedDate": "2024-07-17T12:00:00.000Z",
        "description": "مجموعه مقالاتی از شهید آوینی که در آن به نقد ماهیت توسعه غربی و مبانی فلسفی آن پرداخته و نسبت آن را با فرهنگ و هویت جوامع غیرغربی به چالش می‌کشد."
    },
    {
        "id": 210, "title": "از زبان یک یاغی", "authorId": 10, "cover": "https://www.iranketab.ir/Images/ProductImages/a12b2e841280468696ec0da2921a97e6.jpg",
        "relatedEpisodes": [{ "podcastId": 8, "episodeIndex": 0 }],
        "categories": ["فلسفه و تفکر"], "addedDate": "2024-07-14T11:00:00.000Z",
        "description": "گزیده‌ای از اشعار و نوشته‌های یوسفعلی میرشکاک که با زبان تند و تیز و نگاه انتقادی خود، به مسائل فرهنگی و اجتماعی روزگار خود می‌تازد."
    },
    {
        "id": 211, "title": "حرف‌هایی با دخترم درباره اقتصاد", "authorId": 11, "cover": "https://cdn.fidibo.com/phoenixpub/content/70b033b9-3460-4e00-933a-73f560282b48/8159570d-2fa1-4dd9-a909-2d8659ca2255.jpg",
        "relatedEpisodes": [{ "podcastId": 11, "episodeIndex": 0 }, { "podcastId": 11, "episodeIndex": 1 }, { "podcastId": 3, "episodeIndex": 0 }],
        "categories": ["گفتمان پیشرفت"], "addedDate": "2024-07-21T10:00:00.000Z",
        "description": "یانیس واروفاکیس، اقتصاددان مشهور، در این کتاب مفاهیم پیچیده اقتصادی را با زبانی ساده و در قالب نامه‌هایی به دخترش توضیح می‌دهد و به خواننده کمک می‌کند تا بفهمد اقتصاد چگونه دنیای ما را شکل می‌دهد."
    }
];
const videos = [
    { "id": "f15yj6l", "embedId": "f15yj6l", "title": "انسان و ابعاد وجودی اش", "description": "این برنامه اگر خیلی خیلی بهتر از اینی بود که هست...", "thumbnailUrl": "https://static.cdn.asset.aparat.cloud/avt/41113644-1226-l__4721.jpg?width=900&quality=90&secret=ZCuKXFOuoQ7J-5Vzbsx4YQ", "viewCount": 1567, "likes": 123, "uploadDate": "۱ سال پیش", "duration": 4020, "categories": ["فلسفه و تفکر"] },
    { "id": "irxz764", "embedId": "irxz764", "title": "پیمان علم؛ پیمان کربلایی", "description": "شايد براي آنها كه هنوز نمي‌خواهند حقيقت را باور كنند...", "thumbnailUrl": "https://static.cdn.asset.aparat.cloud/avt/64427406-5270-l__3012.jpg?width=900&quality=90&secret=urkC0-T50seX_8UeeTAfBg", "viewCount": 64, "likes": 12, "uploadDate": "۲ ماه پیش", "duration": 355, "categories": ["فلسفه و تفکر"] },
    { "id": "afk3a3r", "embedId": "afk3a3r", "title": "سالک روح‌الله", "description": "سلوک ذیل شخصیت امام خمینی رحمة‌الله‌علیه", "thumbnailUrl": "https://static.cdn.asset.aparat.cloud/avt/64800402-4408-l__6008.jpg?width=900&quality=90&secret=yVd8Ztt1qFJG0-1Qk5VOQQ", "viewCount": 27, "likes": 8, "uploadDate": "۱ ماه پیش", "duration": 1735, "categories": ["قصه مقاومت"] },
    { "id": "sdfl08i", "embedId": "sdfl08i", "title": "ملت ایران", "description": "روایتی از حرکت ملت ایران در میانه طوفان...", "thumbnailUrl": "https://static.cdn.asset.aparat.cloud/avt/65073478-3551-l__6884.jpg?width=900&quality=90&secret=hW0FYZWAhdOn4QsZU1SpeQ", "viewCount": 132, "likes": 34, "uploadDate": "۳ هفته پیش", "duration": 856, "categories": ["فلسفه و تفکر", "دیدار آوینی"] },
    { "id": "nbn8b7e", "embedId": "nbn8b7e", "title": "منزل نهایی", "description": "جایگاه تاریخی استقبال از زائر اربعینی", "thumbnailUrl": "https://static.cdn.asset.aparat.cloud/avt/65629948-7889-l__6311.jpg?width=900&quality=90&secret=PWh0x3cs-cYS2Qs_veWGYg", "viewCount": 155, "likes": 50, "uploadDate": "۱ هفته پیش", "duration": 2629, "categories": ["گفتمان پیشرفت"] },
    { "id": "gaz3auq", "embedId": "gaz3auq", "title": "تماشاگه راز", "description": "گروه های فیلمبرداری ما با همان انگیزه هایی که رزم آوران...", "thumbnailUrl": "https://static.cdn.asset.aparat.cloud/avt/64200075-7115-l__4578.jpg?width=900&quality=90&secret=IEJTnVfQ3U75T4hVWJGywQ", "viewCount": 111, "likes": 25, "uploadDate": "۳ ماه پیش", "duration": 720, "categories": ["فلسفه و تفکر"] }
];
const comments = [
    { "id": 1, "type": "podcast", "author": "محمد رضایی", "text": "این اپیزود واقعاً دیدگاهم رو نسبت به فلسفه عوض کرد...", "date": "۲ روز پیش", "isoDate": twoDaysAgo.toISOString(), "episodeTitle": "جلسه اول", "podcastTitle": "وضع کنونی تفکّر در ایران", "podcastId": 1, "episodeIndex": 0, "likes": 24, "isFeatured": true },
    { "id": 2, "type": "podcast", "author": "فاطمه محمدی", "text": "بحث بسیار عمیق و کاربردی بود...", "date": "۳ روز پیش", "isoDate": threeDaysAgo.toISOString(), "episodeTitle": "جلسه اول", "podcastTitle": "دانش‌بنیان و تعلیم و تربیت", "podcastId": 2, "episodeIndex": 0, "likes": 18, "isFeatured": true, "timestamp": 125 },
    { "id": 6, "type": "video", "author": "کاربر ویدیو", "text": "این بخش از صحبت‌ها در مورد ابعاد وجودی انسان...", "date": "۴ روز پیش", "isoDate": fourDaysAgo.toISOString(), "videoId": "f15yj6l", "videoTitle": "انسان و ابعاد وجودی اش", "likes": 55, "isFeatured": true },
    { "id": 3, "type": "podcast", "author": "علی حسینی", "text": "تفسیر بسیار زیبا و عمیقی از سوره نبا ارائه شد...", "date": "۱ هفته پیش", "isoDate": aWeekAgo.toISOString(), "episodeTitle": "محفل تلاوت قرآن و تفکر", "podcastTitle": "یوم الفصل – تفسیر سوره نبا", "podcastId": 9, "episodeIndex": 0, "likes": 32, "isFeatured": true },
    { "id": 4, "type": "podcast", "author": "سارا احمدی", "text": "نگاه استاد طاهرزاده همیشه منحصر به فرده...", "date": "۳ هفته پیش", "isoDate": threeWeeksAgo.toISOString(), "episodeTitle": "بمناسبت سال‌روزِ شهادتِ شهیدِتفکُّر", "podcastTitle": "شهید مطهری و حضور ایمانی ما", "podcastId": 5, "episodeIndex": 0, "likes": 41, "isFeatured": false },
    { "id": 5, "type": "podcast", "author": "دانشجوی فلسفه", "text": "اینکه چطور غربت تاریخی رو به آزادی فهم گره زدن...", "date": "۱ ماه پیش", "isoDate": aMonthAgo.toISOString(), "episodeTitle": "جلسه اول", "podcastTitle": "وضع کنونی تفکّر در ایران", "podcastId": 1, "episodeIndex": 0, "likes": 15, "isFeatured": false, "timestamp": 932 }
];
const posts = [
    { "id": 1005, "author": "سُها", "authorAvatarUrl": "https://uploadkon.ir/uploads/ce6e18_25sohamedia.png", "date": "۱ ساعت پیش", "isoDate": anHourAgo.toISOString(), "text": "برنامه هفتگی سُها:\n\n- **شنبه‌ها:** جلسه «وضع کنونی تفکر در ایران»\n- **دوشنبه‌ها:** انتشار ویدیوی جدید\n- **چهارشنبه‌ها:** پادکست‌های کوتاه\n\nهمراه ما باشید!", "likes": 210, "comments": [], "reactions": { "❤️": 95, "🙏": 42 }, "isPinned": true },
    { "id": 1001, "author": "سُها", "authorAvatarUrl": "https://uploadkon.ir/uploads/ce6e18_25sohamedia.png", "date": "۱ روز پیش", "isoDate": aDayAgo.toISOString(), "text": "ویدیوی جدیدی در کانال منتشر شد! «ملت ایران»...", "videoId": "sdfl08i", "likes": 152, "comments": [
        { "id": 1, "author": "علی مرادی", "authorAvatarUrl": "https://i.pravatar.cc/150?u=a042581f4e29026704d", "text": "عالی بود! مثل همیشه پر از نکات عمیق و قابل تامل.", "date": "۱۲ ساعت پیش", "isoDate": twelveHoursAgo.toISOString() },
        { "id": 2, "author": "مریم حسینی", "authorAvatarUrl": "https://i.pravatar.cc/150?u=a042581f4e29026704e", "text": "ممنون از شما بابت این محتوای ارزشمند.", "date": "۳ ساعت پیش", "isoDate": threeHoursAgo.toISOString(), "replyTo": 1 }
    ], "reactions": { "👍": 78, "🎉": 12 } },
    { "id": 1006, "author": "سُها", "authorAvatarUrl": "https://uploadkon.ir/uploads/ce6e18_25sohamedia.png", "date": "۲ روز پیش", "isoDate": twoDaysAgo.toISOString(), "text": "پادکست جدید «وه چه بی رنگ و بی نشان که منم» منتشر شد.", "podcastId": 103, "episodeIndex": 0, "likes": 88, "comments": [], "reactions": { "❤️": 50 } },
    { "id": 1002, "author": "سُها", "authorAvatarUrl": "https://uploadkon.ir/uploads/ce6e18_25sohamedia.png", "date": "۳ روز پیش", "isoDate": threeDaysAgo.toISOString(), "text": "«اگر جان آزاد شود فهم نیز از بند می‌رهد...»", "likes": 98, "comments": [
        { "id": 3, "author": "دانشجوی فلسفه", "authorAvatarUrl": "https://i.pravatar.cc/150?u=a042581f4e29026704f", "text": "این جمله از کدام جلسه است؟ بسیار زیباست.", "date": "۲ روز پیش", "isoDate": twoDaysAgo.toISOString() }
    ], "reactions": { "💡": 23 } }
];

module.exports = {
  authors,
  podcasts,
  books,
  videos,
  comments,
  posts
};
