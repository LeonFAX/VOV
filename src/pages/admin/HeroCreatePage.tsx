import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';
import type { Hero } from '@/types';

export function HeroCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation('pages');
  const { addHero } = useContentStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    militaryRank: '',
    awards: [{ name: '', description: '' }],
    biography: '',
    feat: '',
    images: [''],
    slug: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
    }
  };

  const handleAwardChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.map((a, i) => i === index ? { ...a, [field]: value } : a)
    }));
  };

  const addAward = () => {
    setFormData(prev => ({ ...prev, awards: [...prev.awards, { name: '', description: '' }] }));
  };

  const removeAward = (index: number) => {
    setFormData(prev => ({ ...prev, awards: prev.awards.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.lastName.trim()) newErrors.lastName = t('admin.requiredLastName');
    if (!formData.firstName.trim()) newErrors.firstName = t('admin.requiredFirstName');
    if (!formData.militaryRank.trim()) newErrors.militaryRank = t('admin.requiredRank');
    if (!formData.biography.trim()) newErrors.biography = t('admin.requiredBiography');
    if (!formData.feat.trim()) newErrors.feat = t('admin.requiredDescription');
    if (!formData.slug.trim()) newErrors.slug = t('admin.requiredSlug');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || undefined,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
      deathDate: formData.deathDate ? new Date(formData.deathDate) : undefined,
      birthPlace: formData.birthPlace || undefined,
      militaryRank: formData.militaryRank,
      awards: formData.awards.filter(a => a.name.trim()),
      biography: formData.biography,
      feat: formData.feat,
      images: formData.images.filter(i => i.trim()),
      slug: formData.slug,
    };

    addHero(hero);
    navigate('/admin/heroes');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/heroes')}
            className="text-[#8A7D6E] hover:text-[#2D2619] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.backToList')}
          </Button>
          
          <h1 className="text-3xl font-bold text-[#2D2619] font-serif">
            {t('admin.addHero')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-8 border border-[#3D3225]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.heroLastName')} *</label>
                <Input 
                  className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.lastName ? 'border-[#DC2626]' : ''}`}
                  placeholder={t("admin.heroLastNamePlaceholder", "Enter last name")}
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
                {errors.lastName && <p className="text-[#DC2626] text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.heroFirstName')} *</label>
                <Input 
                  className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.firstName ? 'border-[#DC2626]' : ''}`}
                  placeholder={t("admin.heroFirstNamePlaceholder", "Enter first name")}
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
                {errors.firstName && <p className="text-[#DC2626] text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.heroMiddleName')}</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  placeholder={t("admin.heroMiddleNamePlaceholder", "Enter middle name")}
                  value={formData.middleName}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tableDate')} birth</label>
                <Input 
                  type="date"
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tableDate')} death</label>
                <Input 
                  type="date"
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  value={formData.deathDate}
                  onChange={(e) => handleChange('deathDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tablePlace')} birth</label>
              <Input 
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                placeholder="e.g., Minsk"
                value={formData.birthPlace}
                onChange={(e) => handleChange('birthPlace', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.heroMilitaryRank')} *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.militaryRank ? 'border-[#DC2626]' : ''}`}
                placeholder="e.g., Hero of the Soviet Union"
                value={formData.militaryRank}
                onChange={(e) => handleChange('militaryRank', e.target.value)}
              />
              {errors.militaryRank && <p className="text-[#DC2626] text-xs mt-1">{errors.militaryRank}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Awards</label>
              {formData.awards.map((award, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] flex-1"
                    placeholder="{t('admin.tableName')} awards"
                    value={award.name}
                    onChange={(e) => handleAwardChange(index, 'name', e.target.value)}
                  />
                  <Input
                    className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] flex-1"
                    placeholder="{t('admin.description')}"
                    value={award.description}
                    onChange={(e) => handleAwardChange(index, 'description', e.target.value)}
                  />
                  {formData.awards.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAward(index)} className="text-[#8A7D6E] hover:text-[#DC2626]">
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={addAward} className="text-[#8B6914]">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.add')} award
              </Button>
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.heroFeat')} *</label>
              <Textarea 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[120px] ${errors.biography ? 'border-[#DC2626]' : ''}`}
                placeholder="Enter biography..."
                value={formData.biography}
                onChange={(e) => handleChange('biography', e.target.value)}
              />
              {errors.biography && <p className="text-[#DC2626] text-xs mt-1">{errors.biography}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.heroFeat')} *</label>
              <Textarea 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[120px] ${errors.feat ? 'border-[#DC2626]' : ''}`}
                placeholder="Describe the feat..."
                value={formData.feat}
                onChange={(e) => handleChange('feat', e.target.value)}
              />
              {errors.feat && <p className="text-[#DC2626] text-xs mt-1">{errors.feat}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Slug (URL identifier) *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.slug ? 'border-[#DC2626]' : ''}`}
                placeholder="e.g., ivan-ivanov"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
              />
              {errors.slug && <p className="text-[#DC2626] text-xs mt-1">{errors.slug}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.imageUrl')}</label>
              <Input 
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                placeholder="/images/heroes/name.jpg"
                value={formData.images[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" className="bg-[#8B6914] text-[#2D2619] hover:bg-[#8B6914]/90">
                <Save className="w-4 h-4 mr-2" />
                {t('admin.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/heroes')} className="border-[#3D3225] text-[#8A7D6E]">
                <X className="w-4 h-4 mr-2" />
                {t('admin.cancel')}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
