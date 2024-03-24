import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import DataTable from '../Components/DataTable';
import { ANOMALY_TYPE } from '../Components/const';
import { formatSensorData } from './Home';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const socket = io("http://localhost:3002");

const columns = [
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
        width: 150,
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
        width: 150,
    },
    {
        field: 'anomalyType',
        headerName: 'Anomaly Type',
        width: 150,
        valueGetter: (value) => `${value ? ANOMALY_TYPE[value] : "No Anomaly"}`,
    },

];

const Dashboard = () => {
    const { towerId } = useParams();
    const [sensorData, setSensorData] = useState({
        temperature: [],
        fuel: [],
        timestamps: [],
    });
    const [tableData, setTableData] = useState([])
    const navigate = useNavigate(); // Initialize useNavigate



    useEffect(() => {
        socket.emit('requestInitialData', { towerId });

        socket.on('sendInitialData', (initialData) => {
            console.log("Initial Data:", initialData)
            const temp = []
            const fuel = []
            const timestamp = []
            initialData?.map((data, index) => {
                temp.push(data.temperature)
                fuel.push(data.fuelStatus)
                timestamp.push(index + 1 * 5)
            })
            setSensorData({
                temperature: temp,
                fuel: fuel,
                timestamps: timestamp,
            });
            setTableData(formatSensorData(initialData))
        });

        socket.on(`sensorUpdate:${towerId}`, (update) => {
            console.log("Update Data ", update);
            setSensorData((prevData) => ({
                temperature: [...prevData.temperature, update.temperature],
                fuel: [...prevData.fuel, update.fuelStatus],
                timestamps: [...prevData.timestamps, (tableData.length + 1) * 5],
            }
            ));
            setTableData(prevData => (formatSensorData([update, ...prevData])))
        });

        return () => {
            socket.off('sendInitialData');
            socket.off('dataUpdate');
        };
    }, [towerId]);

    const data = {
        labels: sensorData.timestamps,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: sensorData.temperature,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Fuel (L)',
                data: sensorData.fuel,
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <Button variant="outlined" color="error" onClick={() => navigate(`/`)}>Back</Button>
            <Typography variant="h5" component="div" textAlign="center">
                Dashboard for Tower: {towerId}
            </Typography>
            <Card>
                <CardContent>
                    <Box>
                        <Line data={data} options={options} />
                    </Box>
                    <Box>
                        <DataTable sensorData={tableData} columns={columns} />
                    </Box>
                </CardContent>
            </Card>
        </div >
    );
};

export default Dashboard;
