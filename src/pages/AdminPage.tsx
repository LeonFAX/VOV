import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Mail, MapPin, Plus, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore, useContentStore } from '@/store';
import { RefreshCw } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  link: string;
}

function StatCard({ title, count, icon: Icon, color, iconColor, link }: StatCardProps) {
  return (
    <Link to={link}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(139,105,20,0.08)' }}
        className="bg-white rounded-xl p-6 border border-[#E8DFD0] hover:border-[#8B6914]/30 transition-all shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#8A7D6E] text-sm mb-1 font-medium">{title}</p>
            <p className="text-3xl font-bold text-[#2D2619] tracking-tight">{count}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

interface QuickActionProps {
  label: string;
  icon: React.ElementType;
  link: string;
  iconBg: string;
  iconColor: string;
}

function QuickAction({ label, icon: Icon, link, iconBg, iconColor }: QuickActionProps) {
  return (
    <Link to={link}>
      <motion.div
        whileHover={{ y: -2, borderColor: 'rgba(139,105,20,0.3)', backgroundColor: '#FAF8F4' }}
        className="flex items-center gap-4 bg-white rounded-xl p-4 border border-[#E8DFD0] transition-all cursor-pointer group shadow-sm"
      >
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-[#5C5346] text-sm font-medium group-hover:text-[#2D2619] transition-colors">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

interface SectionCardProps {
  title: string;
  count: number;
  link: string;
}

function SectionCard({ title, count, link }: SectionCardProps) {
  return (
    <Link to={link}>
      <motion.div
        whileHover={{ y: -2, borderColor: 'rgba(139,105,20,0.3)', backgroundColor: '#FAF8F4' }}
        className="bg-white rounded-xl p-5 border border-[#E8DFD0] transition-all cursor-pointer shadow-sm"
      >
        <h3 className="text-[#2D2619] font-medium mb-1">{title}</h3>
        <p className="text-[#8A7D6E] text-sm">{count} записей</p>
      </motion.div>
    </Link>
  );
}

export function AdminPage() {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const { heroes, events, letters, monuments } = useContentStore();


  <Button
  variant="outline"
  onClick={() => {
    useContentStore.getState().reloadEvents();
    useContentStore.getState().reloadHeroes();
  }}
  className="border-[#E8DFD0] text-[#8A7D6E] hover:bg-[#2D2619] hover:text-[#E8DCC8] mr-2"
>
  <RefreshCw className="w-4 h-4 mr-2" />
  Обновить данные
</Button>

  useEffect(() => {
    console.log('=== ADMIN DIAGNOSTICS ===');
    console.log('Events in store:', events.length);
    console.log('Heroes in store:', heroes.length);
    console.log('Letters in store:', letters.length);
    console.log('Monuments in store:', monuments.length);

    fetch('/data/events.json')
      .then(r => r.json())
      .then(data => console.log('Raw JSON events:', data.length))
      .catch(e => console.log('JSON fetch error:', e));
    
  }, [events, heroes, letters, monuments]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="text-[#8A7D6E]">{t('admin.redirecting')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-[#F5F0E8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-[#2D2619] mb-2 font-serif tracking-tight">
              {t('admin.title')}
            </h1>
            <p className="text-[#8A7D6E]">
              {t('admin.subtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-[#E8DFD0] text-[#8A7D6E] hover:bg-[#2D2619] hover:text-[#E8DCC8] hover:border-[#2D2619] transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('admin.logout')}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            title={t('admin.heroes')}
            count={heroes.length}
            icon={Users}
            color="bg-[#9A3A3A]/10"
            iconColor="text-[#9A3A3A]"
            link="/admin/heroes"
          />
          <StatCard
            title={t('admin.events')}
            count={events.length}
            icon={Calendar}
            color="bg-[#2D6A4F]/10"
            iconColor="text-[#2D6A4F]"
            link="/admin/events"
          />
          <StatCard
            title={t('admin.letters')}
            count={letters.length}
            icon={Mail}
            color="bg-[#8B6914]/10"
            iconColor="text-[#8B6914]"
            link="/admin/letters"
          />
          <StatCard
            title={t('admin.monuments')}
            count={monuments.length}
            icon={MapPin}
            color="bg-[#7A6E5E]/10"
            iconColor="text-[#7A6E5E]"
            link="/admin/monuments"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-[#2D2619] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8B6914]" />
            {t("admin.quickActions")}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              label={t('admin.addHero')}
              icon={Plus}
              link="/admin/heroes/new"
              iconBg="bg-[#9A3A3A]/10"
              iconColor="text-[#9A3A3A]"
            />
            <QuickAction
              label={t('admin.addEvent')}
              icon={Plus}
              link="/admin/events/new"
              iconBg="bg-[#2D6A4F]/10"
              iconColor="text-[#2D6A4F]"
            />
            <QuickAction
              label={t('admin.addLetter')}
              icon={Plus}
              link="/admin/letters/new"
              iconBg="bg-[#8B6914]/10"
              iconColor="text-[#8B6914]"
            />
            <QuickAction
              label={t('admin.addMonument')}
              icon={Plus}
              link="/admin/monuments/new"
              iconBg="bg-[#7A6E5E]/10"
              iconColor="text-[#7A6E5E]"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-[#2D2619] mb-4">
            {t("admin.recentUpdates")}
          </h2>
          
          <div className="bg-white rounded-xl border border-[#E8DFD0] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#E8DFD0] bg-[#FAF8F4]">
              <p className="text-[#8A7D6E] text-sm">
                {t('admin.systemReady')}
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {[
                  { action: 'Добавлен', item: 'Михаил Ефремов', type: 'герой', time: '2 часа назад', color: 'bg-[#9A3A3A]' },
                  { action: 'Обновлено', item: 'Битва за Москву', type: 'событие', time: '5 часов назад', color: 'bg-[#2D6A4F]' },
                  { action: 'Добавлено', item: 'Письмо от А. Смирнова', type: 'письмо', time: '1 день назад', color: 'bg-[#8B6914]' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#FAF8F4] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 ${activity.color} rounded-full`} />
                      <span className="text-[#5C5346]">
                        {activity.action} <strong className="text-[#2D2619]">{activity.item}</strong>
                      </span>
                      <span className="text-[#8A7D6E] text-sm bg-[#F5F0E8] px-2 py-0.5 rounded-full">{activity.type}</span>
                    </div>
                    <span className="text-[#8A7D6E] text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-[#2D2619] mb-4">
            {t('admin.sections')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SectionCard
              title={t('admin.manageHeroes')}
              count={heroes.length}
              link="/admin/heroes"
            />
            <SectionCard
              title={t('admin.manageEvents')}
              count={events.length}
              link="/admin/events"
            />
            <SectionCard
              title={t('admin.manageLetters')}
              count={letters.length}
              link="/admin/letters"
            />
            <SectionCard
              title={t('admin.manageMonuments')}
              count={monuments.length}
              link="/admin/monuments"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}