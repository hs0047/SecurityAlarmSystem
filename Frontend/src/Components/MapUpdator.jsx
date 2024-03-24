import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center);
    }, [center, map]);

    return null;
};
