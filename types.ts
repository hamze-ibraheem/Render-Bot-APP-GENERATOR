
export type Page = 'home' | 'generator' | 'marketplace' | 'login' | 'dashboard' | 'pricing' | 'vendors' | 'copyright' | 'terms' | 'privacy';

export type LicenseType = 'Standard' | 'Extended' | 'Exclusive';
export type Language = 'en' | 'ar';

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  comment_ar?: string;
  date: string;
}

export interface AppProduct {
  id: string;
  name: string;
  name_ar?: string;
  tagline: string;
  tagline_ar?: string;
  description: string;
  description_ar?: string;
  price: number;
  category: string;
  category_ar?: string;
  features: string[];
  features_ar?: string[];
  techStack: string[];
  targetAudience: string;
  targetAudience_ar?: string;
  imageSeed?: number; // Used to generate deterministic placeholder images
  isAI?: boolean;
  vendorId?: string;
  vendorName?: string;
  imageUrl?: string; // Optional custom image URL
  licenseType?: LicenseType;
  reviews?: Review[];
  deployedUrl?: string;
  deploymentStatus?: 'pending' | 'building' | 'deployed' | 'failed';
}

export interface CartItem {
  product: AppProduct;
  quantity: number;
}

export interface GeneratedIdeaRaw {
  name: string;
  name_ar: string;
  tagline: string;
  tagline_ar: string;
  description: string;
  description_ar: string;
  price: number;
  category: string;
  category_ar: string;
  features: string[];
  features_ar: string[];
  techStack: string[];
  targetAudience: string;
  targetAudience_ar: string;
}

export type UserRole = 'user' | 'manager' | 'admin' | 'vendor' | 'developer' | 'super-admin';

export interface VendorMobileConfig {
  appName: string;
  packageName: string; // e.g., com.vendor.app
  version: string;
  status: 'Not Configured' | 'Building' | 'Ready';
  lastBuild?: string;
  downloadUrl?: string;
}

export interface VendorStripeConfig {
  isConnected: boolean;
  stripeId?: string;
  currency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  credits: number;
  points: number;
  downloadsRemaining: number; // For Pro/Free limits on direct downloads
  memberSince: string;
  role: UserRole;
  vendorStripe?: VendorStripeConfig;
  mobileConfig?: VendorMobileConfig;
}

export interface PointTransaction {
  id: string;
  action: string;
  amount: number;
  type: 'earned' | 'redeemed';
  date: string;
}

export interface Order {
  id: string;
  date: string;
  items: AppProduct[];
  total: number;
  status: 'Completed' | 'Processing';
  downloadUrl?: string;
  shipping?: {
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
    trackingNumber: string;
    address: string;
    estimatedDelivery: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Invited';
  lastActive: string;
}

export interface AdminStripeConfig {
  isEnabled: boolean;
  isTestMode: boolean;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}