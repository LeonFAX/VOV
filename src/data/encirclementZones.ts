/**
 * Зоны окружения (котлы) — полигоны показывающие районы окружения вражеских войск.
 * Каждая зона: массив точек [lat, lng] образующих замкнутый полигон + дата.
 */

export interface EncirclementZone {
  id: string;
  name: string;
  date: Date;        // дата замыкания кольца
  endDate?: Date;    // дата рассечения котла
  points: [number, number][]; // полигон зоны окружения
  style?: 'hatched' | 'solid'; // стиль заливки
}

// Утилита
function P(lat: number, lng: number): [number, number] {
  return [lat, lng];
}

/**
 * Создать приблизительный круг/эллипс окружения.
 * center: [lat, lng], rx: радиус по широте, ry: радиус по долготе
 */
function circle(center: [number, number], rx: number, ry: number, points = 16): [number, number][] {
  const [cy, cx] = center;
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (2 * Math.PI * i) / points;
    pts.push([cy + rx * Math.cos(angle), cx + ry * Math.sin(angle)]);
  }
  return pts;
}

export const encirclementZones: EncirclementZone[] = [
  // ======= ДЕМЯНСКИЙ КОТЁЛ (1942-1943) =======
  {
    id: 'demyansk',
    name: 'Демянский котёл',
    date: new Date('1942-02-25'),
    endDate: new Date('1943-03-01'),
    style: 'hatched',
    points: circle([57.65, 32.47], 0.35, 0.5, 20),
  },

  // ======= СТАЛИНГРАДСКИЙ КОТЁЛ (1942-1943) =======
  {
    id: 'stalingrad',
    name: 'Сталинградский котёл',
    date: new Date('1942-11-23'),
    endDate: new Date('1943-02-02'),
    style: 'hatched',
    points: [
      P(49.5, 44.0),
      P(49.8, 44.2),
      P(50.0, 44.5),
      P(49.9, 44.8),
      P(49.7, 44.7),
      P(49.5, 44.6),
      P(49.3, 44.4),
      P(49.2, 44.2),
      P(49.3, 44.0),
    ],
  },

  // ======= КОТЁЛ ПОД КЕЛЬЮ (1944, Черниговско-Полтавская) =======
  {
    id: 'kiev-pocket',
    name: 'Киевский плацдарм и котёл под Келю',
    date: new Date('1943-12-24'),
    endDate: new Date('1944-02-05'),
    style: 'hatched',
    points: [
      P(50.8, 30.0),
      P(51.0, 30.5),
      P(51.2, 30.8),
      P(51.0, 31.0),
      P(50.8, 30.8),
      P(50.6, 30.5),
    ],
  },

  // ======= МИНСКИЙ КОТЁЛ (1944, Багратион) =======
  {
    id: 'minsk',
    name: 'Минский котёл',
    date: new Date('1944-07-03'),
    endDate: new Date('1944-07-12'),
    style: 'hatched',
    points: [
      P(54.2, 27.0),
      P(54.3, 27.5),
      P(54.0, 28.0),
      P(53.7, 27.8),
      P(53.5, 27.5),
      P(53.6, 27.0),
      P(53.9, 26.8),
      P(54.1, 26.9),
    ],
  },

  // ======= БОБРУЙСКИЙ КОТЁЛ (1944, Багратион) =======
  {
    id: 'bobruisk',
    name: 'Бобруйский котёл',
    date: new Date('1944-06-29'),
    endDate: new Date('1944-07-07'),
    style: 'hatched',
    points: [
      P(53.6, 28.5),
      P(53.7, 29.0),
      P(53.5, 29.3),
      P(53.2, 29.2),
      P(53.1, 28.8),
      P(53.2, 28.5),
      P(53.4, 28.3),
    ],
  },

  // ======= ВИТЕБСКИЙ КОТЁЛ (1944, Багратион) =======
  {
    id: 'vitebsk',
    name: 'Витебский котёл',
    date: new Date('1944-06-26'),
    endDate: new Date('1944-07-03'),
    style: 'hatched',
    points: [
      P(55.8, 30.0),
      P(55.9, 30.3),
      P(55.7, 30.5),
      P(55.5, 30.4),
      P(55.4, 30.2),
      P(55.5, 29.9),
      P(55.7, 29.8),
    ],
  },

  // ======= БРОДСКИЙ КОТЁЛ (1944, Львовско-Сандомирская) =======
  {
    id: 'brody',
    name: 'Бродский котёл',
    date: new Date('1944-07-18'),
    endDate: new Date('1944-07-22'),
    style: 'hatched',
    points: [
      P(50.2, 25.0),
      P(50.3, 25.2),
      P(50.2, 25.4),
      P(50.0, 25.3),
      P(49.9, 25.1),
      P(50.0, 24.9),
    ],
  },

  // ======= КОРСУНЬ-ШЕВЧЕНКОВСКИЙ КОТЁЛ (1944) =======
  {
    id: 'korsun',
    name: 'Корсунь-Шевченковский котёл',
    date: new Date('1944-02-12'),
    endDate: new Date('1944-02-17'),
    style: 'hatched',
    points: [
      P(49.5, 31.0),
      P(49.7, 31.2),
      P(49.6, 31.5),
      P(49.4, 31.4),
      P(49.3, 31.2),
      P(49.4, 30.9),
    ],
  },

  // ======= КЕНИГСБЕРГСКИЙ КОТЁЛ (1945) =======
  {
    id: 'konigsberg',
    name: 'Кёнигсбергский котёл',
    date: new Date('1945-01-26'),
    endDate: new Date('1945-04-09'),
    style: 'hatched',
    points: [
      P(54.7, 20.5),
      P(54.8, 21.0),
      P(54.7, 21.5),
      P(54.5, 21.5),
      P(54.3, 21.2),
      P(54.3, 20.8),
      P(54.5, 20.5),
    ],
  },

  // ======= ХАЛЬБЕ-БЕРЛИНСКИЙ КОТЁЛ (1945) =======
  {
    id: 'halbe',
    name: 'Котёл в районе Хальбе',
    date: new Date('1945-04-24'),
    endDate: new Date('1945-05-01'),
    style: 'hatched',
    points: [
      P(52.1, 13.7),
      P(52.2, 13.8),
      P(52.1, 13.9),
      P(52.0, 13.8),
    ],
  },
];

/**
 * Фильтрует зоны окружения, видимые на заданную дату.
 * Зона появляется в день замыкания кольца и исчезает через 1 день после рассечения.
 */
export function getVisibleZones(date: Date): EncirclementZone[] {
  return encirclementZones.filter(z => {
    if (z.date > date) return false;
    // Исчезает через 1 день после endDate
    const endDate = z.endDate || z.date;
    const hideAfter = new Date(endDate);
    hideAfter.setDate(hideAfter.getDate() + 1);
    if (date > hideAfter) return false;
    return true;
  });
}
