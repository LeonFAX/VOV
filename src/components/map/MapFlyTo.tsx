import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapFlyToProps {
  center?: [number, number];
  zoom?: number;
  duration?: number; // seconds
}

export function MapFlyTo({ center, zoom, duration = 1.5 }: MapFlyToProps) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom ?? map.getZoom(), {
        duration,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map, duration]);

  return null;
}
