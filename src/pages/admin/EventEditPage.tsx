// src/pages/admin/EventEditPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';
import type { Event, EventType } from '@/types';

type EventFormData = {
  title: string;
  date: string;
  endDate: string;
  type: EventType;
  description: string;
  fullText: string;
  location: string;
  images: string[];
  sources: string[];
  slug: string;
};

export function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('pages');
  const { events, updateEvent } = useContentStore();

  const event = events.find(e => String(e.id) === String(id));

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    endDate: '',
    type: 'battle',
    description: '',
    fullText: '',
    location: '',
    images: [],
    sources: [],
    slug: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
        type: event.type,
        description: event.description,
        fullText: event.fullText,
        location: event.location || '',
        images: event.images || [],
        sources: event.sources || [],
        slug: event.slug,
      });
    }
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen py-12 bg-[#F5F0E8]">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="p-12 text-[#8A7D6E] text-center">
            <p className="text-xl">{t('admin.eventNotFound', 'Событие не найдено')}</p>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/events')}
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
    if (!formData.title.trim()) newErrors.title = t('admin.requiredTitle');
    if (!formData.date) newErrors.date = t('admin.requiredDate');
    if (!formData.description.trim()) newErrors.description = t('admin.requiredDescription');
    if (!formData.slug.trim()) newErrors.slug = t('admin.requiredSlug');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updateData: Partial<Event> = {
      title: formData.title,
      date: new Date(formData.date),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      type: formData.type,
      description: formData.description,
      fullText: formData.fullText || formData.description,
      location: formData.location || undefined,
      images: formData.images.filter(i => i.trim()),
      sources: formData.sources.filter(s => s.trim()),
      slug: formData.slug,
      updatedAt: new Date(),
    };

    // Обновляем в store
    updateEvent(id!, updateData);

    // Сохраняем в localStorage для персистентности
    const currentEvents = JSON.parse(localStorage.getItem('events_override') || '[]');
    const updatedEvents = currentEvents.filter((ev: Event) => String(ev.id) !== String(id));
    updatedEvents.push({ ...event, ...updateData, id: event.id });
    localStorage.setItem('events_override', JSON.stringify(updatedEvents));

    navigate('/admin/events');
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img),
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addSource = () => {
    setFormData(prev => ({ ...prev, sources: [...prev.sources, ''] }));
  };

  const updateSource = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.map((src, i) => i === index ? value : src),
    }));
  };

  const removeSource = (index: number) => {
    setFormData(prev => ({ ...prev, sources: prev.sources.filter((_, i) => i !== index) }));
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
            onClick={() => navigate('/admin/events')}
            className="text-[#8A7D6E] hover:text-[#2D2619] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.backToList')}
          </Button>

          <h1 className="text-3xl font-bold text-[#2D2619] font-serif">
            {t('admin.editEvent')}: {event.title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-8 border border-[#3D3225]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tableName')} *</label>
              <Input
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.title ? 'border-[#DC2626]' : ''}`}
                placeholder={t('admin.eventNamePlaceholder')}
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
              {errors.title && <p className="text-[#DC2626] text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Даты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tableDate')} начала *</label>
                <Input
                  type="date"
                  className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.date ? 'border-[#DC2626]' : ''}`}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
                {errors.date && <p className="text-[#DC2626] text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tableDate')} конца</label>
                <Input
                  type="date"
                  className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {/* Тип события */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tableType')} события *</label>
              <select
                className="w-full bg-[#FAF8F4] border border-[#3D3225] text-[#2D2619] rounded-md px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
              >
                <option value="battle">{t('admin.typeBattle')}</option>
                <option value="operation">{t('admin.typeOperation')}</option>
                <option value="political">{t('admin.typePolitical')}</option>
                <option value="movement">{t('admin.typeMovement', 'Перемещение')}</option>
                <option value="shelling">{t('admin.typeShelling', 'Обстрел')}</option>
                <option value="strategic">{t('admin.typeStrategic', 'Стратегическое')}</option>
                <option value="liberation">{t('admin.typeLiberation', 'Освобождение')}</option>
                <option value="occupation">{t('admin.typeOccupation', 'Оккупация')}</option>
                <option value="offensive">{t('admin.typeOffensive', 'Наступление')}</option>
                <option value="defense">{t('admin.typeDefense', 'Оборона')}</option>
                <option value="encirclement">{t('admin.typeEncirclement', 'Окружение')}</option>
                <option value="other">{t('admin.typeOther')}</option>
              </select>
            </div>

            {/* Место */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.tablePlace')}</label>
              <Input
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619]"
                placeholder="e.g., Minsk"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.description')} *</label>
              <Textarea
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[80px] ${errors.description ? 'border-[#DC2626]' : ''}`}
                placeholder="Enter short description..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
              {errors.description && <p className="text-[#DC2626] text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Полный текст */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Полное описание</label>
              <Textarea
                className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] min-h-[200px]"
                placeholder="Enter full article text..."
                value={formData.fullText}
                onChange={(e) => handleChange('fullText', e.target.value)}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Slug (URL identifier) *</label>
              <Input
                className={`bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] ${errors.slug ? 'border-[#DC2626]' : ''}`}
                placeholder="e.g., battle-of-moscow"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
              />
              {errors.slug && <p className="text-[#DC2626] text-xs mt-1">{errors.slug}</p>}
            </div>

            {/* Изображения */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.imageUrl', 'URL изображений')}</label>
              <div className="space-y-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Input
                      className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] flex-1"
                      placeholder="/images/events/name.jpg"
                      value={img}
                      onChange={(e) => updateImage(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-[#9A3A3A] hover:text-[#7A2A2A] hover:bg-[#9A3A3A]/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImage}
                  className="border-[#E8DFD0] text-[#8B6914] hover:bg-[#8B6914]/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.addImage', 'Добавить изображение')}
                </Button>
              </div>
            </div>

            {/* Источники */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">{t('admin.sources', 'Источники')}</label>
              <div className="space-y-3">
                {formData.sources.map((src, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Input
                      className="bg-[#FAF8F4] border-[#3D3225] text-[#2D2619] flex-1"
                      placeholder="https://example.com/source"
                      value={src}
                      onChange={(e) => updateSource(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSource(index)}
                      className="text-[#9A3A3A] hover:text-[#7A2A2A] hover:bg-[#9A3A3A]/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSource}
                  className="border-[#E8DFD0] text-[#8B6914] hover:bg-[#8B6914]/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.addSource', 'Добавить источник')}
                </Button>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" className="bg-[#8B6914] text-[#2D2619] hover:bg-[#8B6914]/90">
                <Save className="w-4 h-4 mr-2" />
                {t('admin.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/events')} className="border-[#3D3225] text-[#8A7D6E]">
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