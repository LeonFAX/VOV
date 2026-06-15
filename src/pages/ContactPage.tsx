import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, MessageSquare, Send, User, AtSign, 
  CheckCircle, AlertCircle, Upload, X, FileImage, Loader2, Link2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeInOnScroll } from '@/components/ParallaxSection';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Attachment {
  file: File;
  preview: string;
  id: string;
  uploadedUrl?: string; // Ссылка после загрузки на ImgBB
}

// === ЗАМЕНИ НА СВОИ ДАННЫЕ ===
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'Na-FutEVxVVGIug-C',
  SERVICE_ID: 'service_z8mujym',
  TEMPLATE_ID: 'template_trf1f5v',
};

const IMGBB_API_KEY = '775b9ff97a53334137a22cb096c88a9c'; // <-- ВСТАВЬ СЮДА КЛЮЧ

export function ContactPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10 МБ

    const newFiles = Array.from(files).filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`Файл "${file.name}" — неподдерживаемый формат`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`Файл "${file.name}" слишком большой (макс. 10 МБ)`);
        return false;
      }
      return true;
    });

    const newAttachments = newFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const att = prev.find(a => a.id === id);
      if (att?.preview) URL.revokeObjectURL(att.preview);
      return prev.filter(a => a.id !== id);
    });
  };

  // Загрузка файла на ImgBB
  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Ошибка ImgBB');
    }

    return data.data.url; // Прямая ссылка на изображение
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')) {
      alert('Сначала настрой EMAILJS_CONFIG!');
      return;
    }
    if (IMGBB_API_KEY.includes('YOUR_')) {
      alert('Сначала вставь IMGBB_API_KEY!');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Загружаем все фото на ImgBB
      const uploadedAttachments = [...attachments];
      
      for (let i = 0; i < uploadedAttachments.length; i++) {
        setUploadProgress(`Загрузка ${i + 1} из ${uploadedAttachments.length}...`);
        const url = await uploadToImgBB(uploadedAttachments[i].file);
        uploadedAttachments[i] = { ...uploadedAttachments[i], uploadedUrl: url };
      }

      setUploadProgress('Отправка письма...');

      // 2. Формируем список ссылок
      const attachmentsList = uploadedAttachments.length > 0
        ? uploadedAttachments.map(a => 
            `📎 ${a.file.name} (${(a.file.size / 1024).toFixed(1)} КБ)\n🔗 ${a.uploadedUrl || 'Не загружено'}`
          ).join('\n\n')
        : 'Нет вложений';

      // 3. Отправляем через EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: getSubjectLabel(formData.subject),
          message: formData.message,
          attachments_count: uploadedAttachments.length.toString(),
          attachments_list: attachmentsList,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setAttachments([]);
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const getSubjectLabel = (value: string) => {
    const labels: Record<string, string> = {
      error: 'Сообщить об ошибке',
      hero: 'Добавить информацию о герое',
      event: 'Добавить событие',
      letter: 'Прислать письмо с фронта',
      photo: 'Прислать фотографию',
      other: 'Другое',
    };
    return labels[value] || value;
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero */}
      <section className="relative py-20 bg-[#1F1A16]">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/hero-memorial.jpg" alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-[#9B1B1B]/90 rounded-full px-4 py-2 mb-6">
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">Свяжитесь с нами</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Обратная связь</h1>
            <p className="text-[#C4953A] text-lg max-w-2xl mx-auto">
              Нашли неточность? Хотите добавить информацию? Напишите нам — вместе сохраняем память о подвиге.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              <FadeInOnScroll direction="left">
                <div>
                  <h2 className="text-2xl font-bold text-[#1F1A16] mb-4 font-serif">Как с нами связаться</h2>
                  <div className="w-16 h-1 bg-[#C4953A] mb-6" />
                </div>
              </FadeInOnScroll>

              <FadeInOnScroll direction="left" delay={0.2}>
                <div className="bg-white rounded-xl border border-[#E8DFD4] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#9B1B1B]/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-[#9B1B1B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1F1A16] mb-1">Сообщить об ошибке</h3>
                      <p className="text-[#8A8178] text-sm">Укажите тему «Сообщить об ошибке» — исправим оперативно.</p>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeInOnScroll direction="right">
                <div className="bg-white rounded-xl border border-[#E8DFD4] p-6 md:p-8">
                  {isSubmitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-[#C4953A]/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-[#C4953A]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#1F1A16] mb-2 font-serif">Сообщение отправлено</h3>
                      <p className="text-[#8A8178] mb-6">Спасибо! Мы рассмотрим обращение и свяжемся при необходимости.</p>
                      <Button onClick={() => setIsSubmitted(false)} className="bg-[#C4953A] text-[#1F1A16] hover:bg-[#A67B3D]">
                        Отправить ещё
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <h3 className="text-xl font-bold text-[#1F1A16] mb-6 font-serif">Форма обратной связи</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#1F1A16] flex items-center gap-2">
                            <User className="w-4 h-4 text-[#C4953A]" /> Ваше имя
                          </label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required
                            className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E8DFD4] rounded-lg focus:ring-2 focus:ring-[#C4953A]/50 focus:border-[#C4953A] text-[#1F1A16] placeholder-[#8A8178]/50"
                            placeholder="Иванов Иван" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#1F1A16] flex items-center gap-2">
                            <AtSign className="w-4 h-4 text-[#C4953A]" /> Email
                          </label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required
                            className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E8DFD4] rounded-lg focus:ring-2 focus:ring-[#C4953A]/50 focus:border-[#C4953A] text-[#1F1A16] placeholder-[#8A8178]/50"
                            placeholder="ivan@example.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1F1A16] flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#C4953A]" /> Тема
                        </label>
                        <select name="subject" value={formData.subject} onChange={handleChange} required
                          className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E8DFD4] rounded-lg focus:ring-2 focus:ring-[#C4953A]/50 focus:border-[#C4953A] text-[#1F1A16]">
                          <option value="">Выберите тему</option>
                          <option value="error">Сообщить об ошибке</option>
                          <option value="hero">Добавить информацию о герое</option>
                          <option value="event">Добавить событие</option>
                          <option value="letter">Прислать письмо с фронта</option>
                          <option value="photo">Прислать фотографию</option>
                          <option value="other">Другое</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1F1A16]">Сообщение</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={6}
                          className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E8DFD4] rounded-lg focus:ring-2 focus:ring-[#C4953A]/50 focus:border-[#C4953A] text-[#1F1A16] placeholder-[#8A8178]/50 resize-none"
                          placeholder="Опишите подробно..." />
                      </div>

                      {/* Files */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-[#1F1A16] flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-[#C4953A]" /> Вложения
                          <span className="text-xs text-[#8A8178] font-normal">— загрузятся на облако</span>
                        </label>
                        <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" onChange={handleFileSelect} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="w-full px-4 py-4 border-2 border-dashed border-[#E8DFD4] rounded-lg hover:border-[#C4953A] hover:bg-[#C4953A]/5 transition-all flex flex-col items-center gap-2 text-[#8A8178] hover:text-[#C4953A]">
                          <Upload className="w-6 h-6" />
                          <span className="text-sm font-medium">Нажмите для загрузки</span>
                          <span className="text-xs">JPG, PNG, PDF до 10 МБ</span>
                        </button>

                        {attachments.length > 0 && (
                          <div className="grid grid-cols-3 gap-3">
                            {attachments.map(att => (
                              <div key={att.id} className="relative group">
                                {att.preview ? (
                                  <div className="aspect-square rounded-lg overflow-hidden border border-[#E8DFD4]">
                                    <img src={att.preview} alt={att.file.name} className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="aspect-square rounded-lg border border-[#E8DFD4] bg-[#FAF6F0] flex items-center justify-center">
                                    <FileImage className="w-8 h-8 text-[#C4953A]" />
                                  </div>
                                )}
                                {att.uploadedUrl && (
                                  <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <Link2 className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <button type="button" onClick={() => removeAttachment(att.id)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#9B1B1B] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Прогресс */}
                      {uploadProgress && (
                        <div className="text-sm text-[#C4953A] text-center animate-pulse">
                          {uploadProgress}
                        </div>
                      )}

                      <Button type="submit" disabled={isSubmitting}
                        className="w-full bg-[#C4953A] text-[#1F1A16] hover:bg-[#A67B3D] py-6 text-base font-semibold disabled:opacity-50">
                        {isSubmitting ? (
                          <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Отправка...</span>
                        ) : (
                          <span className="flex items-center gap-2"><Send className="w-5 h-5" /> Отправить</span>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
