import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';
import type { Monument } from '@/types';

export function MonumentCreatePage() {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
  const { addMonument } = useContentStore();
  
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    location: '',
    coordinates: ['53.9045', '27.5615'] as [string, string],
    architect: '',
    sculptor: '',
    openingDate: '',
    description: '',
    history: '',
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('admin.requiredName');
    if (!formData.region.trim()) newErrors.region = t('admin.requiredRegion');
    if (!formData.location.trim()) newErrors.location = t('admin.requiredLocation');
    if (!formData.slug.trim()) newErrors.slug = t('admin.requiredSlug');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const monument: Omit<Monument, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      region: formData.region,
      location: formData.location,
      coordinates: [parseFloat(formData.coordinates[0]), parseFloat(formData.coordinates[1])] as [number, number],
      architect: formData.architect || undefined,
      sculptor: formData.sculptor || undefined,
      openingDate: formData.openingDate ? new Date(formData.openingDate) : undefined,
      description: formData.description,
      history: formData.history,
      images: formData.images.filter(i => i.trim()),
      slug: formData.slug,
    };

    addMonument(monument);
    navigate('/admin/monuments');
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
            onClick={() => navigate('/admin/monuments')}
            className="text-[#8A7D6E] hover:text-[#2D2619] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.backToList')}
          </Button>
          
          <h1 className="text-3xl font-bold text-[#2D2619] font-serif">
            {t('admin.addMonument')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-8 border border-[#3D3225]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.name')} *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.name ? 'border-[#DC2626]' : ''}`}
                placeholder={t('admin.monumentNamePlaceholder')}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="text-[#DC2626] text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.region')} *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.region ? 'border-[#DC2626]' : ''}`}
                placeholder={t('admin.regionPlaceholder')}
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
              />
              {errors.region && <p className="text-[#DC2626] text-xs mt-1">{errors.region}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.location')} *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.location ? 'border-[#DC2626]' : ''}`}
                placeholder={t('admin.locationPlaceholder')}
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
              {errors.location && <p className="text-[#DC2626] text-xs mt-1">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.latitude')}</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  placeholder="53.9045"
                  value={formData.coordinates[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, coordinates: [e.target.value, prev.coordinates[1]] }))}
                />
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.longitude')}</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  placeholder="27.5615"
                  value={formData.coordinates[1]}
                  onChange={(e) => setFormData(prev => ({ ...prev, coordinates: [prev.coordinates[0], e.target.value] }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.architect')}</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  placeholder={t('admin.architect')}
                  value={formData.architect}
                  onChange={(e) => handleChange('architect', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.sculptor')}</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  placeholder={t('admin.sculptor')}
                  value={formData.sculptor}
                  onChange={(e) => handleChange('sculptor', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.openingDate')}</label>
              <Input 
                type="date"
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                value={formData.openingDate}
                onChange={(e) => handleChange('openingDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.description')}</label>
              <Textarea 
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[80px]"
                placeholder={t('admin.descriptionShortPlaceholder')}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.history')}</label>
              <Textarea 
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[120px]"
                placeholder={t('admin.history') + '...'}
                value={formData.history}
                onChange={(e) => handleChange('history', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.slug')} *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.slug ? 'border-[#DC2626]' : ''}`}
                placeholder="brest-fortress"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
              />
              {errors.slug && <p className="text-[#DC2626] text-xs mt-1">{errors.slug}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.imageUrl')}</label>
              <Input 
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                placeholder="/images/monuments/name.jpg"
                value={formData.images[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" className="bg-[#8B6914] text-[#2D2619] hover:bg-[#8B6914]/90">
                <Save className="w-4 h-4 mr-2" />
                {t('admin.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/monuments')} className="border-[#3D3225] text-[#8A7D6E]">
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
