import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Link } from 'react-router-dom';
import type { Monument, Event } from '@/types';
import { interpolateFrontLine } from '@/data/frontLine';
import { getVisibleArrows } from '@/data/offensiveArrows';
import { getVisibleZones } from '@/data/encirclementZones';
import { OffensiveArrowsLayer } from './OffensiveArrowsLayer';
import { EncirclementZonesLayer } from './EncirclementZonesLayer';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const dateLocales: Record<string, typeof ru> = { ru, en: ru, be: ru };

const RU_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const typeColors: Record<string, string> = {
  battle: '#9B1B1B',
  operation: '#3D6B4A',
  movement: '#6B5D4F',
  shelling: '#C4953A',
  political: '#3D6B4A',
  strategic: '#C4953A',
  liberation: '#3D6B4A',
  occupation: '#9B1B1B',
  offensive: '#B52B2B',
  defense: '#4A7C9B',
  encirclement: '#C97A3A',
  other: '#8A8178',
};

// === ПРЕЖНИЕ МАРКЕРЫ СОБЫТИЙ (плоские военные силуэты) ===
function createMilitarySilhouette(type: string, color: string): DivIcon {
  const symbols: Record<string, string> = {
    battle: '⚔',
    operation: '⬟',
    movement: '▶',
    shelling: '✦',
    political: '♔',
    strategic: '✶',
    liberation: '⚑',
    occupation: '▣',
    offensive: '→',
    defense: '🛡',
    encirclement: '◉',
    other: '●',
  };
  const sym = symbols[type] || symbols.other;

  return new DivIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};border:2px solid #1F1A16;
      display:flex;align-items:center;justify-content:center;
      font-size:14px;line-height:1;color:#FFFFFF;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      cursor:pointer;font-family:serif;
    ">${sym}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const markerIcons: Record<string, DivIcon> = Object.fromEntries(
  Object.entries(typeColors).map(([type, color]) => [
    type,
    createMilitarySilhouette(type, color)
  ])
);

// === НОВЫЙ МИНИМАЛИСТИЧНЫЙ МАРКЕР ПАМЯТНИКА ===
function createMonumentMarker(isActive: boolean = false): DivIcon {
  const size = isActive ? 28 : 24;
  const scale = isActive ? 1.15 : 1;
  
  return new DivIcon({
    className: `monument-marker ${isActive ? 'monument-marker-active' : ''}`,
    html: `
      <div style="
        width:${size}px;
        height:${size + 10}px;
        position: relative;
        cursor: pointer;
        transform: scale(${scale});
        transition: transform 0.25s ease;
      ">
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: ${size * 0.5}px;
          height: 4px;
          background: rgba(0,0,0,0.15);
          border-radius: 50%;
          filter: blur(1px);
        "></div>
        
        <div style="
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: ${size}px;
          height: ${size}px;
          background: ${isActive ? '#B52B2B' : '#9B1B1B'};
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          box-shadow: 0 2px 8px rgba(139, 26, 26, 0.35);
          transition: all 0.25s ease;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: ${size * 0.3}px;
            height: ${size * 0.3}px;
            background: white;
            border-radius: 50%;
            opacity: 0.9;
          "></div>
        </div>
      </div>
    `,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 6],
    popupAnchor: [0, -size - 2],
  });
}

// === КЭШ ===
const monumentIconCache: Record<string, DivIcon> = {};
const activeMonumentIconCache: Record<string, DivIcon> = {};

function getMonumentIcon(isActive: boolean = false): DivIcon {
  const cache = isActive ? activeMonumentIconCache : monumentIconCache;
  const key = isActive ? 'active' : 'default';
  if (!cache[key]) {
    cache[key] = createMonumentMarker(isActive);
  }
  return cache[key];
}

