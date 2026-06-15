import { Polygon, Tooltip } from 'react-leaflet';
import type { EncirclementZone } from '@/data/encirclementZones';

interface Props {
  zones: EncirclementZone[];
}

/**
 * Рисует зоны окружения (котлы) — штрихованные полигоны.
 * Каждая зона — полупрозрачный полигон с диагональной штриховкой.
 */
export function EncirclementZonesLayer({ zones }: Props) {
  if (!zones || zones.length === 0) return null;

  return (
    <>
      {zones.map((zone) => {
        // Основной полигон — полупрозрачная заливка
        const baseFill = (
          <Polygon
            key={`${zone.id}-fill`}
            positions={zone.points}
            pathOptions={{
              fillColor: '#8B3A3A',
              fillOpacity: 0.2,
              color: '#8B3A3A',
              weight: 3,
              opacity: 0.9,
              dashArray: zone.style === 'hatched' ? '6, 4' : undefined,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          >
            <Tooltip
              direction="center"
              offset={[0, 0]}
              opacity={1}
              className="custom-tooltip"
            >
              <div className="text-center">
                <div className="text-[10px] font-bold text-[#D4C4A0]">{zone.name}</div>
                <div className="text-[9px] text-[#8A7D6E]">
                  {zone.date.toLocaleDateString('ru-RU')} — {zone.endDate?.toLocaleDateString('ru-RU') || '...'}
                </div>
              </div>
            </Tooltip>
          </Polygon>
        );

        // Диагональная штриховка — дополнительные линии
        const hatchingLines = generateHatching(zone.points);
        const hatching = (
          <Polygon
            key={`${zone.id}-hatch`}
            positions={hatchingLines}
            pathOptions={{
              fillColor: '#A04040',
              fillOpacity: 0.1,
              color: '#A04040',
              weight: 1,
              opacity: 0.4,
              dashArray: '4, 6',
            }}
          />
        );

        // Внешнее кольцо — утолщённая линия
        const border = (
          <Polygon
            key={`${zone.id}-border`}
            positions={zone.points}
            pathOptions={{
              fill: false,
              color: '#C45454',
              weight: 3.5,
              opacity: 0.75,
              dashArray: '8, 4, 2, 4',
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        );

        return (
          <div key={zone.id}>
            {hatching}
            {baseFill}
            {border}
          </div>
        );
      })}
    </>
  );
}

/**
 * Генерирует точки для диагональной штриховки внутри полигона.
 * Упрощённый подход — создаём меньший полигон со смещением.
 */
function generateHatching(points: [number, number][]): [number, number][] {
  if (points.length < 3) return points;
  // Вычисляем центр
  const centerLat = points.reduce((s, p) => s + p[0], 0) / points.length;
  const centerLng = points.reduce((s, p) => s + p[1], 0) / points.length;
  // Сжимаем точки к центру на 30%
  return points.map(([lat, lng]) => [
    centerLat + (lat - centerLat) * 0.85,
    centerLng + (lng - centerLng) * 0.85,
  ]) as [number, number][];
}
