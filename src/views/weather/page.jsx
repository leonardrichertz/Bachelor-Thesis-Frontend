import { Autocomplete, Box, Container, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button, Typography, ButtonGroup } from '@mui/material';
import ForecastDataGrid from '../../components/ForecastDataGrid';
import WeatherStyle from '../../components/WeatherStyle';


export default function Weather() {
    const [location, setLocation] = useState(null);
    const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState(null);
    const [unit, setUnit] = useState('metric');

    const getLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const fetchWeatherData = async (latitude, longitude, unit) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/weather?lat=${latitude}&lon=${longitude}&unit=${unit}`);
            const { data } = await response.json();
            console.log("Weather data:", data);
            console.log('Forecasdt', data.daily);
            setCurrentLocationWeatherData(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
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
                height: '100vh',
                width: '100vw',
            }}
        >
            <Box sx={{ bgcolor: 'white', padding: 2, textAlign: 'center' }}>
                <Typography variant="h6">Weather Information</Typography>
                <Box sx={{ margin: 2, width: '80%', padding: '2px' }}>
                    <Autocomplete
                        options={['New York', 'London', 'Berlin', 'Paris', 'Tokyo', 'Moscow', 'Beijing', 'Sydney']}
                        renderInput={(params) => <TextField {...params} label="Type in a Location" variant="outlined" />}
                    />
                </Box>
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
                {currentLocationWeatherData && (
                    <Box>
                        <Typography variant="h6">Today's Weather</Typography>
                        <Box sx={{ marginTop: 2 }}>
                            <WeatherStyle weather={currentLocationWeatherData.current.weather[0]} />
                            <Typography variant="body1">{Math.round(currentLocationWeatherData.current.temp)}{unit === 'metric' ? '°C' : '°F'}</Typography>
                            <Typography variant="body1">Humidity: {currentLocationWeatherData.current.humidity}%</Typography>
                            <Typography variant="body1">Pressure: {currentLocationWeatherData.current.pressure}hPa</Typography>
                        </Box>
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="h6">Forecast</Typography>
                            <ForecastDataGrid weatherData={currentLocationWeatherData.daily} unit={unit} />
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    );
};
