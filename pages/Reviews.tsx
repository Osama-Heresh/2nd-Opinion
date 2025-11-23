import React from 'react';
import { Star, Quote, ThumbsUp, User, Activity, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const REVIEWS_EN = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "I was unsure about my initial diagnosis for months. Using 2nd Opinion, Dr. Karim spotted a detail in my blood work that changed everything. The peace of mind is worth every penny.",
    date: "2 days ago",
    specialty: "Endocrinology"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Incredible speed. I got a detailed report within 24 hours. The AI analysis summary helped me understand the medical jargon before I even read the doctor's note.",
    date: "1 week ago",
    specialty: "Cardiology"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    text: "Great platform. The doctor requested more info which was a bit of a hassle to upload, but it showed they were actually being thorough instead of rushing.",
    date: "3 weeks ago",
    specialty: "Dermatology"
  },
  {
    id: 4,
    name: "David Park",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "My local specialist recommended surgery. I wanted to be sure. The expert here suggested a less invasive treatment plan that has worked wonders.",
    date: "1 month ago",
    specialty: "Orthopedics"
  }
];

const REVIEWS_AR = [
  {
    id: 1,
    name: "سارة العلي",
    role: "مريض",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "كنت غير متأكدة من تشخيصي الأولي لشهور. باستخدام الرأي الثاني، لاحظ الدكتور كريم تفصيلاً في تحليل دمي غير كل شيء. راحة البال تستحق كل فلس.",
    date: "منذ يومين",
    specialty: "الغدد الصماء"
  },
  {
    id: 2,
    name: "مايكل تشن",
    role: "مريض",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "سرعة مذهلة. حصلت على تقرير مفصل خلال 24 ساعة. ساعدني ملخص الذكاء الاصطناعي في فهم المصطلحات الطبية قبل حتى قراءة ملاحظة الطبيب.",
    date: "منذ أسبوع",
    specialty: "القلب"
  },
  {
    id: 3,
    name: "إيميلي رودريغيز",
    role: "مريض",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    text: "منصة رائعة. طلب الطبيب المزيد من المعلومات وكان تحميلها متعباً قليلاً، لكنه أظهر أنهم كانوا دقيقين بالفعل بدلاً من التسرع.",
    date: "منذ 3 أسابيع",
    specialty: "الجلدية"
  },
  {
    id: 4,
    name: "ديفيد بارك",
    role: "مريض",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "نصحني أخصائيي المحلي بالجراحة. أردت التأكد. اقترح الخبير هنا خطة علاج أقل تدخلاً أدت لنتائج مذهلة.",
    date: "منذ شهر",
    specialty: "العظام"
  }
];

const Reviews = () => {
  const { t, language } = useApp();
  const reviews = language === 'ar' ? REVIEWS_AR : REVIEWS_EN;

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-yellow-100">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            {t('reviews.badge')}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
          {t('reviews.title')}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          {t('reviews.desc')}
        </p>
      </section>

      {/* Aggregate Stats */}
      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
            <div>
                <div className="text-5xl font-display font-bold text-white mb-2">4.9</div>
                <div className="flex justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />)}
                </div>
                <div className="text-slate-400">{t('reviews.stat.rating')}</div>
            </div>
            <div>
                <div className="text-5xl font-display font-bold text-white mb-2">98%</div>
                <div className="flex justify-center mb-2">
                    <ThumbsUp className="h-6 w-6 text-primary-400" />
                </div>
                <div className="text-slate-400">{t('reviews.stat.recommend')}</div>
            </div>
            <div>
                <div className="text-5xl font-display font-bold text-white mb-2">24h</div>
                <div className="flex justify-center mb-2">
                    <Activity className="h-6 w-6 text-secondary-400" />
                </div>
                <div className="text-slate-400">{t('reviews.stat.time')}</div>
            </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                  <div className="flex items-center gap-4 mb-6">
                      <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                      <div>
                          <h4 className="font-bold text-slate-900">{review.name}</h4>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span>{review.role}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{review.date}</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="mb-4">
                      <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                              />
                          ))}
                      </div>
                      <Quote className="h-8 w-8 text-primary-100 mb-2 group-hover:text-primary-200 transition-colors" />
                      <p className="text-slate-600 leading-relaxed italic">
                          "{review.text}"
                      </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wide">
                          {review.specialty}
                      </span>
                  </div>
              </div>
          ))}
      </section>

      {/* Featured Story */}
      <section className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 text-secondary-700 font-bold uppercase tracking-wider text-sm">
                      <MessageCircle className="h-4 w-4" />
                      {t('reviews.story.badge')}
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">{t('reviews.story.title')}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                      {t('reviews.story.text')}
                  </p>
                  <div>
                      <div className="font-bold text-slate-900">Jessica M.</div>
                      <div className="text-slate-500">{t('reviews.story.author')}</div>
                  </div>
              </div>
              <div className="flex-1 w-full max-w-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" 
                    alt="Happy patient" 
                    className="w-full rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition duration-500" 
                  />
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('reviews.ctaTitle')}</h2>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition"
          >
             <User className="h-5 w-5" /> {t('how.cta')}
          </Link>
      </section>
    </div>
  );
};

export default Reviews;