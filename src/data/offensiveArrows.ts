/**
 * Красные стрелки наступления — направление советских наступательных операций.
 * Каждая стрелка: точки [lat, lng] от начала до конца + дата операции.
 */

export interface OffensiveArrow {
  id: string;
  name: string;           // Название операции
  date: Date;             // Дата начала наступления
  endDate?: Date;         // Дата окончания
  type: 'offensive' | 'counteroffensive';
  points: [number, number][]; // Линия стрелки [lat, lng]
  width?: number;         // Толщина стрелки (1-3)
}

// Утилита для создания стрелки
function A(lat: number, lng: number): [number, number] {
  return [lat, lng];
}

export const offensiveArrows: OffensiveArrow[] = [
  // ======= 1941 =======
  {
    id: 'moscow-counter-1',
    name: 'Контрнаступление под Москвой (север)',
    date: new Date('1941-12-05'),
    endDate: new Date('1942-01-07'),
    type: 'counteroffensive',
    width: 2,
    points: [
      A(56.3, 36.8), A(56.5, 36.0), A(56.7, 35.2), A(56.9, 34.5),
    ],
  },
  {
    id: 'moscow-counter-2',
    name: 'Контрнаступление под Москвой (запад)',
    date: new Date('1941-12-05'),
    endDate: new Date('1942-01-07'),
    type: 'counteroffensive',
    width: 2,
    points: [
      A(55.8, 36.5), A(56.0, 35.5), A(56.2, 34.5), A(56.3, 33.5),
    ],
  },
  {
    id: 'moscow-counter-3',
    name: 'Контрнаступление под Москвой (юг)',
    date: new Date('1941-12-05'),
    endDate: new Date('1942-01-07'),
    type: 'counteroffensive',
    width: 2,
    points: [
      A(55.3, 36.0), A(55.5, 35.0), A(55.7, 34.0), A(55.8, 33.0),
    ],
  },
  {
    id: 'tikhvin-counter',
    name: 'Тихвинская наступательная операция',
    date: new Date('1941-12-10'),
    endDate: new Date('1941-12-30'),
    type: 'counteroffensive',
    width: 1,
    points: [
      A(59.5, 32.0), A(59.6, 31.5), A(59.8, 31.0),
    ],
  },

  // ======= 1942 =======
  {
    id: 'kharkov-spring',
    name: 'Харьковская операция (1942)',
    date: new Date('1942-05-12'),
    endDate: new Date('1942-05-28'),
    type: 'offensive',
    width: 1,
    points: [
      A(49.8, 36.5), A(50.0, 36.8), A(50.2, 37.0),
    ],
  },
  {
    id: 'uranus-north',
    name: 'Операция «Уран» (северное крыло)',
    date: new Date('1942-11-19'),
    endDate: new Date('1942-11-23'),
    type: 'offensive',
    width: 3,
    points: [
      A(51.0, 44.0), A(50.8, 44.2), A(50.5, 44.3), A(50.2, 44.4), A(50.0, 44.5),
    ],
  },
  {
    id: 'uranus-south',
    name: 'Операция «Уран» (южное крыло)',
    date: new Date('1942-11-20'),
    endDate: new Date('1942-11-23'),
    type: 'offensive',
    width: 3,
    points: [
      A(48.5, 44.0), A(48.7, 44.2), A(49.0, 44.3), A(49.2, 44.4), A(49.5, 44.5),
    ],
  },
  {
    id: 'iskra',
    name: 'Операция «Искра»',
    date: new Date('1943-01-12'),
    endDate: new Date('1943-01-30'),
    type: 'offensive',
    width: 2,
    points: [
      A(60.2, 32.3), A(60.1, 31.8), A(60.0, 31.3),
    ],
  },

  // ======= 1943 =======
  {
    id: 'kursk-north-counter',
    name: 'Контрнаступление на северном фасе Курской дуги',
    date: new Date('1943-07-12'),
    endDate: new Date('1943-08-05'),
    type: 'counteroffensive',
    width: 2,
    points: [
      A(52.5, 36.2), A(52.8, 36.0), A(53.0, 35.8), A(53.3, 35.5),
    ],
  },
  {
    id: 'kursk-south-counter',
    name: 'Контрнаступление на южном фасе Курской дуги',
    date: new Date('1943-07-12'),
    endDate: new Date('1943-08-23'),
    type: 'counteroffensive',
    width: 2,
    points: [
      A(51.2, 36.0), A(51.3, 35.5), A(51.5, 35.0), A(51.8, 34.5),
    ],
  },
  {
    id: 'orel-offensive',
    name: 'Орловская наступательная операция',
    date: new Date('1943-07-12'),
    endDate: new Date('1943-08-18'),
    type: 'offensive',
    width: 2,
    points: [
      A(53.0, 36.5), A(53.2, 36.2), A(53.4, 36.0), A(53.5, 35.8),
    ],
  },
  {
    id: 'belgorod-kharkov',
    name: 'Белгородско-Харьковская операция',
    date: new Date('1943-08-03'),
    endDate: new Date('1943-08-23'),
    type: 'offensive',
    width: 2,
    points: [
      A(50.6, 36.6), A(50.7, 36.8), A(50.8, 37.0), A(50.9, 37.2),
    ],
  },
  {
    id: 'dnepr-west',
    name: 'Наступление к Днепру (западное направление)',
    date: new Date('1943-08-26'),
    endDate: new Date('1943-09-30'),
    type: 'offensive',
    width: 2,
    points: [
      A(51.8, 32.0), A(51.6, 31.5), A(51.5, 31.0), A(51.3, 30.5),
    ],
  },
  {
    id: 'dnepr-center',
    name: 'Наступление к Днепру (центральное направление)',
    date: new Date('1943-08-26'),
    endDate: new Date('1943-09-30'),
    type: 'offensive',
    width: 2,
    points: [
      A(50.5, 33.0), A(50.3, 32.5), A(50.2, 32.0), A(50.0, 31.5),
    ],
  },
  {
    id: 'dnepr-south',
    name: 'Наступление к Днепру (южное направление)',
    date: new Date('1943-08-26'),
    endDate: new Date('1943-09-30'),
    type: 'offensive',
    width: 2,
    points: [
      A(49.5, 36.0), A(49.3, 35.5), A(49.1, 35.0), A(48.8, 34.5),
    ],
  },

  // ======= 1944 =======
  {
    id: 'leningrad-novgorod',
    name: 'Ленинградско-Новгородская операция',
    date: new Date('1944-01-14'),
    endDate: new Date('1944-03-01'),
    type: 'offensive',
    width: 2,
    points: [
      A(59.8, 30.3), A(59.6, 29.5), A(59.4, 28.5),
    ],
  },
  {
    id: 'korsun',
    name: 'Корсунь-Шевченковская операция',
    date: new Date('1944-01-24'),
    endDate: new Date('1944-02-17'),
    type: 'offensive',
    width: 2,
    points: [
      A(49.5, 31.0), A(49.3, 31.3), A(49.1, 31.5),
    ],
  },
  {
    id: 'proskurov',
    name: 'Проскуровско-Черновицкая операция',
    date: new Date('1944-03-04'),
    endDate: new Date('1944-04-17'),
    type: 'offensive',
    width: 1,
    points: [
      A(49.8, 27.0), A(49.6, 26.5), A(49.4, 26.0),
    ],
  },
  {
    id: 'crimea',
    name: 'Крымская наступательная операция',
    date: new Date('1944-04-08'),
    endDate: new Date('1944-05-12'),
    type: 'offensive',
    width: 2,
    points: [
      A(46.0, 33.5), A(45.5, 33.8), A(45.0, 34.0), A(44.5, 34.2),
    ],
  },
  // --- БАГРАТИОН (крупнейшая операция 1944) ---
  {
    id: 'bagration-vitebsk',
    name: 'Операция «Багратион» — Витебское направление',
    date: new Date('1944-06-23'),
    endDate: new Date('1944-08-29'),
    type: 'offensive',
    width: 3,
    points: [
      A(55.8, 33.2), A(55.5, 32.5), A(55.2, 31.8), A(54.8, 30.5),
    ],
  },
  {
    id: 'bagration-mogilev',
    name: 'Операция «Багратион» — Могилёвское направление',
    date: new Date('1944-06-23'),
    endDate: new Date('1944-08-29'),
    type: 'offensive',
    width: 3,
    points: [
      A(54.5, 32.0), A(54.2, 31.0), A(53.8, 30.0), A(53.5, 28.0),
    ],
  },
  {
    id: 'bagration-bobruisk',
    name: 'Операция «Багратион» — Бобруйское направление',
    date: new Date('1944-06-23'),
    endDate: new Date('1944-08-29'),
    type: 'offensive',
    width: 3,
    points: [
      A(53.5, 29.0), A(53.2, 28.0), A(53.0, 27.0), A(52.5, 26.0),
    ],
  },
  {
    id: 'bagration-pinsk',
    name: 'Операция «Багратион» — Полоцко-Вильнюсское направление',
    date: new Date('1944-06-23'),
    endDate: new Date('1944-08-29'),
    type: 'offensive',
    width: 2,
    points: [
      A(55.5, 28.5), A(55.2, 27.0), A(54.8, 25.5), A(54.5, 24.0),
    ],
  },
  {
    id: 'lvov-sandomierz',
    name: 'Львовско-Сандомирская операция',
    date: new Date('1944-07-13'),
    endDate: new Date('1944-08-29'),
    type: 'offensive',
    width: 2,
    points: [
      A(50.0, 25.0), A(50.0, 24.0), A(50.0, 23.0), A(50.2, 22.0),
    ],
  },
  {
    id: 'yassy-kishinev',
    name: 'Ясско-Кишинёвская операция',
    date: new Date('1944-08-20'),
    endDate: new Date('1944-08-31'),
    type: 'offensive',
    width: 2,
    points: [
      A(47.2, 27.5), A(47.0, 27.8), A(46.8, 28.0),
    ],
  },

  // ======= 1945 =======
  {
    id: 'vistula-oder',
    name: 'Висло-Одерская операция (основное направление)',
    date: new Date('1945-01-12'),
    endDate: new Date('1945-02-03'),
    type: 'offensive',
    width: 3,
    points: [
      A(52.0, 21.0), A(52.2, 19.0), A(52.3, 17.0), A(52.4, 15.5),
    ],
  },
  {
    id: 'vistula-oder-south',
    name: 'Висло-Одерская операция (южное направление)',
    date: new Date('1945-01-12'),
    endDate: new Date('1945-02-03'),
    type: 'offensive',
    width: 2,
    points: [
      A(50.5, 21.0), A(50.8, 19.0), A(51.0, 17.0), A(51.2, 15.5),
    ],
  },
  {
    id: 'east-prussia',
    name: 'Восточно-Прусская операция',
    date: new Date('1945-01-13'),
    endDate: new Date('1945-04-25'),
    type: 'offensive',
    width: 2,
    points: [
      A(54.5, 22.0), A(54.5, 21.0), A(54.3, 20.5), A(54.5, 20.0),
    ],
  },
  {
    id: 'berlin-1',
    name: 'Берлинская операция (северное крыло)',
    date: new Date('1945-04-16'),
    endDate: new Date('1945-05-02'),
    type: 'offensive',
    width: 3,
    points: [
      A(52.5, 14.5), A(52.4, 14.0), A(52.4, 13.6),
    ],
  },
  {
    id: 'berlin-2',
    name: 'Берлинская операция (южное крыло)',
    date: new Date('1945-04-16'),
    endDate: new Date('1945-05-02'),
    type: 'offensive',
    width: 3,
    points: [
      A(51.8, 14.5), A(51.9, 14.0), A(52.0, 13.6),
    ],
  },
  {
    id: 'berlin-3',
    name: 'Берлинская операция (центральное направление)',
    date: new Date('1945-04-16'),
    endDate: new Date('1945-05-02'),
    type: 'offensive',
    width: 3,
    points: [
      A(52.2, 15.0), A(52.3, 14.5), A(52.4, 13.8),
    ],
  },
];

/**
 * Фильтрует стрелки, видимые на заданную дату.
 * Стрелка появляется в день начала и исчезает через 1 день после окончания.
 */
export function getVisibleArrows(date: Date): OffensiveArrow[] {
  return offensiveArrows.filter(a => {
    const start = a.date;
    // Конец видимости: endDate + 1 день
    const endDate = a.endDate || a.date;
    const hideAfter = new Date(endDate);
    hideAfter.setDate(hideAfter.getDate() + 1);
    return start <= date && date <= hideAfter;
  });
}
