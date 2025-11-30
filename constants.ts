
import { AppProduct, Order, User, TeamMember, PointTransaction } from './types';

export const MOCK_APPS: AppProduct[] = [
  {
    id: 'app-1',
    name: 'ZenFocus',
    name_ar: 'زن فوكس',
    tagline: 'Minimalist Productivity Timer',
    tagline_ar: 'مؤقت إنتاجية بسيط وفعال',
    description: 'A distraction-free productivity timer that combines the Pomodoro technique with ambient nature sounds and a built-in task manager.',
    description_ar: 'مؤقت إنتاجية خالٍ من المشتتات يجمع بين تقنية بومودورو وأصوات الطبيعة المحيطة ومدير مهام مدمج.',
    price: 49,
    category: 'Productivity',
    category_ar: 'الإنتاجية',
    features: ['Customizable timer', 'Binaural beats', 'Task grouping', 'Dark mode'],
    features_ar: ['مؤقت قابل للتخصيص', 'نغمات بكلتا الأذنين', 'تجميع المهام', 'الوضع الداكن'],
    techStack: ['React Native', 'Redux', 'Firebase'],
    targetAudience: 'Students and remote workers',
    targetAudience_ar: 'الطلاب والعاملون عن بعد',
    imageSeed: 101,
    licenseType: 'Standard',
    reviews: [
      {
        id: 'rev-1',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        rating: 5,
        comment: 'This app blueprint saved me weeks of work. The code is clean and the design is beautiful.',
        comment_ar: 'وفر لي مخطط التطبيق هذا أسابيع من العمل. الكود نظيف والتصميم جميل.',
        date: 'Oct 20, 2023'
      },
      {
        id: 'rev-2',
        userName: 'Mike Ross',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        rating: 4,
        comment: 'Great layout, easy to customize. Could use more documentation on the Redux setup though.',
        comment_ar: 'تخطيط رائع وسهل التخصيص. يحتاج إلى مزيد من التوثيق حول إعداد Redux.',
        date: 'Nov 05, 2023'
      }
    ]
  },
  {
    id: 'app-2',
    name: 'FitBuddy AI',
    name_ar: 'رفيق اللياقة الذكي',
    tagline: 'Your Personal Pocket Trainer',
    tagline_ar: 'مدربك الشخصي في جيبك',
    description: 'Uses computer vision to analyze your workout form in real-time through your phone camera and provides instant feedback.',
    description_ar: 'يستخدم الرؤية الحاسوبية لتحليل شكل تمرينك في الوقت الفعلي من خلال كاميرا هاتفك ويقدم ملاحظات فورية.',
    price: 199,
    category: 'Health & Fitness',
    category_ar: 'الصحة واللياقة',
    features: ['Form correction', 'Rep counting', 'Workout plans', 'Progress analytics'],
    features_ar: ['تصحح الوضعية', 'عد التكرارات', 'خطط تمرين', 'تحليلات التقدم'],
    techStack: ['Flutter', 'TensorFlow Lite', 'Node.js'],
    targetAudience: 'Home workout enthusiasts',
    targetAudience_ar: 'عشاق التمارين المنزلية',
    imageSeed: 102,
    licenseType: 'Standard',
    reviews: [
      {
        id: 'rev-3',
        userName: 'David G.',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        rating: 5,
        comment: 'Incredible AI implementation. The TensorFlow integration is seamless.',
        comment_ar: 'تطبيق مذهل للذكاء الاصطناعي. تكامل TensorFlow سلس للغاية.',
        date: 'Dec 12, 2023'
      }
    ]
  },
  {
    id: 'app-3',
    name: 'CryptoScout',
    name_ar: 'مستكشف الكريبتو',
    tagline: 'Real-time Gem Detector',
    tagline_ar: 'كاشف العملات الرقمية النادرة',
    description: 'An advanced analytics dashboard that aggregates social sentiment and on-chain data to spot trending tokens before they explode.',
    description_ar: 'لوحة تحكم تحليلية متقدمة تجمع بين المشاعر الاجتماعية والبيانات المتسلسلة لاكتشاف الرموز المميزة الشائعة قبل صعودها.',
    price: 299,
    category: 'Finance',
    category_ar: 'المالية',
    features: ['Whale alerts', 'Twitter sentiment', 'Portfolio tracker', 'Gas tracker'],
    features_ar: ['تنبيهات الحيتان', 'تحليل مشاعر تويتر', 'تتبع المحفظة', 'تتبع الغاز'],
    techStack: ['Next.js', 'GraphQL', 'Solidity'],
    targetAudience: 'Crypto traders',
    targetAudience_ar: 'متداولو العملات الرقمية',
    imageSeed: 103,
    licenseType: 'Extended'
  },
  {
    id: 'app-4',
    name: 'LocalBites',
    name_ar: 'أكلات محلية',
    tagline: 'Home Cooked Meals Delivered',
    tagline_ar: 'وجبات منزلية تصلك لبابك',
    description: 'A marketplace connecting verified home cooks with neighbors looking for authentic, homemade meals not available in restaurants.',
    description_ar: 'سوق يربط الطهاة المنزليين المعتمدين بالجيران الباحثين عن وجبات منزلية أصيلة غير متوفرة في المطاعم.',
    price: 89,
    category: 'Food & Drink',
    category_ar: 'الطعام والشراب',
    features: ['Cook verification', 'Menu scheduling', 'Delivery tracking', 'Reviews'],
    features_ar: ['التحقق من الطهاة', 'جدولة القائمة', 'تتبع التوصيل', 'المراجعات'],
    techStack: ['Swift', 'Kotlin', 'AWS Amplify'],
    targetAudience: 'Foodies and busy professionals',
    targetAudience_ar: 'عشاق الطعام والمهنيون المشغولون',
    imageSeed: 104,
    licenseType: 'Standard'
  },
  {
    id: 'app-5',
    name: 'TravelMate',
    name_ar: 'رفيق السفر',
    tagline: 'AI Trip Planner',
    tagline_ar: 'مخطط رحلات بالذكاء الاصطناعي',
    description: 'Generate complete travel itineraries based on your budget, interests, and travel dates in seconds.',
    description_ar: 'أنشئ مسارات سفر كاملة بناءً على ميزانيتك واهتماماتك وتواريخ سفرك في ثوانٍ.',
    price: 75,
    category: 'Travel',
    category_ar: 'السفر',
    features: ['Budget optimization', 'Hotel booking', 'Hidden gems finder', 'Offline maps'],
    features_ar: ['تحسين الميزانية', 'حجز الفنادق', 'استكشاف الأماكن المخفية', 'خرائط بلا إنترنت'],
    techStack: ['React', 'Google Maps API', 'OpenAI API'],
    targetAudience: 'Backpackers and families',
    targetAudience_ar: 'الرحالة والعائلات',
    imageSeed: 105,
    licenseType: 'Standard'
  }
];

