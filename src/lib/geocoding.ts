// Геокодинг для мест рождения героев
// Координаты загружаются из public/data/hero-coords.json во время инициализации HeroesMap

const coordsDB: Record<string, [number, number]> = {};

export function setCoordsDB(coords: Record<string, [number, number]>) {
  Object.assign(coordsDB, coords);
}

export function getHeroCoordsSync(place: string): [number, number] | null {
  if (!place) return null;

  // Точное совпадение
  if (coordsDB[place]) return coordsDB[place];

  // Поиск по подстроке (обратный)
  const lowerPlace = place.toLowerCase();
  for (const [key, coords] of Object.entries(coordsDB)) {
    const lowerKey = key.toLowerCase();
    if (lowerPlace.includes(lowerKey) || lowerKey.includes(lowerPlace)) {
      return coords;
    }
  }

  // Извлекаем город из строки (г. Название)
  const cityMatch = place.match(/г\.?\s*([А-Яа-я\s-]+)/i);
  if (cityMatch) {
    const city = cityMatch[1].trim();
    for (const [key, coords] of Object.entries(coordsDB)) {
      if (key.toLowerCase().includes(city.toLowerCase())) {
        return coords;
      }
    }
  }

  // Извлекаем область/край/республику
  const regionMatch = place.match(/([А-Яа-я\s-]+(?:область|край|республика|АССР|ССР))/i);
  if (regionMatch) {
    const region = regionMatch[1].trim();
    for (const [key, coords] of Object.entries(coordsDB)) {
      if (key.toLowerCase().includes(region.toLowerCase())) {
        return coords;
      }
    }
  }

  return null;
}

export function findMissingPlaces(heroes: any[]): string[] {
  const missing = new Set<string>();
  for (const hero of heroes) {
    const place = hero.birthPlace;
    if (!place) continue;
    if (!getHeroCoordsSync(place)) {
      missing.add(place);
    }
  }
  return Array.from(missing);
}