interface MapControllerProps {
  center?: [number, number];
  zoom?: number;
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

function FrontLineLayer({ line }: { line: [number, number][] }) {
  if (!line || line.length < 2) return null;

  return (
    <>
      <Polyline
        positions={line}
        smoothFactor={0}
        pathOptions={{
          color: '#9B1B1B',
          weight: 8,
          opacity: 0.12,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      <Polyline
        positions={line}
        smoothFactor={0}
        pathOptions={{
          color: '#9B1B1B',
          weight: 3,
          opacity: 0.85,
          dashArray: '10, 6',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      <Polyline
        positions={line}
        smoothFactor={0}
        pathOptions={{
          color: '#C85555',
          weight: 1.5,
          opacity: 0.6,
          dashArray: '10, 6',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </>
  );
}

interface InteractiveMapProps {
  monuments?: Monument[];
  events?: Event[];
  selectedMonument?: Monument | null;
  selectedEvent?: Event | null;
  selectedDate?: Date;
  onMonumentClick?: (monument: Monument) => void;
  onEventClick?: (event: Event) => void;
  showMonuments?: boolean;
  showEvents?: boolean;
  showFrontLine?: boolean;
  showOffensiveArrows?: boolean;
  showEncirclementZones?: boolean;
  showLegend?: boolean;
  showTypeFilters?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  children?: React.ReactNode;
}

export function InteractiveMap({
  monuments = [],
  events = [],
  selectedMonument,
  selectedDate = new Date('1941-06-21'),
  onMonumentClick,
  onEventClick,
  showMonuments = true,
  showEvents = true,
  showFrontLine = true,
  showOffensiveArrows = true,
  showEncirclementZones = true,
  showLegend = true,
  showTypeFilters = true,
  center = [55.0, 40.0],
  zoom = 5,
  height = '600px',
  className = '',
  children,
}: InteractiveMapProps) {
  const { t, i18n } = useTranslation('pages');
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(['battle', 'operation', 'movement', 'shelling', 'political', 'strategic', 'liberation', 'occupation', 'offensive', 'defense', 'encirclement', 'other']));
  const [showArrows, setShowArrows] = useState(showOffensiveArrows);
  const [showZones, setShowZones] = useState(showEncirclementZones);

  const frontLineData = useMemo(() => interpolateFrontLine(selectedDate), [selectedDate]);

  // === ОБНОВЛЁННАЯ ЛОГИКА ВИДИМОСТИ СОБЫТИЙ ===
  // Событие видно: от event.date до event.hideDate (если есть)
  // Или от event.date до event.date + 7 дней (если hideDate нет)
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (!activeTypes.has(event.type)) return false;
      
      const eventStart = new Date(event.date);
      // Если есть hideDate — используем её, иначе +7 дней от даты события
      const eventEnd = event.hideDate 
        ? new Date(event.hideDate) 
        : new Date(eventStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return eventStart <= selectedDate && selectedDate <= eventEnd;
    });
  }, [events, activeTypes, selectedDate]);

  const visibleArrows = useMemo(() => showArrows ? getVisibleArrows(selectedDate) : [], [showArrows, selectedDate]);
  const visibleZones = useMemo(() => showZones ? getVisibleZones(selectedDate) : [], [showZones, selectedDate]);

  const toggleType = (type: string) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  useEffect(() => {
    if (selectedMonument) setMapCenter(selectedMonument.coordinates);
  }, [selectedMonument]);

  // === ОБНОВЛЁННЫЙ ПОДСЧЁТ ДЛЯ ЛЕГЕНДЫ ===
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.filter(e => {
      const eventStart = new Date(e.date);
      const eventEnd = e.hideDate 
        ? new Date(e.hideDate) 
        : new Date(eventStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventStart <= selectedDate && selectedDate <= eventEnd;
    }).forEach(e => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    return counts;
  }, [events, selectedDate]);

  return (
    <div className={`relative rounded-lg overflow-hidden border border-[#E8DFD4] ${className}`} style={{ height }}>
      <style>{`
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-container .leaflet-bottom.leaflet-right { display: none !important; }
        
        .monument-marker:hover {
          z-index: 1000 !important;
        }
        
        .monument-marker:hover > div {
          transform: scale(1.2) !important;
        }
        
        .monument-marker:hover > div > div:last-child {
          background: #B52B2B !important;
          box-shadow: 0 3px 12px rgba(139, 26, 26, 0.45) !important;
        }
        
        .monument-marker-active > div {
          transform: scale(1.15) !important;
        }
        
        .monument-marker-active > div > div:last-child {
          background: #B52B2B !important;
          box-shadow: 0 0 0 4px rgba(181, 43, 43, 0.2), 0 3px 12px rgba(139, 26, 26, 0.45) !important;
        }
        
        .leaflet-popup {
          margin-bottom: 15px !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.18) !important;
          border: 1px solid #E8DFD4 !important;
          padding: 0 !important;
          overflow: hidden;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
          width: 300px !important;
        }
        
        .leaflet-popup-tip {
          background: white !important;
          border: 1px solid #E8DFD4 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
          width: 10px !important;
          height: 10px !important;
          margin: -5px auto 0 !important;
        }
        
        .leaflet-popup-close-button {
          width: 24px !important;
          height: 24px !important;
          top: 6px !important;
          right: 6px !important;
          background: rgba(0,0,0,0.35) !important;
          border-radius: 50% !important;
          color: white !important;
          font-size: 16px !important;
          line-height: 24px !important;
          text-align: center !important;
          padding: 0 !important;
          transition: all 0.2s !important;
        }
        
        .leaflet-popup-close-button:hover {
          background: rgba(0,0,0,0.55) !important;
          color: white !important;
        }
        
        .custom-tooltip {
          background: rgba(31, 26, 22, 0.92) !important;
          border: 1px solid rgba(212, 175, 55, 0.5) !important;
          border-radius: 6px !important;
          color: white !important;
          font-size: 12px !important;
          padding: 6px 10px !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.25) !important;
        }
        
        .custom-tooltip::before {
          border-top-color: rgba(212, 175, 55, 0.5) !important;
        }
      `}</style>
      
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        minZoom={3} 
        maxZoom={15}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }} 
        className="z-0"
      >
        <TileLayer
          attribution=''
          url={RU_TILES}
        />
        
        <MapController center={mapCenter} zoom={selectedMonument ? 12 : zoom} />

        {showFrontLine && <FrontLineLayer line={frontLineData.line} />}
        {showZones && <EncirclementZonesLayer zones={visibleZones} />}
        {showArrows && <OffensiveArrowsLayer arrows={visibleArrows} />}

        {showEvents && filteredEvents.map((event) => (
          event.coordinates && (
            <Marker 
              key={event.id} 
              position={[event.coordinates[0], event.coordinates[1]]}
              icon={markerIcons[event.type] || markerIcons.other}
              eventHandlers={{ 
                click: () => onEventClick?.(event),
                mouseover: (e) => e.target.openTooltip(),
                mouseout: (e) => e.target.closeTooltip(),
              }}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -16]} 
                opacity={1} 
                className="custom-tooltip"
                permanent={false}
              >
                <div className="min-w-[180px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: typeColors[event.type] }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      {t(`events.typeLabels.${event.type}`, event.type) as string}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white mb-0.5 leading-tight">{event.title}</p>
                  <p className="text-[10px] text-[#C4B4A0]">
                    {format(event.date, 'd MMM yyyy', { locale: dateLocales[i18n.language] || ru })}
                  </p>
                </div>
              </Tooltip>

              <Popup minWidth={320} maxWidth={380} offset={[0, -8]}>
                <div className="bg-white">
                  <div className="bg-gradient-to-br from-[#1F1A16] to-[#2A2520] p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5" 
                      style={{ backgroundColor: typeColors[event.type], transform: 'translate(30%, -30%)' }} 
                    />
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ 
                          backgroundColor: typeColors[event.type] + '25', 
                          border: `2px solid ${typeColors[event.type]}` 
                        }}
                      >
                        <div 
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: typeColors[event.type] }}
                        />
                      </div>
                      <div>
                        <span 
                          className="text-[10px] font-bold uppercase tracking-wider block"
                          style={{ color: typeColors[event.type] }}
                        >
                          {t(`events.typeLabels.${event.type}`, event.type) as string}
                        </span>
                        <p className="text-[#C4953A] text-xs font-medium">
                          {format(event.date, 'd MMMM yyyy', { locale: dateLocales[i18n.language] || ru })}
                        </p>
                      </div>
                    </div>
                    <h4 className="font-bold text-white text-lg leading-tight relative z-10">{event.title}</h4>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-sm text-[#6B5D4F] leading-relaxed mb-5">{event.description}</p>
                    <Link 
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#9B1B1B] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#B52B2B] active:bg-[#7A1515] transition-all shadow-lg hover:shadow-xl w-full group"
                    >
                      <span>{t('events.details')}</span>
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14"/>
                        <path d="M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {showMonuments && (
          <MarkerClusterGroup
            chunkedLoading
            spiderfyDistanceMultiplier={2}
            showCoverageOnHover={false}
          >
          {monuments.map((monument) => (
          <Marker 
            key={monument.id} 
            position={monument.coordinates}
            icon={getMonumentIcon(selectedMonument?.id === monument.id)}
            eventHandlers={{ 
              click: () => onMonumentClick?.(monument),
              mouseover: (e) => e.target.openTooltip(),
              mouseout: (e) => e.target.closeTooltip(),
            }}
          >
            <Tooltip 
              direction="top" 
              offset={[0, -16]} 
              opacity={1} 
              className="custom-tooltip"
            >
              <div className="text-center">
                <p className="font-bold text-sm text-white mb-0.5">{monument.name}</p>
                <p className="text-[10px] text-[#C4B4A0]">{monument.location}</p>
              </div>
            </Tooltip>
            
            <Popup minWidth={300} maxWidth={340} offset={[0, -6]}>
              <div className="bg-white">
                {monument.images && monument.images.length > 0 ? (
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={monument.images[0]} 
                      alt={monument.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="inline-block bg-[#D4AF37] text-[#1F1A16] text-[10px] font-bold px-2.5 py-1 rounded-md mb-1.5 shadow-sm">
                        {monument.region}
                      </span>
                      <h4 className="font-bold text-white text-lg leading-tight drop-shadow-md">{monument.name}</h4>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#1F1A16] to-[#3A3228] p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <span className="inline-block bg-[#D4AF37] text-[#1F1A16] text-[10px] font-bold px-2.5 py-1 rounded-md mb-2 shadow-sm relative z-10">
                      {monument.region}
                    </span>
                    <h4 className="font-bold text-white text-lg leading-tight relative z-10">{monument.name}</h4>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[#8A8178] text-xs mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {monument.location}
                  </div>
                  
                  <p className="text-sm text-[#6B5D4F] leading-relaxed mb-4 line-clamp-3">
                    {monument.description}
                  </p>
                  
                  <Link 
                    to={`/monuments/${monument.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#9B1B1B] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#B52B2B] active:bg-[#7A1515] transition-all shadow-lg hover:shadow-xl w-full group"
                    style={{ color: '#FFFFFF' }}
                  >
                    <span className="text-white">{t('monuments.details', 'Подробнее')}</span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#FFFFFF" 
                      stroke-width="2.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14"/>
                      <path d="M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>
        )}
        {children}
      </MapContainer>

      {showTypeFilters && (
        <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-[#E8DFD4] max-w-[200px] shadow-lg">
          <h4 className="text-[#C4953A] font-semibold mb-2 text-xs">{t('events.filtersByType')}</h4>
          <button
            onClick={() => setShowArrows(prev => !prev)}
            className={`flex items-center gap-2 w-full px-2 py-1 rounded text-[11px] transition-all mb-1 ${
              showArrows
                ? 'bg-[#9B1B1B]/10 text-[#1F1A16]'
                : 'text-[#8A8178] hover:text-[#1F1A16]'
            }`}
          >
            <svg viewBox="0 0 14 14" className="w-3 h-3 shrink-0">
              <path d="M2 7 L9 7 M7 5 L10 7 L7 9" stroke={showArrows ? '#B52B2B' : '#C4B4A0'} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="flex-1 text-left">{i18n.language === 'ru' ? 'Наступления' : i18n.language === 'be' ? 'Наступленні' : 'Offensives'}</span>
            <span className="text-[#8A8178] text-[10px]">{visibleArrows.length}</span>
          </button>
          <button
            onClick={() => setShowZones(prev => !prev)}
            className={`flex items-center gap-2 w-full px-2 py-1 rounded text-[11px] transition-all mb-1.5 ${
              showZones
                ? 'bg-[#9B1B1B]/10 text-[#1F1A16]'
                : 'text-[#8A8178] hover:text-[#1F1A16]'
            }`}
          >
            <svg viewBox="0 0 14 14" className="w-3 h-3 shrink-0">
              <circle cx="7" cy="7" r="4" fill="none" stroke={showZones ? '#9B1B1B' : '#C4B4A0'} strokeWidth="1.5" strokeDasharray="2,1.5" />
            </svg>
            <span className="flex-1 text-left">{i18n.language === 'ru' ? 'Котлы' : i18n.language === 'be' ? 'Катлы' : 'Pockets'}</span>
            <span className="text-[#8A8178] text-[10px]">{visibleZones.length}</span>
          </button>
          <div className="space-y-1.5">
            {Object.entries(typeColors).map(([type]) => [type, t(`events.typeLabels.${type}`, type) as string]).map(([type, label]) => (
              typeCounts[type] > 0 && (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`flex items-center gap-2 w-full px-2 py-1 rounded text-[11px] transition-all ${
                    activeTypes.has(type)
                      ? 'bg-[#3D6B4A]/10 text-[#1F1A16]'
                      : 'text-[#8A8178] hover:text-[#1F1A16]'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{
                    backgroundColor: activeTypes.has(type) ? typeColors[type] : '#C4B4A0',
                    opacity: activeTypes.has(type) ? 1 : 0.3
                  }} />
                  <span className="flex-1 text-left">{label}</span>
                  <span className="text-[#8A8178] text-[10px]">{typeCounts[type] || 0}</span>
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-[#E8DFD4] max-h-[280px] overflow-y-auto shadow-lg">
          <h4 className="text-[#C4953A] font-semibold mb-2.5 text-xs uppercase tracking-wider">{t('events.legend')}</h4>
          <div className="space-y-2 text-[11px]">
            {showArrows && visibleArrows.length > 0 && (
              <div className="flex items-center gap-2.5 pb-1.5 border-b border-[#E8DFD4]">
                <div className="w-5 flex justify-center">
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5">
                    <path d="M2 7 L9 7 M7 5 L10 7 L7 9" stroke="#B52B2B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[#6B5D4F]">
                  {i18n.language === 'ru' ? 'Наступления' : i18n.language === 'be' ? 'Наступленні' : 'Offensives'}
                </span>
                <span className="text-[#8A8178] text-[10px]">{visibleArrows.length}</span>
              </div>
            )}
            {showZones && visibleZones.length > 0 && (
              <div className="flex items-center gap-2.5 pb-1.5 border-b border-[#E8DFD4]">
                <div className="w-5 flex justify-center">
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5">
                    <circle cx="7" cy="7" r="4.5" fill="none" stroke="#9B1B1B" strokeWidth="2" strokeDasharray="3,2" />
                  </svg>
                </div>
                <span className="text-[#6B5D4F]">
                  {i18n.language === 'ru' ? 'Окружения' : i18n.language === 'be' ? 'Атачаенні' : 'Encirclements'}
                </span>
                <span className="text-[#8A8178] text-[10px]">{visibleZones.length}</span>
              </div>
            )}
            {showFrontLine && frontLineData.line && frontLineData.line.length > 0 && (
              <div className="flex items-center gap-2.5 pb-1.5 border-b border-[#E8DFD4]">
                <div className="w-5 flex justify-center">
                  <div className="w-4 h-0 border-t-[2px] border-dashed border-[#9B1B1B]" />
                </div>
                <span className="text-[#6B5D4F]">{t('events.frontLine')}</span>
              </div>
            )}
            {Object.entries(typeColors).map(([type, color]) => {
              const label = t(`events.typeLabels.${type}`, type);
              if (!label || typeCounts[type] === 0) return null;
              return (
                <div key={type} className="flex items-center gap-2.5">
                  <div className="w-5 flex justify-center">
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[#6B5D4F] flex-1">{label}</span>
                  <span className="text-[#8A8178] text-[10px] tabular-nums">{typeCounts[type] || 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}