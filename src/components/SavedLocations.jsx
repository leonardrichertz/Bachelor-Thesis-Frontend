import React,  { useState }from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, Button, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { toast } from 'react-toastify';

export default function SavedLocations({ locations, fetchLocations }) {
    const access_token = localStorage.getItem('access_token');
    const [loading, setLoading] = useState(false);

    const deleteLocation = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            if (response.ok) {
                toast.success("Location deleted successfully");
                fetchLocations(); // Fetch locations after deleting
            } else {
                toast.error("Error deleting location");
            }
        } catch (error) {
            toast.error("Error deleting location:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="h6">Saved Locations</Typography>
            {loading && <LinearProgress />}
            <List>
                {locations.map((location) => (
                    <ListItem key={location.id}>
                        <Typography variant="body1">
                            Latitude: {location.latitude}, Longitude: {location.longitude}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => deleteLocation(location.id)} sx={{ ml: 2 }}>
                            Delete
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}