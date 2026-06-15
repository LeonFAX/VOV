import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Plus, Edit2, Trash2, Users, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';

export function HeroesListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('pages');
  const { heroes, deleteHero } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredHeroes = heroes.filter(hero => {
    const fullName = `${hero.lastName} ${hero.firstName} ${hero.middleName || ''}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.militaryRank.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteHero(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="text-[#8A7D6E] hover:text-[#2D2619] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.back')}
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2D2619] font-serif flex items-center gap-3">
                <Users className="w-8 h-8 text-[#9A4A4A]" />
                {t('admin.manageHeroesTitle')}
              </h1>
              <p className="text-[#8A7D6E] mt-1">{heroes.length} {t('admin.records')}</p>
            </div>
            <Link to="/admin/heroes/new">
              <Button className="bg-[#8B3A3A] hover:bg-[#8B3A3A]/90">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.add')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8A080]" />
          <Input
            type="text"
            placeholder={t('admin.searchByName')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 bg-white border-[#3D3225] text-[#2D2619] placeholder:text-[#A09080] focus:border-[#8B6914]"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#3D3225] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3D3225]">
                  <th className="text-left px-6 py-4 text-[#8A7D6E] text-sm font-medium">{t('admin.heroLastName')}</th>
                  <th className="text-left px-6 py-4 text-[#8A7D6E] text-sm font-medium">{t('admin.heroMilitaryRank')}</th>
                  <th className="text-left px-6 py-4 text-[#8A7D6E] text-sm font-medium">Years</th>
                  <th className="text-left px-6 py-4 text-[#8A7D6E] text-sm font-medium">Awards</th>
                  <th className="text-right px-6 py-4 text-[#8A7D6E] text-sm font-medium">{t('admin.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeroes.map((hero, index) => (
                  <motion.tr
                    key={hero.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[#3D3225] hover:bg-[#E8DFD0]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8B3A3A]/20 flex items-center justify-center text-[#8B6914] font-bold text-sm">
                          {hero.lastName[0]}
                        </div>
                        <span className="text-[#2D2619] font-medium">
                          {hero.lastName} {hero.firstName} {hero.middleName || ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#8A7D6E]">{hero.militaryRank}</td>
                    <td className="px-6 py-4 text-[#8A7D6E]">
                      {hero.birthDate?.getFullYear() || '?'} — {hero.deathDate?.getFullYear() || t('heroes.present')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#8B6914] text-sm">{hero.awards.length} awards</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-[#8A7D6E] hover:text-[#8B6914]"
                          onClick={() => navigate(`/admin/heroes/${hero.id}/edit`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-[#8A7D6E] hover:text-[#DC2626]"
                          onClick={() => setDeleteId(hero.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-lg p-8 border border-[#3D3225] max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#8B3A3A]/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
                </div>
                <h2 className="text-xl font-bold text-[#2D2619]">{t('admin.confirmDeleteTitle')}</h2>
              </div>
              <p className="text-[#8A7D6E] mb-8">
                {t('admin.confirmDeleteHero')}
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border-[#3D3225] text-[#8A7D6E]"
                >
                  {t('admin.cancel')}
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-[#DC2626] hover:bg-[#DC2626]/90"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('admin.delete')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
