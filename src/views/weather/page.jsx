import { Box, Container } from '@mui/material';
import { useState } from 'react';
import { Button, Typography, ButtonGroup} from '@mui/material';


export default function Weather() {
    const [location, setLocation] = useState(null);
    const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState(null);
    const [unit, setUnit] = useState('metric');

    const getLocation = async () => {
        console.log("Getting location...");
        if (navigator.geolocation) {
            console.log("Geolocation is supported by this browser.");
            navigator.geolocation.getCurrentPosition(async (position) => {
                console.log("Got position:", position);
                const { latitude, longitude } = position.coords;
                console.log("Got location:", latitude, longitude);
                setLocation({ latitude, longitude });
                await fetchWeatherData(latitude, longitude);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const fetchWeatherData = async (latitude, longitude) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/weather?lat=${latitude}&lon=${longitude}&unit=${unit}`);
            const { data } = await response.json();
            console.log("Weather data:", data);
            setCurrentLocationWeatherData(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };


    const handleUnits = async (unit) => {
        setUnit(unit);
        if (location) {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/weather?lat=${location.latitude}&lon=${location.longitude}&unit=${unit}`);
            const { data } = await response.json();
            console.log("Weather data:", data);
            setCurrentLocationWeatherData(data);
        }  
    }

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
            <Box sx={{ bgcolor: 'dark', padding: 2, textAlign: 'center' }}>
                <Typography variant="h6">Weather Information</Typography>
                <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <Button onClick={() => handleUnits('metric')} variant={unit === 'metric' ? 'contained' : 'outlined'}>°C</Button>
                    <Button onClick={() => handleUnits('imperial')} variant={unit === 'imperial' ? 'contained' : 'outlined'}>°F</Button>
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
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body1">Temperature: {currentLocationWeatherData.current.temp}{unit === 'metric' ? '°C' : '°F'}</Typography>
                        <Typography variant="body1">Humidity: {currentLocationWeatherData.current.humidity}</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};
