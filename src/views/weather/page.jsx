import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button, Typography, ButtonGroup } from '@mui/material';
import WeatherStyle from '../../components/WeatherStyle';
import LinearProgress from '@mui/material/LinearProgress';
import LineGraph from '../../components/LineGraph';
import WeatherWarning from '../../components/WeatherWarning';

export default function Weather() {
    const [location, setLocation] = useState(null);
    const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState(null);
    const [unit, setUnit] = useState('metric');
    const [loading, setLoading] = useState(false);
    const [forecastData, setForecastData] = useState(currentLocationWeatherData?.daily || []);
    const [warning, setWarning] = useState(currentLocationWeatherData?.alerts || []);  
    console.log(forecastData);
    console.log(warning);

    console.log(currentLocationWeatherData);

    const labels = forecastData.map((_, index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + index);
        return currentDate.toLocaleDateString();
    });

    const temperatureData = {
        labels: labels,
        datasets: [
            {
                label: "Temperature",
                data: forecastData.map((data) => data.temp.day),
                fill: false,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(75,192,192,1)",
                tension: 0.4,
            },
        ],
    };

    const humidityData = {
        labels: labels,
        datasets: [
            {
                label: "Humidity",
                data: forecastData.map((data) => data.humidity),
                fill: false,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(75,192,192,1)",
                tension: 0.4,
            }
        ]
    }

    const temperatureOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Temperature Forecast",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `${value} ${unit === 'metric' ? '°C' : '°F'}`,
                }
            },
        },
    };

    const humidityOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Humidity Forecast",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `${value}%`,
                }
            },
        },
    }

    const getLocation = async () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
        setLoading(false);
    };

    const fetchWeatherData = async (latitude, longitude, unit) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/weather?lat=${latitude}&lon=${longitude}&unit=${unit}`);
            const { data } = await response.json();
            setCurrentLocationWeatherData(data);
            setForecastData(data?.daily);
            setWarning(data?.alerts);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location) {
            fetchWeatherData(location.latitude, location.longitude, unit);
        }
    }, [location, unit]);

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                bgcolor: 'white',
                textAlign: 'center',
                padding: 2
            }}
        >
            <Typography variant="h6">Weather Information</Typography>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={() => setUnit('metric')} variant={unit === 'metric' ? 'contained' : 'outlined'}>°C</Button>
                <Button onClick={() => setUnit('imperial')} variant={unit === 'imperial' ? 'contained' : 'outlined'}>°F</Button>
            </ButtonGroup>
            <Button variant="contained" onClick={getLocation} sx={{ margin: 2 }}>
                Get Current Location
            </Button>
            {location && (
                <Typography variant="body1">
                    Location: Latitude {location.latitude}, Longitude {location.longitude}
                </Typography>
            )}
            {currentLocationWeatherData && !loading && (
                <Box sx={{ width: '80%', height: '80%' }}>
                    <Box sx={{ marginTop: 2, width: '100%', minWidth: '100%' }}>
                        <Typography variant="h6">Today's Weather</Typography>
                        <WeatherStyle weather={currentLocationWeatherData.current.weather[0]} />
                        <Typography variant="body1">{Math.round(currentLocationWeatherData.current.temp)}{unit === 'metric' ? '°C' : '°F'}</Typography>
                        <Typography variant="body1">Humidity: {currentLocationWeatherData.current.humidity}%</Typography>
                        <Typography variant="body1">Pressure: {currentLocationWeatherData.current.pressure}hPa</Typography>
                        {(warning && warning.length > 0) &&(
                            <WeatherWarning warnings={warning} />
                        )}
                    </Box>
                    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: '5px' }}>
                        <LineGraph data={temperatureData} options={temperatureOptions} />
                        <LineGraph data={humidityData} options={humidityOptions} />
                    </Box>
                </Box>
            )}
            {loading && (
                <Box sx={{ width: '80%', height: '80%' }}>
                    <LinearProgress />
                </Box>)}
        </Container >
    );
};
