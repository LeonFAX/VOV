
import { Shield, Lock, Eye, Database, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function PrivacyPage() {

  const sections = [
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Сбор информации',
      content: 'Мы собираем минимально необходимую информацию для работы сайта: данные, которые вы voluntarily предоставляете через форму обратной связи (имя, email, сообщение). Мы не собираем персональные данные автоматически, за исключением стандартных технических данных (IP-адрес, тип браузера), необходимых для обеспечения безопасности и корректной работы сайта.'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Использование данных',
      content: 'Предоставленная информация используется исключительно для ответа на ваши сообщения и улучшения работы сайта. Мы не передаём ваши данные третьим лицам, не продаём и не обмениваем их. Технические данные используются только для анализа работы сайта и предотвращения атак.'
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Защита данных',
      content: 'Мы принимаем разумные меры для защиты ваших данных от несанкционированного доступа, изменения или уничтожения. Все сообщения, отправляемые через форму обратной связи, передаются по защищённым каналам связи. Однако помните, что ни один метод передачи через интернет не является абсолютно безопасным.'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Форма обратной связи',
      content: 'При отправке сообщения через форму обратной связи вы предоставляете имя, email и текст сообщения. Эти данные направляются администратору сайта для обработки запроса. Сообщения хранятся в базе данных административной панели и могут быть удалены по вашему запросу.'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Cookies',
      content: 'Сайт может использовать cookies для обеспечения корректной работы (например, сохранение настроек темы). Это не персональные данные, и вы можете отключить cookies в настройках браузера, однако это может повлиять на функциональность сайта.'
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Хранение данных',
      content: 'Сообщения обратной связи хранятся в базе данных до тех пор, пока не потеряют актуальность или не будут удалены по запросу пользователя. Технические логи хранятся в течение 30 дней.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Шапка */}
      <div className="bg-[#1F1A16] py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#C4953A]" />
              <span className="text-[#C4953A] text-sm font-medium tracking-widest uppercase">
                Правовая информация
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#FAF6F0] mb-4">
              Политика конфиденциальности
            </h1>
            <p className="text-[#8A8178] text-lg leading-relaxed">
              Мы уважаем вашу приватность и обязуемся защищать персональные данные, которые вы нам доверяете.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Дата обновления */}
          <div className="bg-white rounded-lg border border-[#E8DFD4] p-6 mb-8">
            <p className="text-[#6B5D4F] text-sm">
              <span className="font-semibold text-[#1F1A16]">Последнее обновление:</span> 3 июня 2026 г.
            </p>
            <p className="text-[#8A8178] text-sm mt-2">
              Настоящая политика конфиденциальности регулирует порядок сбора, использования и хранения персональных данных пользователей мемориального сайта о Великой Отечественной войне.
            </p>
          </div>

          {/* Разделы */}
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg border border-[#E8DFD4] p-6 lg:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#C4953A]/10 flex items-center justify-center text-[#C4953A]">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-serif font-bold text-[#1F1A16] mb-3">
                      {section.title}
                    </h2>
                    <p className="text-[#6B5D4F] text-sm leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Контакты */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-[#1F1A16] rounded-lg p-6 lg:p-8 text-center"
          >
            <h3 className="text-lg font-serif font-bold text-[#FAF6F0] mb-3">
              Вопросы по политике конфиденциальности?
            </h3>
            <p className="text-[#8A8178] text-sm mb-4">
              Если у вас есть вопросы или вы хотите удалить свои данные, свяжитесь с нами через форму обратной связи.
            </p>
            <a
              href="/#/contact"
              className="inline-flex items-center gap-2 bg-[#C4953A] hover:bg-[#A87B2D] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              Написать нам
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
