/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import WeatherStyle from './WeatherStyle';

export default function ForecastDataGrid({ weatherData, unit }) {
    return (
    <Box>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={4}>
            {weatherData.map((data, index) => {
                return (
                    <Grid item size={1} xs={1} sm={1} md={1} key={index}>
                    <Box>
                        <WeatherStyle weather={data.weather[0]} />
                        <Box>{Math.round(data.temp.max)}{unit === 'metric' ? '°C' : '°F'}/{Math.round(data.temp.min)}{unit === 'metric' ? '°C' : '°F'}</Box>
                        <Box>Humidity: {data.humidity}%</Box>
                        <Box>Wind: {data.wind_speed} m/s</Box>
                    </Box>
                </Grid>
                )
            })};
        </Grid>
    </Box>
    );
}