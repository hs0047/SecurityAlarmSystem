import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ANOMALY_TYPE } from './const';

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

export default function DataTable({ sensorData }) {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={sensorData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    );
}
