import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button, Typography, ButtonGroup } from '@mui/material';
import WeatherStyle from '../../../components/WeatherStyle';
import LinearProgress from '@mui/material/LinearProgress';
import LineGraph from '../../../components/LineGraph';
import WeatherWarning from '../../../components/WeatherWarning';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SavedLocations from '../../../components/SavedLocations';


export default function Weather() {
    const access_token = localStorage.getItem('access_token');
    const [location, setLocation] = useState(null);
    const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState(null);
    const [unit, setUnit] = useState('metric');
    const [loading, setLoading] = useState(false);
    const [forecastData, setForecastData] = useState(currentLocationWeatherData?.daily || []);
    const [warning, setWarning] = useState(currentLocationWeatherData?.alerts || []);
    const [locations, setLocations] = useState([]);

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
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/weather?lat=${latitude}&lon=${longitude}&unit=${unit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
            const { data } = await response.json();
            setCurrentLocationWeatherData(data);
            setForecastData(data?.daily);
            setWarning(data?.alerts);
        } catch (error) {
            toast.error("Error fetching weather data");
        } finally {
            setLoading(false);
        }
    };

    const saveLocation = async (latitude, longitude) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({ latitude, longitude }),
            });
            if (response.ok) {
                toast.success("Location saved successfully");
                fetchLocations(); // Fetch locations after saving
            }
            else {
                toast.error("Error saving location:");
            }
        }
        catch (error) {
            toast.error("Error saving location:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            toast.error("Error fetching locations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location) {
            fetchWeatherData(location.latitude, location.longitude, unit);
        }
    }, [location, unit]);

    useEffect(() => {
        fetchLocations();
    }, []);

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
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={() => setUnit('metric')} variant={unit === 'metric' ? 'contained' : 'outlined'}>°C</Button>
                <Button onClick={() => setUnit('imperial')} variant={unit === 'imperial' ? 'contained' : 'outlined'}>°F</Button>
            </ButtonGroup>
            <Box sx={{ display: 'flex', gap: '5px' }}>
                <Button variant="contained" onClick={getLocation} sx={{ margin: 2 }}>
                    Get Current Location
                </Button>
                {location && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body1">
                            Location: Latitude {location.latitude}, Longitude {location.longitude}
                        </Typography>
                        <Button variant="contained" onClick={() => saveLocation(location.latitude, location.longitude)} sx={{ margin: 2 }}> Save current Location for later use</Button>
                    </Box>
                )}
            </Box>
            {currentLocationWeatherData && !loading && (
                <Box sx={{ width: '80%', height: '80%' }}>
                    <Box sx={{ marginTop: 2, width: '100%', minWidth: '100%' }}>
                        <Typography variant="h6">Today's Weather</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                            <WeatherStyle weather={currentLocationWeatherData.current.weather[0]} />
                            <Typography variant="body1">{Math.round(currentLocationWeatherData.current.temp)}{unit === 'metric' ? '°C' : '°F'}</Typography>
                        </Box>
                        <Typography variant="body1">Humidity: {currentLocationWeatherData.current.humidity}%</Typography>
                        <Typography variant="body1">Atmospheric Pressure: {currentLocationWeatherData.current.pressure}hPa</Typography>
                        {(warning && warning.length > 0) && (
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
            <SavedLocations locations={locations} fetchLocations={fetchLocations} setLocation={setLocation} selectedLocation={location} />
            <ToastContainer />
        </Container >
    );
};