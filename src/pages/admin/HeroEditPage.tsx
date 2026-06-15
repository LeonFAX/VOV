// src/pages/admin/HeroEditPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store';
import type { Hero, Award } from '@/types';

type HeroFormData = {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  deathDate: string;
  birthPlace: string;
  militaryRank: string;
  awards: Award[];
  biography: string;
  feat: string;
  images: string[];
  slug: string;
};

export function HeroEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('pages');
  const { heroes, updateHero } = useContentStore();
  
  const hero = heroes.find(h => String(h.id) === String(id));
  
  const [formData, setFormData] = useState<HeroFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    militaryRank: '',
    awards: [],
    biography: '',
    feat: '',
    images: [],
    slug: '',
  });

  useEffect(() => {
    if (hero) {
      setFormData({
        firstName: hero.firstName,
        lastName: hero.lastName,
        middleName: hero.middleName || '',
        birthDate: hero.birthDate ? new Date(hero.birthDate).toISOString().split('T')[0] : '',
        deathDate: hero.deathDate ? new Date(hero.deathDate).toISOString().split('T')[0] : '',
        birthPlace: hero.birthPlace || '',
        militaryRank: hero.militaryRank,
        awards: hero.awards || [],
        biography: hero.biography,
        feat: hero.feat,
        images: hero.images || [],
        slug: hero.slug || '',
      });
    }
  }, [hero]);

  if (!hero) {
    return <div className="p-12 text-[#8A7D6E]">Герой не найден</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: Partial<Hero> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || undefined,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
      deathDate: formData.deathDate ? new Date(formData.deathDate) : undefined,
      birthPlace: formData.birthPlace || undefined,
      militaryRank: formData.militaryRank,
      awards: formData.awards,
      biography: formData.biography,
      feat: formData.feat,
      images: formData.images,
      slug: formData.slug,
      updatedAt: new Date(),
    };

    // Обновляем в store
    updateHero(id!, updateData);
    
    // Сохраняем в localStorage для персистентности
    const currentHeroes = JSON.parse(localStorage.getItem('heroes_override') || '[]');
    const updatedHeroes = currentHeroes.filter((h: Hero) => String(h.id) !== String(id));
    updatedHeroes.push({ ...hero, ...updateData, id: hero.id });
    localStorage.setItem('heroes_override', JSON.stringify(updatedHeroes));

    navigate('/admin/heroes');
  };

  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { name: '', description: '' }],
    }));
  };

  const updateAward = (index: number, field: keyof Award, value: string) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.map((a, i) => i === index ? { ...a, [field]: value } : a),
    }));
  };

  const removeAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img),
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen py-12 bg-[#F5F0E8]">
      <div className="max-w-[900px] mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/admin/heroes')} className="text-[#8A7D6E] mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад
        </Button>
        
        <h1 className="text-3xl font-bold text-[#2D2619] font-serif mb-8">
          Редактирование: {hero.lastName} {hero.firstName}
        </h1>

        <div className="bg-white rounded-lg p-8 border border-[#E8DFD0]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ФИО */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">Фамилия *</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">Имя *</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">Отчество</label>
                <Input 
                  className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                  value={formData.middleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                />
              </div>
            </div>

            {/* Даты */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">Дата рождения</label>
                <Input 
                  type="date"
                  className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[#8A7D6E] text-sm mb-2">Дата смерти</label>
                <Input 
                  type="date"
                  className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                  value={formData.deathDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, deathDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Место рождения */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Место рождения</label>
              <Input 
                className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                placeholder="например, Минск"
                value={formData.birthPlace}
                onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
              />
            </div>

            {/* Воинское звание */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Воинское звание *</label>
              <Input 
                className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                value={formData.militaryRank}
                onChange={(e) => setFormData(prev => ({ ...prev, militaryRank: e.target.value }))}
                required
              />
            </div>

            {/* Награды */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Награды</label>
              <div className="space-y-3">
                {formData.awards.map((award, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Input 
                      className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619] flex-1"
                      placeholder="Название награды"
                      value={award.name}
                      onChange={(e) => updateAward(index, 'name', e.target.value)}
                    />
                    <Input 
                      className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619] flex-1"
                      placeholder="Описание"
                      value={award.description}
                      onChange={(e) => updateAward(index, 'description', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAward(index)}
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
                  onClick={addAward}
                  className="border-[#E8DFD0] text-[#8B6914] hover:bg-[#8B6914]/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Добавить награду
                </Button>
              </div>
            </div>

            {/* Биография */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Биография</label>
              <Textarea 
                className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619] min-h-[120px]"
                value={formData.biography}
                onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
              />
            </div>

            {/* Подвиг */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Подвиг</label>
              <Textarea 
                className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619] min-h-[120px]"
                value={formData.feat}
                onChange={(e) => setFormData(prev => ({ ...prev, feat: e.target.value }))}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">Slug (URL идентификатор) *</label>
              <Input 
                className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619]"
                placeholder="например, ivan-ivanov"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>

            {/* Изображения */}
            <div>
              <label className="block text-[#8A7D6E] text-sm mb-2">URL изображений</label>
              <div className="space-y-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Input 
                      className="bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619] flex-1"
                      placeholder="/images/heroes/name.jpg"
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
                  <Plus className="w-4 h-4 mr-2" /> Добавить изображение
                </Button>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-[#8B6914] text-white hover:bg-[#7A5C10]">
                <Save className="w-4 h-4 mr-2" /> Сохранить
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/heroes')} className="border-[#E8DFD0] text-[#8A7D6E]">
                <X className="w-4 h-4 mr-2" /> Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}