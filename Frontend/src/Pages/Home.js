import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DataTable from '../Components/DataTable';
import io from 'socket.io-client';
import { Box, Card, CardContent, Switch, Typography } from '@mui/material';
import { ANOMALY_ICONS, MapUpdater } from '../Components/MapUpdator';
import { useNavigate } from 'react-router-dom';
import { ANOMALY_TYPE } from '../Components/const';

const socket = io("http://localhost:3002");

export const formatSensorData = (datalist) => {
    const updatedDat = datalist.map(item => ({ ...item, id: item._id, }));
    console.log(updatedDat);
    return updatedDat
}

const columns = [
    { field: 'towerId', headerName: 'Name', width: 120 },
    {
        field: 'location',
        headerName: 'Location',
        width: 150,
        valueGetter: (params) => {
            return `${params.lat}, ${params.long}`
        },
    },
    {
        field: 'temperature',
        headerName: 'Temp (°C)',
        type: 'number',
        width: 80,
    },
    {
        field: 'fuelStatus',
        headerName: 'Fuel (L)',
        type: 'number',
        width: 80,
    },
    {
        field: 'powerSource',
        headerName: 'Power Source',
        width: 100,
    },
    {
        field: 'isAnomaly',
        headerName: 'Anomaly',
        width: 100,
        valueGetter: (value) => `${value ? "Yes" : "No"}`,
    },
    {
        field: 'unchangedUptime',
        headerName: 'Uptime (sec)',
        width: 100,
    },
    {
        field: 'anomalyType',
        headerName: 'Anomaly Type',
        width: 100,
        valueGetter: (value) => `${value ? ANOMALY_TYPE[value] : "No Anomaly"}`,
    },

];

function Home() {
    const [sensorData, setSensorData] = useState([]);
    const [mapCenter, setMapCenter] = useState([26.907524, 75.739639]);
    const [isAutomaticMap, setIsAutomaticMap] = useState(true)
    const navigate = useNavigate(); // Initialize useNavigate

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
                                <Marker
                                    key={idx}
                                    position={[data.location.lat, data.location.long]}
                                    icon={ANOMALY_ICONS[data.anomalyType]}
                                    eventHandlers={{
                                        click: () => navigate(`/dashboard/${data.towerId}`),
                                    }}
                                >
                                    <Popup>
                                        {data.towerId}
                                    </Popup>
                                </Marker>
                            ))}

                            <MapUpdater
                                center={mapCenter} />
                        </MapContainer>
                    </Box>
                    <Box>
                        <Typography>
                            Automatically redirect to latest Anomaly
                            <Switch
                                checked={isAutomaticMap}
                                onChange={() => setIsAutomaticMap(!isAutomaticMap)}
                                inputProps={{ 'aria-label': 'automaticRedirect' }}
                            />
                        </Typography>

                        <DataTable sensorData={sensorData} columns={columns} />
                    </Box>
                </CardContent>
            </Card>
        </div >
    );
}

export default Home;
