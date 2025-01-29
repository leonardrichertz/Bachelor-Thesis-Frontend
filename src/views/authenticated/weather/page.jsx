import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button, Typography, ButtonGroup, IconButton } from '@mui/material';
import WeatherStyle from '../../../components/WeatherStyle';
import LinearProgress from '@mui/material/LinearProgress';
import LineGraph from '../../../components/LineGraph';
import WeatherWarning from '../../../components/WeatherWarning';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SavedLocations from '../../../components/SavedLocations';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACHELOR_THESIS_BACKEND, // Your backend URL
    withCredentials: true, // Include credentials (cookies) in requests
});

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export default function Weather() {
    const [location, setLocation] = useState(null);
    const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState(null);
    const [unit, setUnit] = useState('metric');
    const [loading, setLoading] = useState(false);
    const [forecastData, setForecastData] = useState(currentLocationWeatherData?.daily || []);
    const [warning, setWarning] = useState(currentLocationWeatherData?.alerts || []);
    const [locations, setLocations] = useState([]);

    const labels = forecastData?.map((_, index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + index);
        return currentDate.toLocaleDateString();
    });

    const temperatureData = {
        labels: labels,
        datasets: [
            {
                label: "Temperature",
                data: forecastData?.map((data) => data.temp.day),
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
                data: forecastData?.map((data) => data.humidity),
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
            const response = await axiosInstance.get('/api/weather', {
                params: { lat: latitude, lon: longitude, unit },
            });
            const { data } = response.data;
            setCurrentLocationWeatherData(data);
            setForecastData(data?.daily);
            setWarning(data?.alerts);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Session expired. Redirecting to login...");
                window.location.href = '/'; // Redirect to login page
            } else {
                toast.error("Error fetching weather data");
            }

            toast.error("Error fetching weather data");
        } finally {
            setLoading(false);
        }
    };

    const saveLocation = async (latitude, longitude) => {
        setLoading(true);
        try {
            const xsrfToken = getCookie('XSRF-TOKEN');
            const response = await axiosInstance.post('/api/locations', { latitude, longitude },
                {
                    headers: {
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),  // Send the decoded CSRF token here
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: true,  // Ensure cookies are sent with the request
                }
            );
            if (response.status === 200) {
                toast.success("Location saved successfully");
                fetchLocations();
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
            const response = await axiosInstance.get('/api/locations');
            setLocations(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Session expired. Redirecting to login...");
                window.location.href = '/'; // Redirect to login page
            }
            else {
                toast.error("Error fetching locations");
            }
        } finally {
            setLoading(false);
        }
    };

    // If logout is successful, redirect to the login page
    const logout = async () => {
        try {
        const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await axiosInstance.post('/api/logout', {},
                {
                    headers: {
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken), 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: true,  // Ensure cookies are sent with the request
                }
            );
            if (response.status === 204) {
                window.location.href = '/';
            }
            else {
                toast.error("Error logging out");
            }
        }
        catch (error) {
            toast.error("Error logging out");
        }

    }

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
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <Button onClick={() => setUnit('metric')} variant={unit === 'metric' ? 'contained' : 'outlined'}>°C</Button>
                    <Button onClick={() => setUnit('imperial')} variant={unit === 'imperial' ? 'contained' : 'outlined'}>°F</Button>
                </ButtonGroup>
                <IconButton variant="contained" onClick={() => logout()}>
                    <LogoutIcon />
                </IconButton>
            </Box>
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
            {
                currentLocationWeatherData && !loading && (
                    <Box sx={{ width: '80%', height: '80%' }}>
                        <Box sx={{ marginTop: 2, width: '100%', minWidth: '100%' }}>
                            <Typography variant="h6">Today's Weather</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                <WeatherStyle weather={currentLocationWeatherData?.current?.weather[0]} />
                                <Typography variant="body1">{Math.round(currentLocationWeatherData?.current?.temp)}{unit === 'metric' ? '°C' : '°F'}</Typography>
                            </Box>
                            <Typography variant="body1">Humidity: {currentLocationWeatherData?.current?.humidity}%</Typography>
                            <Typography variant="body1">Atmospheric Pressure: {currentLocationWeatherData?.current?.pressure}hPa</Typography>
                            {(warning && warning.length > 0) && (
                                <WeatherWarning warnings={warning} />
                            )}
                        </Box>
                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: '5px' }}>
                            <LineGraph data={temperatureData} options={temperatureOptions} />
                            <LineGraph data={humidityData} options={humidityOptions} />
                        </Box>
                    </Box>
                )
            }
            {
                loading && (
                    <Box sx={{ width: '80%', height: '80%' }}>
                        <LinearProgress />
                    </Box>)
            }
            <SavedLocations locations={locations} fetchLocations={fetchLocations} setLocation={setLocation} selectedLocation={location} />
            <ToastContainer />
        </Container >
    );
};