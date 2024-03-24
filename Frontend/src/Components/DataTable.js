import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ANOMALY_TYPE } from './const';

export default function DataTable({ sensorData, columns }) {
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
