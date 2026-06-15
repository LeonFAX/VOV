import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, BookOpen, MessageSquare, Star, Clock, Shield, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: 'Разделы',
      icon: <BookOpen className="w-4 h-4 text-[#C4953A]" />,
      links: [
        { label: 'Хронология', path: '/timeline', icon: <Clock className="w-3 h-3" /> },
        { label: 'Герои', path: '/heroes', icon: <Star className="w-3 h-3" /> },
        { label: 'Письма', path: '/letters', icon: <MessageSquare className="w-3 h-3" /> },
        { label: 'События', path: '/events', icon: <Shield className="w-3 h-3" /> },
        { label: 'Памятники', path: '/monuments', icon: <MapPin className="w-3 h-3" /> },
      ],
    },
    {
      title: 'Информация',
      icon: <ExternalLink className="w-4 h-4 text-[#C4953A]" />,
      links: [
        { label: 'О проекте', path: '/about', icon: <BookOpen className="w-3 h-3" /> },
        { label: 'Источники', path: '/sources', icon: <BookOpen className="w-3 h-3" /> },
        { label: 'Обратная связь', path: '/contact', icon: <MessageSquare className="w-3 h-3" /> },
      ],
    },
  ];

  return (
    <footer className="bg-[#FAF6F0] border-t-2 border-[#C4953A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          
          {/* Бренд */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                <path d="M20 2L24.5 14.5H37.5L27 22L31 34.5L20 27L9 34.5L13 22L2.5 14.5H15.5L20 2Z" 
                  fill="#C4953A" stroke="#C4953A" strokeWidth="1"/>
                <circle cx="20" cy="20" r="4" fill="#9B1B1B"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-[#1F1A16] font-bold text-sm font-serif tracking-wide group-hover:text-[#C4953A] transition-colors">
                  Великая Отечественная
                </span>
                <span className="text-[#9B1B1B] text-xs font-medium tracking-widest uppercase">
                  война 1941–1945
                </span>
              </div>
            </Link>
            
            <p className="text-[#8A8178] text-sm leading-relaxed mb-5">
              Интерактивный исторический портал, посвящённый событиям Великой Отечественной войны, героям, письмам с фронта и мемориалам памяти.
            </p>
            
            <div className="flex items-center gap-3">
              <span className="text-[#9B1B1B] font-bold text-sm tracking-widest">1941</span>
              <div className="flex-1 h-px bg-[#C4953A] relative max-w-[80px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#C4953A] rounded-full border-2 border-[#FAF6F0]" />
              </div>
              <span className="text-[#9B1B1B] font-bold text-sm tracking-widest">1945</span>
            </div>
          </motion.div>

          {/* Разделы и Информация */}
          {footerLinks.map((section, idx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx + 1) * 0.1 }}
            >
              <h3 className="text-[#1F1A16] font-bold mb-5 font-serif flex items-center gap-2 text-base border-b border-[#E8DFD4] pb-2">
                {section.icon}
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-2 text-[#6B5D4F] text-sm hover:text-[#C4953A] transition-all duration-300"
                    >
                      <span className="text-[#C4953A]/50 group-hover:text-[#C4953A] transition-colors">
                        {link.icon}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.label}
                      </span>
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#C4953A]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Разделитель */}
        <div className="my-10 h-px bg-[#E8DFD4]" />

        {/* Низ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8A8178] text-xs">
            © {new Date().getFullYear()} Мемориальный сайт о Великой Отечественной войне. Все права защищены.
          </p>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[#8A8178] text-xs hover:text-[#6B5D4F] transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/admin/login" className="text-[#8A8178] text-xs hover:text-[#C4953A] transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Админ-панель
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}