// src/pages/admin/LetterEditPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';
import type { Letter } from '@/types';

type LetterFormData = {
  author: string;
  date: string;
  recipient: string;
  text: string;
  context: string;
  originalScan: string;
  transcription: string;
  audioUrl: string;
  slug: string;
};

export function LetterEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('pages');
  const { letters, updateLetter } = useContentStore();

  const letter = letters.find(l => String(l.id) === String(id));

  const [formData, setFormData] = useState<LetterFormData>({
    author: '',
    date: '',
    recipient: '',
    text: '',
    context: '',
    originalScan: '',
    transcription: '',
    audioUrl: '',
    slug: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (letter) {
      setFormData({
        author: letter.author,
        date: letter.date ? new Date(letter.date).toISOString().split('T')[0] : '',
        recipient: letter.recipient,
        text: letter.text,
        context: letter.context || '',
        originalScan: letter.originalScan || '',
        transcription: letter.transcription || '',
        audioUrl: letter.audioUrl || '',
        slug: letter.slug,
      });
    }
  }, [letter]);

  if (!letter) {
    return (
      <div className="min-h-screen py-12 bg-[#F5F0E8]">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="p-12 text-[#8A7D6E] text-center">
            <p className="text-xl">{t('admin.letterNotFound', 'Письмо не найдено')}</p>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/letters')}
              className="text-[#8A7D6E] mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> {t('admin.backToList')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

    const updateData: Partial<Letter> = {
      author: formData.author,
      date: new Date(formData.date),
      recipient: formData.recipient,
      text: formData.text,
      context: formData.context || undefined,
      originalScan: formData.originalScan || undefined,
      transcription: formData.transcription || undefined,
      audioUrl: formData.audioUrl || undefined,
      slug: formData.slug,
      updatedAt: new Date(),
    };

    // Обновляем в store
    updateLetter(id!, updateData);

    // Сохраняем в localStorage для персистентности
    const currentLetters = JSON.parse(localStorage.getItem('letters_override') || '[]');
    const updatedLetters = currentLetters.filter((l: Letter) => String(l.id) !== String(id));
    updatedLetters.push({ ...letter, ...updateData, id: letter.id });
    localStorage.setItem('letters_override', JSON.stringify(updatedLetters));

    navigate('/admin/letters');
  };

  return (
    <div className="min-h-screen py-12 bg-[#F5F0E8]">
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
            {t('admin.editLetter')}: {letter.author} — {letter.recipient}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-8 border border-[#3D3225]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Автор и Дата */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.letterAuthor')} *</label>
                <Input
                  className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.author ? 'border-[#DC2626]' : ''}`}
                  placeholder={t('admin.heroLastNamePlaceholder', 'Enter author')}
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

            {/* Получатель */}
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

            {/* Текст письма */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Содержание письма *</label>
              <Textarea
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[200px] ${errors.text ? 'border-[#DC2626]' : ''}`}
                placeholder="Letter text..."
                value={formData.text}
                onChange={(e) => handleChange('text', e.target.value)}
              />
              {errors.text && <p className="text-[#DC2626] text-xs mt-1">{errors.text}</p>}
            </div>

            {/* Исторический контекст */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.letterContext', 'Historical context')}</label>
              <Textarea
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[80px]"
                placeholder="Describe historical context..."
                value={formData.context}
                onChange={(e) => handleChange('context', e.target.value)}
              />
            </div>

            {/* Оригинальный скан */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.originalScan', 'URL оригинального скана')}</label>
              <Input
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                placeholder="/images/letters/scan.jpg"
                value={formData.originalScan}
                onChange={(e) => handleChange('originalScan', e.target.value)}
              />
            </div>

            {/* Транскрипция */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.transcription', 'Транскрипция (если отличается от текста)')}</label>
              <Textarea
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[120px]"
                placeholder="Transcription of original text..."
                value={formData.transcription}
                onChange={(e) => handleChange('transcription', e.target.value)}
              />
            </div>

            {/* Аудио URL */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.audioUrl', 'URL аудиозаписи')}</label>
              <Input
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                placeholder="/audio/letters/reading.mp3"
                value={formData.audioUrl}
                onChange={(e) => handleChange('audioUrl', e.target.value)}
              />
            </div>

            {/* Slug */}
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

            {/* Кнопки */}
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