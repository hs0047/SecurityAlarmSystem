import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DataTable from '../Components/DataTable';
import io from 'socket.io-client';
import { Box, Card, CardContent, Switch, Typography } from '@mui/material';
import { MapUpdater } from '../Components/MapUpdator';

const socket = io("http://localhost:3002");

const formatSensorData = (datalist) => {
    const updatedDat = datalist.map(item => ({ ...item, id: item._id, }));
    console.log(updatedDat)
    return updatedDat

}
function Home() {
    const [sensorData, setSensorData] = useState([]);
    const [mapCenter, setMapCenter] = useState([26.907524, 75.739639]);
    const [isAutomaticMap, setIsAutomaticMap] = useState(true)

    useEffect(() => {
        console.log(sensorData)
        socket.on('initialData', (initialData) => {
            setSensorData(formatSensorData(initialData));
        });

        socket.on('sensorUpdate', (update) => {
            if (isAutomaticMap && update.isAnomaly && update.location) {
                setMapCenter([update.location.lat, update.location.long]);
            }
            setSensorData(currentData => formatSensorData([update, ...currentData]));
        });

        return () => {
            socket.off('initialData');
            socket.off('sensorUpdate');
        };
    }, [isAutomaticMap]);


    return (
        <div>
            <Typography variant="h5" component="div" textAlign="center">
                Welcome to Securtiy alarm system
            </Typography>
            <Card>
                <CardContent>
                    <Box>
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {sensorData.map((data, idx) => (
                                data.isAnomaly && data.location &&
                                <Marker key={idx} position={[data.location.lat, data.location.long]}>
                                    <Popup>A sensor data point: {data.towerId}</Popup>
                                </Marker>
                            ))}

                            <MapUpdater
                                center={mapCenter} />
                        </MapContainer>
                    </Box>
                    <Box>
                        <Typography>
                            Show latest Anomaly
                            <Switch
                                checked={isAutomaticMap}
                                onChange={() => setIsAutomaticMap(!isAutomaticMap)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Typography>

                        <DataTable sensorData={sensorData} />
                    </Box>
                </CardContent>
            </Card>
        </div >
    );
}

export default Home;
