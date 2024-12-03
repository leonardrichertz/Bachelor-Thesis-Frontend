/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


Chart.register(
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend
  );

export default function LineGraph({ data, options }) {
    return (
        <Box>
            <Line data={data} options={options} />
        </Box>);
};