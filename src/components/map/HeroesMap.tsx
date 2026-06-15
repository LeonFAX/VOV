import { useState, useMemo, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Star, Award, Loader2, X } from 'lucide-react';
import type { Hero } from '@/types';
import { getHeroCoordsSync, findMissingPlaces, setCoordsDB } from '@/lib/geocoding';

const RU_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

function createHeroIcon(isSelected: boolean, isHeroUSSR: boolean): DivIcon {
  const color = isHeroUSSR ? '#9B1B1B' : '#C4953A';
  const size = isSelected ? 36 : 28;
  const borderWidth = isSelected ? 3 : 2;
  
  return new DivIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color};border:${borderWidth}px solid ${isSelected ? '#1F1A16' : '#FAF6F0'};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 ${isSelected ? '4px 12px' : '2px 6px'} rgba(0,0,0,0.3);
        cursor:pointer;
        ${isSelected ? 'transform:scale(1.1);' : ''}
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, size / 2 + 8],
  });
}

// Кастомная иконка для кластера
function createClusterIcon(cluster: any): DivIcon {
  const count = cluster.getChildCount();
  let size = 40;
  let color = '#C4953A';
  let borderColor = '#FAF6F0';
  
  if (count >= 50) {
    size = 56;
    color = '#9B1B1B';
    borderColor = '#1F1A16';
  } else if (count >= 20) {
    size = 48;
    color = '#B52B2B';
    borderColor = '#1F1A16';
  } else if (count >= 10) {
    size = 44;
    color = '#C4953A';
    borderColor = '#1F1A16';
  }

  return new DivIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color};border:3px solid ${borderColor};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 3px 10px rgba(0,0,0,0.3);
        color:white;font-family:serif;font-weight:bold;font-size:${size > 44 ? '16px' : '14px'};
        cursor:pointer;
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, size / 2 + 8],
  });
}

interface MapControllerProps {
  center?: [number, number];
  zoom?: number;
  selectedHeroId?: string | null;
}

