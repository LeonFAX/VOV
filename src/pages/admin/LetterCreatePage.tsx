import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';
import type { Letter } from '@/types';

export function LetterCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation('pages');
  const { addLetter } = useContentStore();
  
  const [formData, setFormData] = useState({
    author: '',
    date: '',
    recipient: '',
    text: '',
    context: '',
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
    if (!formData.author.trim()) newErrors.author = t('admin.requiredAuthor');
    if (!formData.date) newErrors.date = t('admin.requiredDate');
    if (!formData.recipient.trim()) newErrors.recipient = 'Recipient is required';
    if (!formData.text.trim()) newErrors.text = t('admin.requiredText');
    if (!formData.slug.trim()) newErrors.slug = t('admin.requiredSlug');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const letter: Omit<Letter, 'id' | 'createdAt' | 'updatedAt'> = {
      author: formData.author,
      date: new Date(formData.date),
      recipient: formData.recipient,
      text: formData.text,
      context: formData.context || undefined,
      slug: formData.slug,
    };

    addLetter(letter);
    navigate('/admin/letters');
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
            onClick={() => navigate('/admin/letters')}
            className="text-[#8A7D6E] hover:text-[#2D2619] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.backToList')}
          </Button>
          
          <h1 className="text-3xl font-bold text-[#2D2619] font-serif">
            {t('admin.addLetter')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-8 border border-[#3D3225]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.letterAuthor')} *</label>
                <Input 
                  className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.author ? 'border-[#DC2626]' : ''}`}
                  placeholder={t("admin.heroLastNamePlaceholder", "Enter author")}
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                />
                {errors.author && <p className="text-[#DC2626] text-xs mt-1">{errors.author}</p>}
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tableDate')} *</label>
                <Input 
                  type="date"
                  className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.date ? 'border-[#DC2626]' : ''}`}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
                {errors.date && <p className="text-[#DC2626] text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.letterRecipient')} *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.recipient ? 'border-[#DC2626]' : ''}`}
                placeholder={t('admin.letterRecipient')}
                value={formData.recipient}
                onChange={(e) => handleChange('recipient', e.target.value)}
              />
              {errors.recipient && <p className="text-[#DC2626] text-xs mt-1">{errors.recipient}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Содержание письма *</label>
              <Textarea 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[200px] ${errors.text ? 'border-[#DC2626]' : ''}`}
                placeholder="Содержание письма..."
                value={formData.text}
                onChange={(e) => handleChange('text', e.target.value)}
              />
              {errors.text && <p className="text-[#DC2626] text-xs mt-1">{errors.text}</p>}
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.letterContext', 'Historical context')}</label>
              <Textarea 
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[80px]"
                placeholder="Опишите исторический контекст..."
                value={formData.context}
                onChange={(e) => handleChange('context', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Slug (URL identifier) *</label>
              <Input 
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.slug ? 'border-[#DC2626]' : ''}`}
                placeholder="e.g., letter-from-front-1941"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
              />
              {errors.slug && <p className="text-[#DC2626] text-xs mt-1">{errors.slug}</p>}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" className="bg-[#8B6914] text-[#2D2619] hover:bg-[#8B6914]/90">
                <Save className="w-4 h-4 mr-2" />
                {t('admin.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/letters')} className="border-[#3D3225] text-[#8A7D6E]">
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
