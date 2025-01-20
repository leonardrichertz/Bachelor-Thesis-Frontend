import { Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function WeatherWarning({ warnings }) {
    return (
        <Box sx={{
            display:
                'flex', marginTop: '10px', padding: '10px', border: '5px solid #f0f0f0', borderRadius: '10px',
        }}>
            {warnings?.map((alert, index) => {
                const startDate = new Date(alert.start * 1000).toLocaleString();
                const endDate = new Date(alert.end * 1000).toLocaleString();
                return (
                    <Box key={index}>
                        <WarningAmberIcon />
                        <div>{alert.sender_name}</div>
                        <div>{alert.description} from {startDate} - {endDate}</div>
                    </Box>)
            })}
        </Box>
    );
}