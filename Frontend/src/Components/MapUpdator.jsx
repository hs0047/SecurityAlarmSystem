import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center);
    }, [center, map]);

    return null;
};

export const ANOMALY_ICONS = {
    1: L.icon({
        iconUrl: 'icons/temperature-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    }),
    2: L.icon({
        iconUrl: 'icons/fuel-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    }),
    3: L.icon({
        iconUrl: 'icons/electricity-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    }),
};