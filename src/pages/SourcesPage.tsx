
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, FileText, Archive, Globe } from 'lucide-react';
import { FadeInOnScroll } from '@/components/ParallaxSection';

interface SourceCategory {
  icon: React.ReactNode;
  title: string;
  sources: {
    name: string;
    description: string;
    url?: string;
  }[];
}

export function SourcesPage() {

  const categories: SourceCategory[] = [
    {
      icon: <Archive className="w-6 h-6" />,
      title: 'Государственные архивы',
      sources: [
        {
          name: 'Центральный архив Министерства обороны РФ',
          description: 'Официальные документы, приказы, оперативные сводки и личные дела военнослужащих периода Великой Отечественной войны.',
          url: 'https://pamyat-naroda.ru/',
        },
      ],
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Книги и публикации',
      sources: [
        {
          name: '«Великая Отечественная: Энциклопедия»',
          description: 'Фундаментальное издание, охватывающее все аспекты войны: события, личности, вооружение, операции.',
        },
        {
          name: '«Память народа» — электронный банк документов',
          description: 'Проект Минобороны России с доступом к оригинальным документам, фотографиям и картам.',
          url: 'https://pamyat-naroda.ru/',
        },
        {
          name: '«Подвиг народа» — электронный банк наградных документов',
          description: 'База данных о награждённых орденами и медалями СССР за подвиги в годы ВОВ.',
          url: 'https://podvignaroda.ru/',
        },
      ],
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Онлайн-ресурсы и базы данных',
      sources: [
        {
          name: '«Память народа» (pamyat-naroda.ru)',
          description: 'Единый портал архивных документов о ВОВ: фронтовые сводки, приказы, личные дела, фотографии.',
          url: 'https://pamyat-naroda.ru/',
        },
        {
          name: '«Подвиг народа» (podvignaroda.ru)',
          description: 'Поисковая система по наградным документам, позволяющая найти информацию о конкретном человеке.',
          url: 'https://podvignaroda.ru/',
        },
        {
          name: 'Музей Победы (victorymuseum.ru)',
          description: 'Официальный сайт Центрального музея Великой Отечественной войны с виртуальными экспозициями.',
          url: 'https://victorymuseum.ru/',
        },
      ],
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Мемуары и письма',
      sources: [
        {
          name: 'Собрание писем с фронта из семейных архивов',
          description: 'Оригинальные письма, предоставленные родственниками участников войны, переданные в цифровой вид.',
        },
        {
          name: 'Мемуары командиров и солдат',
          description: 'Воспоминания участников боевых действий, опубликованные в послевоенные годы.',
        },
        {
          name: 'Дневники военных лет',
          description: 'Личные записи солдат, офицеров и медицинского персонала с фронтовых линий.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#1F1A16]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/hero-memorial.jpg"
            alt=""
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#9B1B1B]/90 border border-[#9B1B1B] rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">Документальная база</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              Источники
            </h1>
            <p className="text-[#C4953A] text-lg max-w-2xl mx-auto">
              Все материалы сайта основаны на проверенных исторических документах, архивных данных и научных публикациях
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F1A16] mb-4 font-serif">
                Использованные источники
              </h2>
              <div className="w-20 h-1 bg-[#C4953A] mx-auto" />
              <p className="text-[#8A8178] mt-4 max-w-2xl mx-auto">
                Мы стремимся к максимальной исторической достоверности. 
                Вся информация на сайте подтверждена архивными документами и научными трудами.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="space-y-12">
            {categories.map((category, catIndex) => (
              <FadeInOnScroll key={catIndex} delay={catIndex * 0.1}>
                <div className="bg-white rounded-xl border border-[#E8DFD4] overflow-hidden">
                  <div className="px-6 py-4 bg-[#C4953A]/10 border-b border-[#E8DFD4] flex items-center gap-3">
                    <div className="text-[#C4953A]">{category.icon}</div>
                    <h3 className="text-xl font-bold text-[#1F1A16] font-serif">
                      {category.title}
                    </h3>
                  </div>
                  <div className="divide-y divide-[#E8DFD4]">
                    {category.sources.map((source, srcIndex) => (
                      <motion.div
                        key={srcIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: srcIndex * 0.05 }}
                        className="px-6 py-5 hover:bg-[#FAF6F0] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#1F1A16] mb-1">
                              {source.name}
                            </h4>
                            <p className="text-[#8A8178] text-sm leading-relaxed">
                              {source.description}
                            </p>
                          </div>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 inline-flex items-center gap-1 text-[#C4953A] hover:text-[#9B1B1B] transition-colors text-sm font-medium"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="hidden sm:inline">Перейти</span>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInOnScroll>
            ))}
          </div>

          {/* Disclaimer */}
          <FadeInOnScroll>
            <div className="mt-12 p-6 bg-[#9B1B1B]/5 border border-[#9B1B1B]/20 rounded-xl">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-[#9B1B1B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#1F1A16] mb-2">
                    Примечание о достоверности
                  </h4>
                  <p className="text-[#8A8178] text-sm leading-relaxed">
                    При подготовке материалов сайта использовались только проверенные источники: 
                    документы из государственных архивов, научные издания, мемуары участников событий. 
                    Все фотографии исторических личностей и событий взяты из открытых архивных фондов. 
                    Если вы обнаружили неточность или хотите дополнить информацию — 
                    пожалуйста, воспользуйтесь формой <span className="text-[#C4953A] font-medium">Обратной связи</span>.
                  </p>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}
