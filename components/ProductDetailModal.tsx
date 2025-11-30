


import React, { useState, useEffect } from 'react';
import { AppProduct, Review, Language, User } from '../types';
import { X, ShoppingBag, Heart, Zap, Check, Cpu, Users, Store, Award, Shield, CreditCard, LayoutDashboard, Globe, Sparkles, Activity, Lock, Copyright, FileText, Flag, MessageSquare, Star, Send, Bell, Calendar, Video, Smartphone, Database, Trophy, ChevronLeft, ChevronRight, DownloadCloud } from './Icons';
import { generateAppScreenSvg } from './AppCard';
import { translations } from '../translations';

interface ProductDetailModalProps {
  product: AppProduct;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: AppProduct) => void;
  onSave?: (product: AppProduct) => void;
  isSaved?: boolean;
  language?: Language;
  user?: User | null;
  onDirectAccess?: (product: AppProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onSave,
  isSaved,
  language = 'en',
  user,
  onDirectAccess
}) => {
  if (!isOpen) return null;

  const { name, tagline, description, price, features, techStack, targetAudience, category, imageSeed, isAI, vendorName, licenseType, reviews = [],
          name_ar, tagline_ar, description_ar, features_ar, category_ar, targetAudience_ar } = product;

  const isAr = language === 'ar';
  const t = translations[language];
  
  const displayName = (isAr && name_ar) ? name_ar : name;
  const displayTagline = (isAr && tagline_ar) ? tagline_ar : tagline;
  const displayDesc = (isAr && description_ar) ? description_ar : description;
  const displayCategory = (isAr && category_ar) ? category_ar : category;
  const displayFeatures = (isAr && features_ar && features_ar.length > 0) ? features_ar : features;
  const displayAudience = (isAr && targetAudience_ar) ? targetAudience_ar : targetAudience;
  
  // Local state for reviews (simulating interactivity)
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
  const [ratingInput, setRatingInput] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState<string[]>([]);

  // Generate consistent brand colors based on seed (matching AppCard)
  const gradients = [
    'from-blue-600 to-indigo-700',
    'from-emerald-500 to-teal-700',
    'from-orange-500 to-red-600',
    'from-purple-600 to-fuchsia-700',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-slate-700 to-slate-900',
    'from-violet-600 to-purple-800'
  ];
  const seed = imageSeed || name.length;
  const gradientClass = gradients[seed % gradients.length];

  // Prevent clicks inside the modal from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Generate slide images on mount/change
  useEffect(() => {
    if (product.imageUrl) {
       // If a custom image exists, duplicate it (or add placeholders if we had real multi-image support)
       // For now, we mix it with generated screens
       setSliderImages([
          product.imageUrl,
          generateAppScreenSvg(displayName, displayTagline, seed, 'list'),
          generateAppScreenSvg(displayName, displayTagline, seed, 'stats'),
          generateAppScreenSvg(displayName, displayTagline, seed, 'profile')
       ]);
    } else {
       setSliderImages([
          generateAppScreenSvg(displayName, displayTagline, seed, 'home'),
          generateAppScreenSvg(displayName, displayTagline, seed, 'list'),
          generateAppScreenSvg(displayName, displayTagline, seed, 'stats'),
          generateAppScreenSvg(displayName, displayTagline, seed, 'profile')
       ]);
    }
    setCurrentSlide(0);
  }, [product, displayName, displayTagline, seed]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingInput === 0 || !commentInput.trim()) return;

    const newReview: Review = {
      id: `new-${Date.now()}`,
      userName: isAr ? 'أنت' : 'You',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      rating: ratingInput,
      comment: commentInput,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setLocalReviews([newReview, ...localReviews]);
    setRatingInput(0);
    setCommentInput('');
  };

  const averageRating = localReviews.length > 0 
    ? (localReviews.reduce((sum, rev) => sum + rev.rating, 0) / localReviews.length).toFixed(1)
    : (isAr ? 'جديد' : 'New');

  // Helper to pick icon based on feature keywords
  const getFeatureIcon = (feature: string) => {
    const text = feature.toLowerCase();
    const iconClass = "w-4 h-4 mt-0.5 flex-shrink-0";
    
    if (text.includes('secure') || text.includes('protect') || text.includes('private') || text.includes('auth') || text.includes('أمان')) 
      return <Shield className={`${iconClass} text-emerald-500`} />;
    if (text.includes('payment') || text.includes('money') || text.includes('wallet') || text.includes('subscription') || text.includes('دفع')) 
      return <CreditCard className={`${iconClass} text-green-600`} />;
    if (text.includes('ai') || text.includes('smart') || text.includes('intelligence') || text.includes('bot') || text.includes('ذكاء')) 
      return <Sparkles className={`${iconClass} text-purple-500`} />;
    if (text.includes('data') || text.includes('analytic') || text.includes('chart') || text.includes('dashboard') || text.includes('بيانات')) 
      return <LayoutDashboard className={`${iconClass} text-blue-500`} />;
    if (text.includes('fast') || text.includes('speed') || text.includes('real-time') || text.includes('live') || text.includes('سرعة')) 
      return <Zap className={`${iconClass} text-amber-500`} />;
    if (text.includes('user') || text.includes('social') || text.includes('community') || text.includes('chat') || text.includes('مستخدم')) 
      return <Users className={`${iconClass} text-indigo-500`} />;
    if (text.includes('map') || text.includes('location') || text.includes('global') || text.includes('track') || text.includes('خريطة')) 
      return <Globe className={`${iconClass} text-cyan-500`} />;
    if (text.includes('track') || text.includes('monitor') || text.includes('health') || text.includes('activity') || text.includes('تتبع'))
      return <Activity className={`${iconClass} text-rose-500`} />;
    if (text.includes('lock') || text.includes('password') || text.includes('قفل'))
      return <Lock className={`${iconClass} text-slate-600 dark:text-slate-400`} />;
    if (text.includes('notify') || text.includes('alert') || text.includes('push') || text.includes('تنبيه'))
      return <Bell className={`${iconClass} text-amber-500`} />;
    if (text.includes('calendar') || text.includes('schedule') || text.includes('date') || text.includes('plan') || text.includes('تقويم'))
      return <Calendar className={`${iconClass} text-indigo-500`} />;
    if (text.includes('video') || text.includes('stream') || text.includes('call') || text.includes('meet') || text.includes('فيديو'))
      return <Video className={`${iconClass} text-pink-500`} />;
    if (text.includes('mobile') || text.includes('app') || text.includes('ios') || text.includes('android') || text.includes('موبايل'))
      return <Smartphone className={`${iconClass} text-slate-500 dark:text-slate-400`} />;
    if (text.includes('database') || text.includes('storage') || text.includes('cloud') || text.includes('backend') || text.includes('api') || text.includes('قاعدة'))
      return <Database className={`${iconClass} text-cyan-600`} />;
      
    // Default
    return <Check className={`${iconClass} text-slate-400`} />;
  };

  const handleReport = () => {
    alert(isAr ? "تم الإبلاغ عن الانتهاك. سيقوم فريقنا القانوني بمراجعة هذا الطلب." : "Infringement reported. Our legal team will review this request.");
  };

  // Determine button state
  const isEnterprise = user?.plan === 'Enterprise' || user?.role === 'super-admin';
  const hasQuota = user && user.downloadsRemaining > 0;

  const renderActionButton = () => {
      if (onDirectAccess && (isEnterprise || hasQuota)) {
        return (
          <button 
            onClick={(e) => {
               onDirectAccess(product);
               onClose();
            }}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 ${
               isEnterprise 
                 ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none' 
                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isEnterprise ? (
              <>
                <DownloadCloud className="w-5 h-5" />
                {t.btn_download_now}
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                {t.btn_claim_app} ({user.downloadsRemaining})
              </>
            )}
          </button>
        );
      }
      return (
         <button 
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {isAr ? 'أضف إلى السلة' : 'Add to Cart'}
          </button>
      );
  };

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-bounce-in"
        onClick={handleContentClick}
      >
        {/* Header Actions */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 flex gap-2">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow">
          {/* Image Slider Area */}
          <div className={`relative h-72 sm:h-96 w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden group`}>
            
            {/* Background Texture */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
               <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
               <div className="absolute bottom-10 left-10 w-48 h-48 bg-black rounded-full mix-blend-overlay blur-3xl"></div>
            </div>

            {/* Slider Content */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-[85%] max-w-2xl h-[85%] bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-2xl rounded-2xl border border-white/20 dark:border-slate-700 overflow-hidden relative">
                   {/* Main Slide Image */}
                   <img 
                      src={sliderImages[currentSlide]} 
                      alt={`Screen Preview ${currentSlide + 1}`} 
                      className="w-full h-full object-cover transition-opacity duration-300"
                   />
                   
                   {/* Demo Logo Overlay */}
                   <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm z-20">
                      <div className={`w-6 h-6 rounded bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-[10px] font-bold`}>
                         {displayName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Demo Preview</span>
                   </div>
                </div>
            </div>
            
            {/* Navigation Arrows */}
            <button 
               onClick={prevSlide}
               className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition opacity-0 group-hover:opacity-100 backdrop-blur z-20"
            >
               <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </button>
            <button 
               onClick={nextSlide}
               className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition opacity-0 group-hover:opacity-100 backdrop-blur z-20"
            >
               <ChevronRight className="w-6 h-6 rtl:rotate-180" />
            </button>
            
            {/* Thumbnails / Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
               {sliderImages.map((_, idx) => (
                  <button
                     key={idx}
                     onClick={() => setCurrentSlide(idx)}
                     className={`w-2 h-2 rounded-full transition-all ${
                        currentSlide === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                     }`}
                  />
               ))}
            </div>

            {/* Floating Tags */}
            <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6 flex flex-wrap gap-2 z-10 pointer-events-none">
              {isAI && (
                  <span className="bg-black/30 backdrop-blur px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-2 border border-white/20">
                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {isAr ? 'مولّد بالذكاء الاصطناعي' : 'AI GENERATED'}
                  </span>
                )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Main Content */}
            <div className="p-6 sm:p-8 md:w-2/3 space-y-8 bg-white dark:bg-slate-900">
              
              {/* Thumbnail Strip */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                 {sliderImages.map((img, idx) => (
                    <button 
                       key={idx}
                       onClick={() => setCurrentSlide(idx)}
                       className={`w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                          currentSlide === idx ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent opacity-60 hover:opacity-100'
                       }`}
                    >
                       <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                 ))}
              </div>

              <section>
                <div className="flex items-center gap-2 mb-3">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">{displayName}</h3>
                   <span className="text-slate-400 mx-2">•</span>
                   <p className="text-slate-600 dark:text-slate-300 font-medium">{displayTagline}</p>
                </div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">{isAr ? 'الوصف' : 'Description'}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                  {displayDesc}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {isAr ? 'الميزات الرئيسية' : 'Key Features'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displayFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
                      {getFeatureIcon(feature)}
                      <span className="flex-grow">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {isAr ? 'التقنيات المستخدمة' : 'Tech Stack'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-lg border border-indigo-100 dark:border-indigo-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {isAr ? 'الجمهور المستهدف' : 'Target Audience'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    {displayAudience}
                  </p>
                </section>
              </div>

               {/* Reviews Section */}
               <section>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {isAr ? 'آراء العملاء' : 'Customer Reviews'}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">
                       <Star className="w-4 h-4 text-amber-400 fill-current" />
                       <span className="font-bold text-slate-900 dark:text-white">{averageRating}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400">({localReviews.length})</span>
                    </div>
                 </div>

                 {/* Add Review Form */}
                 <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'أضف تعليقاً' : 'Leave a review'}</h4>
                    <form onSubmit={handleSubmitReview}>
                       <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingInput(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none"
                            >
                               <Star className={`w-6 h-6 transition-colors ${
                                 star <= (hoverRating || ratingInput) 
                                   ? 'text-amber-400 fill-current' 
                                   : 'text-slate-300 dark:text-slate-600'
                               }`} />
                            </button>
                          ))}
                       </div>
                       <div className="relative">
                          <textarea
                             value={commentInput}
                             onChange={(e) => setCommentInput(e.target.value)}
                             placeholder={isAr ? "شارك تجربتك..." : "Share your experience..."}
                             className="w-full p-3 pr-12 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[80px]"
                             required
                          />
                          <button 
                             type="submit"
                             disabled={ratingInput === 0 || !commentInput.trim()}
                             className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                             <Send className="w-4 h-4 rtl:rotate-180" />
                          </button>
                       </div>
                    </form>
                 </div>

                 {/* Reviews List */}
                 <div className="space-y-4">
                    {localReviews.length > 0 ? (
                       localReviews.map((review) => (
                          <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-4 last:pb-0">
                             <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <div className="text-sm font-bold text-slate-900 dark:text-white">{review.userName}</div>
                                      <div className="flex gap-0.5">
                                         {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                                         ))}
                                      </div>
                                   </div>
                                </div>
                                <span className="text-xs text-slate-400">{review.date}</span>
                             </div>
                             <p className="text-sm text-slate-600 dark:text-slate-300 pl-11 rtl:pl-0 rtl:pr-11">
                                {(isAr && review.comment_ar) ? review.comment_ar : review.comment}
                             </p>
                          </div>
                       ))
                    ) : (
                       <p className="text-sm text-slate-500 italic text-center py-4">{isAr ? 'لا توجد مراجعات بعد. كن أول من يكتب مراجعة!' : 'No reviews yet. Be the first to review!'}</p>
                    )}
                 </div>
               </section>

               {/* License & Copyright Info */}
               <section className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
                    <Copyright className="w-5 h-5" /> {isAr ? 'الترخيص وحقوق النشر' : 'License & Copyright'}
                  </h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-indigo-100 dark:border-indigo-800">
                       <span className="text-indigo-700 dark:text-indigo-300">{isAr ? 'مالك الحقوق:' : 'Copyright Owner:'}</span>
                       <span className="font-bold text-indigo-900 dark:text-indigo-200">{vendorName || 'RenderBot AI'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-indigo-100 dark:border-indigo-800">
                       <span className="text-indigo-700 dark:text-indigo-300">{isAr ? 'نوع الترخيص:' : 'License Type:'}</span>
                       <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                          <FileText className="w-4 h-4" /> 
                          {licenseType || 'Standard'} {isAr ? 'ترخيص' : 'License'}
                       </span>
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 text-xs mt-1">
                       {isAr 
                         ? `استخدام لمنتج نهائي واحد حيث ${licenseType === 'Extended' ? 'يمكن' : 'لا يمكن'} فرض رسوم على المستخدمين النهائيين.${licenseType === 'Exclusive' ? ' يشمل نقل الملكية بالكامل.' : ''}`
                         : `Use for one end product which end users ${licenseType === 'Extended' ? 'can' : 'cannot'} be charged for.${licenseType === 'Exclusive' ? ' Full ownership transfer included.' : ''}`
                       }
                    </div>
                  </div>
               </section>
            </div>

            {/* Sidebar / Actions */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-6 sm:p-8 md:w-1/3 flex flex-col">
              <div className="mb-6">
                 {vendorName ? (
                   <div className="flex items-center gap-3 mb-6 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{isAr ? 'يباع بواسطة' : 'Sold by'}</div>
                        <div className="font-bold text-slate-900 dark:text-white">{vendorName}</div>
                      </div>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3 mb-6 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{isAr ? 'المبدع' : 'Creator'}</div>
                        <div className="font-bold text-slate-900 dark:text-white">RenderBot AI</div>
                      </div>
                   </div>
                 )}

                 <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">{isAr ? 'سعر الشراء لمرة واحدة' : 'One-time purchase price'}</div>
                 <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">${price}</div>
                 
                 {/* Points Badge */}
                 <div className="mb-6 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-100 dark:border-amber-900/30">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{isAr ? `اربح +${Math.floor(price * 10)} نقطة` : `Earn +${Math.floor(price * 10)} Pts`}</span>
                 </div>
                 
                 <div className="space-y-3">
                   {renderActionButton()}
                   
                   {onSave && (
                     <button 
                       onClick={() => onSave(product)}
                       className={`w-full py-3.5 border rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                         isSaved 
                           ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400' 
                           : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                       }`}
                     >
                       <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                       {isSaved 
                         ? (isAr ? 'تم الحفظ في لوحة التحكم' : 'Saved to Dashboard')
                         : (isAr ? 'حفظ لوقت لاحق' : 'Save for Later')
                       }
                     </button>
                   )}
                 </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="text-xs text-slate-400 text-center">
                  {isAr ? 'يشمل التوثيق، الكود المصدري، وأصول التصميم.' : 'Includes documentation, source code, and design assets.'}
                </div>
                <button 
                  onClick={handleReport}
                  className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                >
                  <Flag className="w-3 h-3" /> {isAr ? 'الإبلاغ عن انتهاك حقوق النشر' : 'Report Copyright Infringement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};