export const MOCK_VENDOR_APPS: AppProduct[] = [
  {
    id: 'ven-1',
    name: 'InventoryMaster',
    name_ar: 'سيد المخزون',
    tagline: 'SaaS Inventory Management',
    tagline_ar: 'نظام إدارة المخزون SaaS',
    description: 'A comprehensive inventory tracking system for small businesses with barcode scanning and low-stock alerts.',
    description_ar: 'نظام شامل لتتبع المخزون للشركات الصغيرة مع مسح الباركود وتنبيهات انخفاض المخزون.',
    price: 129,
    category: 'Business',
    category_ar: 'أعمال',
    features: ['Barcode scanning', 'Stock alerts', 'Supplier management', 'Reporting'],
    features_ar: ['مسح الباركود', 'تنبيهات المخزون', 'إدارة الموردين', 'التقارير'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    targetAudience: 'Small business owners',
    targetAudience_ar: 'أصحاب الشركات الصغيرة',
    imageSeed: 201,
    vendorId: 'u-123',
    vendorName: 'Alex Creator',
    licenseType: 'Extended',
    reviews: []
  },
  {
    id: 'ven-2',
    name: 'YogaFlow',
    name_ar: 'يوغا فلو',
    tagline: 'Daily Yoga Sequences',
    tagline_ar: 'تسلسلات يوغا يومية',
    description: 'Curated yoga flows for all levels with video demonstrations and progress tracking.',
    description_ar: 'تمارين يوغا مختارة لجميع المستويات مع عروض فيديو وتتبع للتقدم.',
    price: 59,
    category: 'Health & Fitness',
    category_ar: 'الصحة واللياقة',
    features: ['Video player', 'Progress calendar', 'Custom sequences', 'Offline mode'],
    features_ar: ['مشغل فيديو', 'تقويم التقدم', 'تسلسلات مخصصة', 'وضع عدم الاتصال'],
    techStack: ['Flutter', 'Firebase'],
    targetAudience: 'Yoga practitioners',
    targetAudience_ar: 'ممارسو اليوغا',
    imageSeed: 202,
    vendorId: 'u-123',
    vendorName: 'Alex Creator',
    licenseType: 'Standard',
    reviews: [
       {
        id: 'rev-4',
        userName: 'Elena R.',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        rating: 5,
        comment: 'Beautiful UI and very smooth animations. My clients love the app.',
        comment_ar: 'واجهة مستخدم جميلة ورسوم متحركة سلسة للغاية. عملائي يحبون التطبيق.',
        date: 'Jan 15, 2024'
      }
    ]
  }
];

export const MOCK_USER: User = {
  id: 'u-123',
  name: 'Alex Creator',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  plan: 'Enterprise', // Upgraded to show off features
  credits: 850,
  points: 1250,
  downloadsRemaining: 999999,
  memberSince: 'Oct 2023',
  role: 'manager' // Set to manager to demonstrate role-based tabs
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-8832',
    date: '2024-03-10',
    items: [MOCK_APPS[0]],
    total: 49,
    status: 'Completed',
    downloadUrl: '#'
  },
  {
    id: 'ord-7721',
    date: '2024-02-28',
    items: [MOCK_APPS[4]],
    total: 75,
    status: 'Completed',
    downloadUrl: '#'
  }
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'tm-1', name: 'Alex Creator', email: 'alex@example.com', role: 'manager', status: 'Active', lastActive: 'Just now' },
  { id: 'tm-2', name: 'Sarah Dev', email: 'sarah@example.com', role: 'user', status: 'Active', lastActive: '2 hours ago' },
  { id: 'tm-3', name: 'Mike Design', email: 'mike@example.com', role: 'user', status: 'Invited', lastActive: '-' },
];

export const MOCK_POINT_HISTORY: PointTransaction[] = [
  { id: 'pt-1', action: 'Purchase: ZenFocus', amount: 490, type: 'earned', date: 'Mar 10, 2024' },
  { id: 'pt-2', action: 'Redeemed for 100 Credits', amount: 1000, type: 'redeemed', date: 'Mar 01, 2024' },
  { id: 'pt-3', action: 'Purchase: TravelMate', amount: 750, type: 'earned', date: 'Feb 28, 2024' },
  { id: 'pt-4', action: 'Welcome Bonus', amount: 100, type: 'earned', date: 'Oct 01, 2023' },
];