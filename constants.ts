
import { AppProduct, Order, User, TeamMember, PointTransaction } from './types';

export const MOCK_APPS: AppProduct[] = [
  {
    id: 'app-1',
    name: 'ZenFocus',
    tagline: 'Minimalist Productivity Timer',
    description: 'A distraction-free productivity timer that combines the Pomodoro technique with ambient nature sounds and a built-in task manager.',
    price: 49,
    category: 'Productivity',
    features: ['Customizable timer', 'Binaural beats', 'Task grouping', 'Dark mode'],
    techStack: ['React Native', 'Redux', 'Firebase'],
    targetAudience: 'Students and remote workers',
    imageSeed: 101,
    licenseType: 'Standard',
    reviews: [
      {
        id: 'rev-1',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        rating: 5,
        comment: 'This app blueprint saved me weeks of work. The code is clean and the design is beautiful.',
        date: 'Oct 20, 2023'
      },
      {
        id: 'rev-2',
        userName: 'Mike Ross',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        rating: 4,
        comment: 'Great layout, easy to customize. Could use more documentation on the Redux setup though.',
        date: 'Nov 05, 2023'
      }
    ]
  },
  {
    id: 'app-2',
    name: 'FitBuddy AI',
    tagline: 'Your Personal Pocket Trainer',
    description: 'Uses computer vision to analyze your workout form in real-time through your phone camera and provides instant feedback.',
    price: 199,
    category: 'Health & Fitness',
    features: ['Form correction', 'Rep counting', 'Workout plans', 'Progress analytics'],
    techStack: ['Flutter', 'TensorFlow Lite', 'Node.js'],
    targetAudience: 'Home workout enthusiasts',
    imageSeed: 102,
    licenseType: 'Standard',
    reviews: [
      {
        id: 'rev-3',
        userName: 'David G.',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        rating: 5,
        comment: 'Incredible AI implementation. The TensorFlow integration is seamless.',
        date: 'Dec 12, 2023'
      }
    ]
  },
  {
    id: 'app-3',
    name: 'CryptoScout',
    tagline: 'Real-time Gem Detector',
    description: 'An advanced analytics dashboard that aggregates social sentiment and on-chain data to spot trending tokens before they explode.',
    price: 299,
    category: 'Finance',
    features: ['Whale alerts', 'Twitter sentiment', 'Portfolio tracker', 'Gas tracker'],
    techStack: ['Next.js', 'GraphQL', 'Solidity'],
    targetAudience: 'Crypto traders',
    imageSeed: 103,
    licenseType: 'Extended'
  },
  {
    id: 'app-4',
    name: 'LocalBites',
    tagline: 'Home Cooked Meals Delivered',
    description: 'A marketplace connecting verified home cooks with neighbors looking for authentic, homemade meals not available in restaurants.',
    price: 89,
    category: 'Food & Drink',
    features: ['Cook verification', 'Menu scheduling', 'Delivery tracking', 'Reviews'],
    techStack: ['Swift', 'Kotlin', 'AWS Amplify'],
    targetAudience: 'Foodies and busy professionals',
    imageSeed: 104,
    licenseType: 'Standard'
  },
  {
    id: 'app-5',
    name: 'TravelMate',
    tagline: 'AI Trip Planner',
    description: 'Generate complete travel itineraries based on your budget, interests, and travel dates in seconds.',
    price: 75,
    category: 'Travel',
    features: ['Budget optimization', 'Hotel booking', 'Hidden gems finder', 'Offline maps'],
    techStack: ['React', 'Google Maps API', 'OpenAI API'],
    targetAudience: 'Backpackers and families',
    imageSeed: 105,
    licenseType: 'Standard'
  }
];

export const MOCK_VENDOR_APPS: AppProduct[] = [
  {
    id: 'ven-1',
    name: 'InventoryMaster',
    tagline: 'SaaS Inventory Management',
    description: 'A comprehensive inventory tracking system for small businesses with barcode scanning and low-stock alerts.',
    price: 129,
    category: 'Business',
    features: ['Barcode scanning', 'Stock alerts', 'Supplier management', 'Reporting'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    targetAudience: 'Small business owners',
    imageSeed: 201,
    vendorId: 'u-123',
    vendorName: 'Alex Creator',
    licenseType: 'Extended',
    reviews: []
  },
  {
    id: 'ven-2',
    name: 'YogaFlow',
    tagline: 'Daily Yoga Sequences',
    description: 'Curated yoga flows for all levels with video demonstrations and progress tracking.',
    price: 59,
    category: 'Health & Fitness',
    features: ['Video player', 'Progress calendar', 'Custom sequences', 'Offline mode'],
    techStack: ['Flutter', 'Firebase'],
    targetAudience: 'Yoga practitioners',
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