function MapController({ center, zoom, selectedHeroId }: MapControllerProps) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (selectedHeroId) {
      const timer = setTimeout(() => {
        map.invalidateSize();
        map.panInside(map.getCenter(), {
          paddingTopLeft: [50, 380],
          paddingBottomRight: [50, 50],
          animate: true,
          duration: 0.5
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedHeroId, map]);
  
  return null;
}

interface HeroesMapProps {
  heroes: Hero[];
  selectedHeroId?: string | null;
  onMarkerClick?: (heroId: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export function HeroesMap({
  heroes,
  selectedHeroId,
  onMarkerClick,
  center = [55.7558, 37.6173],
  zoom = 4,
  height = '600px',
  className = '',
}: HeroesMapProps) {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    async function init() {
      try {
        const response = await fetch('/data/hero-coords.json');
        if (response.ok && !cancelled) {
          const coords = await response.json();
          setCoordsDB(coords);
        }
      } catch (e) {
        console.warn('Failed to load hero coords:', e);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }
    
    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (isReady) {
      const missing = findMissingPlaces(heroes as any[]);
      if (missing.length > 0) {
        console.log('⚠️ Missing coordinates for places:', missing);
        console.log('💡 Add them to public/data/hero-coords.json');
      }
    }
  }, [heroes, isReady]);

  const heroesWithCoords = useMemo(() => {
    if (!isReady) return [];
    return (heroes as any[]).map(h => ({
      ...h,
      _coords: getHeroCoordsSync(h.birthPlace),
    })).filter(h => h._coords !== null);
  }, [heroes, isReady]);

  const selectedHero = useMemo(() => 
    (heroes as any[]).find(h => h.id === selectedHeroId || h.slug === selectedHeroId),
  [heroes, selectedHeroId]);

  const mapCenter = useMemo(() => {
    if (selectedHero) {
      const coords = getHeroCoordsSync(selectedHero.birthPlace);
      if (coords) return coords;
    }
    return center;
  }, [selectedHero, center]);

  const handleMarkerClick = useCallback((heroId: string) => {
    onMarkerClick?.(heroId);
  }, [onMarkerClick]);

  if (!isReady) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#F5F0E8] rounded-lg border border-[#E8DFD4] ${className}`} style={{ height }}>
        <Loader2 className="w-10 h-10 text-[#C4953A] animate-spin mb-3" />
        <p className="text-[#8A8178] text-sm">{t('heroes.loadingMap') || 'Загрузка карты...'}</p>
      </div>
    );
  }

  if (heroesWithCoords.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#F5F0E8] rounded-lg border border-[#E8DFD4] ${className}`} style={{ height }}>
        <MapPin className="w-12 h-12 text-[#E8DFD4] mb-3" />
        <p className="text-[#8A8178] text-sm mb-1">{t('heroes.noMapData') || 'Нет данных для отображения на карте'}</p>
        <p className="text-[#8A8178] text-xs opacity-60">Проверьте консоль (F12) для списка нераспознанных мест</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden border border-[#E8DFD4] ${className}`} style={{ height }}>
      <style>{`
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-container .leaflet-bottom.leaflet-right { display: none !important; }
        .hero-popup .leaflet-popup-content-wrapper {
          background: #FAF6F0;
          border-radius: 12px;
          border: 1px solid #E8DFD4;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 0;
        }
        .hero-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
          width: 280px !important;
        }
        .hero-popup .leaflet-popup-tip {
          background: #FAF6F0;
          border: 1px solid #E8DFD4;
        }
        .hero-popup .leaflet-popup-close-button {
          display: none !important;
        }
        .leaflet-tooltip {
          background: #1F1A16;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          padding: 4px 8px;
          font-family: serif;
        }
        .leaflet-tooltip-top:before {
          border-top-color: #1F1A16;
        }
        .hero-popup a {
          color: #FFFFFF !important;
          text-decoration: none !important;
        }
        .hero-popup a:hover {
          color: #FFFFFF !important;
          text-decoration: none !important;
        }
        /* Стили для кластеров */
        .leaflet-marker-icon.marker-cluster {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-marker-icon.marker-cluster div {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>

      <MapContainer
        center={mapCenter}
        zoom={selectedHeroId ? 8 : zoom}
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
        
        <MapController 
          center={mapCenter} 
          zoom={selectedHeroId ? 8 : zoom} 
          selectedHeroId={selectedHeroId}
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          maxClusterRadius={60}
          disableClusteringAtZoom={12}
          animate={true}
          animateAddingMarkers={true}
        >
          {heroesWithCoords.map((hero: any) => {
            const isSelected = selectedHeroId === (hero.id || hero.slug);
            const isHeroUSSR = (hero.awards || []).some((a: any) => {
              const name = typeof a === 'string' ? a : (a.name || '');
              return name.includes('Герой Советского Союза') || name.includes('Hero of the Soviet Union');
            });
            
            return (
              <Marker
                key={hero.id || hero.slug}
                position={hero._coords}
                icon={createHeroIcon(isSelected, isHeroUSSR)}
                eventHandlers={{
                  click: () => handleMarkerClick(hero.id || hero.slug),
                }}
              >
                <Tooltip 
                  direction="top" 
                  offset={[0, -16]} 
                  opacity={1}
                  className="custom-tooltip"
                >
                  <div className="text-center">
                    <div className="font-serif font-bold">{hero.lastName || ''}</div>
                    <div className="text-[10px] opacity-80">{hero.firstName || ''} {hero.middleName || ''}</div>
                    <div className="text-[9px] text-[#C4953A] mt-0.5">{hero.militaryRank || ''}</div>
                  </div>
                </Tooltip>

                <Popup 
                  minWidth={280} 
                  maxWidth={280}
                  className="hero-popup"
                  closeButton={false}
                  autoPan={true}
                  autoPanPadding={[50, 50]}
                  autoPanPaddingTopLeft={[50, 380]}
                  autoPanPaddingBottomRight={[50, 50]}
                >
                  <div className="bg-[#FAF6F0] rounded-xl overflow-hidden relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkerClick?.(hero.id || hero.slug);
                      }}
                      className="absolute top-2 right-2 z-10 w-6 h-6 bg-[#1F1A16]/60 hover:bg-[#9B1B1B] rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="relative h-40 bg-[#E8DFD4] overflow-hidden">
                      {hero.images?.[0] ? (
                        <img 
                          src={hero.images[0]} 
                          alt={`${hero.lastName || ''} ${hero.firstName || ''}`}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: '50% 10%' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F5F0E8]">
                          <Star className="w-12 h-12 text-[#E8DFD4]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A16]/80 via-[#1F1A16]/30 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-8">
                        <h3 className="font-serif font-bold text-white text-sm leading-tight">
                          {hero.lastName || ''}<br />
                          {hero.firstName || ''} {hero.middleName || ''}
                        </h3>
                      </div>
                      {isHeroUSSR && (
                        <div className="absolute top-2 left-2 bg-[#9B1B1B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          ГСС
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-[#C4953A] text-sm font-medium">
                        <Star className="w-4 h-4 fill-[#C4953A]" />
                        {hero.militaryRank || '—'}
                      </div>

                      <div className="flex items-start gap-2 text-[#6B5D4F] text-sm">
                        <MapPin className="w-4 h-4 text-[#9B1B1B] mt-0.5 shrink-0" />
                        <span>{hero.birthPlace || '—'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#8A8178] text-sm">
                        <span className="w-4 h-4 flex items-center justify-center">📅</span>
                        <span>
                          {hero.birthDate ? new Date(hero.birthDate).getFullYear() : '—'} — {hero.deathDate ? new Date(hero.deathDate).getFullYear() : 'н.в.'}
                        </span>
                      </div>

                      {hero.awards && hero.awards.length > 0 && (
                        <div className="pt-1.5 border-t border-[#E8DFD4]">
                          <p className="text-[10px] text-[#8A8178] uppercase tracking-wider mb-1 font-medium">
                            {t('heroes.awards') || 'Награды'}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {hero.awards.slice(0, 3).map((award: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-white text-[#6B5D4F] text-[11px] rounded border border-[#E8DFD4]"
                              >
                                {typeof award === 'string' ? award : award.name}
                              </span>
                            ))}
                            {hero.awards.length > 3 && (
                              <span className="px-1.5 py-0.5 text-[#8A8178] text-[11px]">
                                +{hero.awards.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/heroes/${hero.slug || hero.id}`}
                        className="block w-full text-center bg-[#9B1B1B] text-white text-sm font-medium py-2 rounded-lg hover:bg-[#B52B2B] transition-colors mt-1"
                      >
                        {t('heroes.readMore') || 'Подробнее'}
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}