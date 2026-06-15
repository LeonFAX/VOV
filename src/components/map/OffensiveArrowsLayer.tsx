import { useMemo } from 'react';
import { Polyline, Polygon, Tooltip } from 'react-leaflet';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { OffensiveArrow } from '@/data/offensiveArrows';

interface Props {
  arrows: OffensiveArrow[];
}

// === ЧИСТЫЕ ФУНКЦИИ ВНЕ КОМПОНЕНТА (без хуков) ===

function smoothCurve(points: [number, number][]): [number, number][] {
  if (points.length <= 2) return points;
  
  const result: [number, number][] = [];
  const segments = 16;
  
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const prev = points[i - 1];
    const after = points[i + 2];
    
    let cp1: [number, number];
    let cp2: [number, number];
    
    if (!prev && !after) {
      cp1 = curr;
      cp2 = next;
    } else {
      const p0 = prev || curr;
      const p1 = curr;
      const p2 = next;
      const p3 = after || next;
      
      const tension = 0.15;
      
      cp1 = [
        p1[0] + (p2[0] - p0[0]) * tension,
        p1[1] + (p2[1] - p0[1]) * tension
      ];
      cp2 = [
        p2[0] - (p3[0] - p1[0]) * tension,
        p2[1] - (p3[1] - p1[1]) * tension
      ];
    }
    
    for (let t = 0; t < segments; t++) {
      const s = t / segments;
      const s2 = s * s;
      const s3 = s2 * s;
      const inv = 1 - s;
      const inv2 = inv * inv;
      const inv3 = inv2 * inv;
      
      const lat = inv3 * curr[0] + 3 * inv2 * s * cp1[0] + 3 * inv * s2 * cp2[0] + s3 * next[0];
      const lng = inv3 * curr[1] + 3 * inv2 * s * cp1[1] + 3 * inv * s2 * cp2[1] + s3 * next[1];
      result.push([lat, lng]);
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
}

function getWidthScale(progress: number): number {
  if (progress <= 0.6) return 1;
  if (progress <= 0.85) {
    const t = (progress - 0.6) / 0.25;
    return 1 - t * 0.3;
  }
  const t = (progress - 0.85) / 0.15;
  return 0.7 * (1 - Math.pow(t, 1.5));
}

function buildArrowGeometry(arrow: OffensiveArrow) {
  const pts = arrow.points;
  if (pts.length < 2) return null;

  const isCounter = arrow.type === 'counteroffensive';
  const bodyColor = isCounter ? '#A03030' : '#D84040';
  const strokeColor = isCounter ? '#6B1F1F' : '#8B2020';
  const highlightColor = isCounter ? '#D97070' : '#FF6B6B';
  const shadowColor = isCounter ? '#3D0A0A' : '#5A0A0A';

  const widthMultiplier = (arrow.width || 2) / 2;
  const baseWidth = 0.10 * widthMultiplier;

  // Плавная кривая
  const smoothPoints = smoothCurve(pts);

  // Геометрия с широким основанием и плавным сужением
  const leftSide: [number, number][] = [];
  const rightSide: [number, number][] = [];

  for (let i = 0; i < smoothPoints.length; i++) {
    const curr = smoothPoints[i];
    const next = smoothPoints[i + 1] || curr;
    const prev = smoothPoints[i - 1] || curr;

    let dx = next[1] - prev[1];
    let dy = next[0] - prev[0];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    const perpX = -dy;
    const perpY = dx;

    const progress = smoothPoints.length > 1 ? i / (smoothPoints.length - 1) : 0;
    const widthScale = getWidthScale(progress);
    const currentWidth = baseWidth * widthScale;

    leftSide.push([
      curr[0] + perpX * currentWidth,
      curr[1] + perpY * currentWidth
    ]);
    rightSide.push([
      curr[0] - perpX * currentWidth,
      curr[1] - perpY * currentWidth
    ]);
  }

  // Наконечник
  const lastPt = smoothPoints[smoothPoints.length - 1];
  const prevPt = smoothPoints[smoothPoints.length - 2] || smoothPoints[0];
  
  const dx = lastPt[1] - prevPt[1];
  const dy = lastPt[0] - prevPt[0];
  const dirLen = Math.hypot(dx, dy) || 1;
  const dirX = dx / dirLen;
  const dirY = dy / dirLen;
  const perpX = -dirY;
  const perpY = dirX;

  const tipLength = baseWidth * 3.5;
  const tipBaseWidth = baseWidth * 2.0;
  const tipInset = baseWidth * 0.15;

  const tipPoint: [number, number] = [
    lastPt[0] + dirY * tipLength,
    lastPt[1] + dirX * tipLength
  ];

  const tipBase: [number, number] = [
    lastPt[0] - dirY * tipInset,
    lastPt[1] - dirX * tipInset
  ];

  const tipLeft: [number, number] = [
    tipBase[0] + perpX * tipBaseWidth,
    tipBase[1] + perpY * tipBaseWidth
  ];
  const tipRight: [number, number] = [
    tipBase[0] - perpX * tipBaseWidth,
    tipBase[1] - perpY * tipBaseWidth
  ];

  const arrowBody: [number, number][] = [
    ...leftSide,
    tipLeft,
    tipPoint,
    tipRight,
    ...rightSide.reverse()
  ];

  const dateStr = arrow.date ? format(arrow.date, 'd MMM yyyy', { locale: ru }) : '';

  return {
    arrowBody,
    centerLine: smoothPoints,
    shadowBody: arrowBody.map(([lat, lng]) => [lat + 0.003, lng + 0.003] as [number, number]),
    bodyColor,
    strokeColor,
    highlightColor,
    shadowColor,
    dateStr,
    isCounter,
    pts,
    name: arrow.name,
    id: arrow.id,
  };
}

/**
 * Исторические наступательные стрелки
 * - Широкое основание, плавное сужение к острию
 * - Градиентная заливка через слои Polygon
 * - Компактный наконечник
 */
export function OffensiveArrowsLayer({ arrows }: Props) {
  if (!arrows || arrows.length === 0) return null;

  // useMemo ТОЛЬКО на верхнем уровне — один раз для всего массива
  const arrowGeometries = useMemo(() => {
    return arrows.map(arrow => buildArrowGeometry(arrow)).filter(Boolean);
  }, [arrows]);

  return (
    <>
      {arrowGeometries.map((geo) => {
        if (!geo) return null;
        
        const {
          arrowBody,
          centerLine,
          shadowBody,
          bodyColor,
          strokeColor,
          highlightColor,
          shadowColor,
          dateStr,
          isCounter,
          pts,
          name,
          id,
        } = geo;

        return (
          <div key={id}>
            {/* Тень (смещение вниз-вправо для объёма) */}
            <Polygon
              positions={shadowBody}
              pathOptions={{
                color: shadowColor,
                weight: 1,
                fillColor: shadowColor,
                fillOpacity: 0.3,
                opacity: 0.4,
              }}
            />

            {/* ВНЕШНИЙ КОНТУР (тёмная окантовка для контраста) */}
            <Polygon
              positions={arrowBody}
              pathOptions={{
                color: strokeColor,
                weight: 4,
                fillColor: 'transparent',
                opacity: 0.9,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />

            {/* ОСНОВНОЕ ТЕЛО (основной цвет) */}
            <Polygon
              positions={arrowBody}
              pathOptions={{
                color: 'transparent',
                weight: 0,
                fillColor: bodyColor,
                fillOpacity: 0.85,
                lineJoin: 'round',
              }}
            />

            {/* ВНУТРЕННЯЯ ПОДСВЕТКА (светлее по центру — эффект градиента) */}
            <Polyline
              positions={centerLine}
              pathOptions={{
                color: highlightColor,
                weight: 5,
                opacity: 0.5,
                dashArray: isCounter ? '6, 4' : undefined,
                lineCap: 'round',
              }}
            />

            {/* ЦЕНТРАЛЬНАЯ ЛИНИЯ (самая яркая) */}
            <Polyline
              positions={centerLine}
              pathOptions={{
                color: '#FFCCCC',
                weight: 2,
                opacity: 0.4,
                lineCap: 'round',
              }}
            />

            {/* Tooltip */}
            {name && (
              <Polyline
                positions={[pts[0], pts[pts.length - 1]]}
                pathOptions={{ color: 'transparent', weight: 0, opacity: 0 }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
                  <div className="bg-[#181410] px-2.5 py-1.5 rounded border border-[#3D3225] min-w-[160px]">
                    <p className="text-[#D4C4A0] text-xs font-bold leading-tight">{name}</p>
                    {dateStr && (
                      <p className="text-[#8A7D6E] text-[10px] mt-0.5">{dateStr}</p>
                    )}
                  </div>
                </Tooltip>
              </Polyline>
            )}
          </div>
        );
      })}
    </>
  );
}
