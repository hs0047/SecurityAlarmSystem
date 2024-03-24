import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

const Dashboard = () => {
    const { towerId } = useParams();
    const [sensorData, setSensorData] = useState({
        temperature: [],
        fuel: [],
        timestamps: [],
    });

    useEffect(() => {
        // Fetch the sensor data for the given towerId. This is a placeholder.
        // You'll need to replace this with an actual fetch request to your backend.
        const fetchData = async () => {
            // const response = await fetch(`your_backend_endpoint/${towerId}`);
            // const data = await response.json();
            const data = { temperature: [20, 22, 23, 24, 26], fuel: [50, 48, 47, 45, 43], timestamps: ['10:00', '11:00', '12:00', '13:00', '14:00'] }; // Example data
            setSensorData(data);
        };

        fetchData();
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
            <h2>Dashboard for Tower: {towerId}</h2>
            <Line data={data} options={options} />
            {/* Additional components to display the latest 5 sensor readings and report download functionality */}
        </div>
    );
};

export default Dashboard;
