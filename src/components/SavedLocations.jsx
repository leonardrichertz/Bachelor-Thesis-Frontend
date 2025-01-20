import React, { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, IconButton, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import axios from 'axios';


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export default function SavedLocations({ locations, fetchLocations, setLocation, selectedLocation }) {
    const [loading, setLoading] = useState(false);

    const deleteLocation = async (id) => {
        setLoading(true);
        try {
            const xsrfToken = getCookie('XSRF-TOKEN');
            const response  = await axios.delete(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations?id=${id}`,
                {
                    headers: {
                      'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),  // Send the decoded CSRF token here
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    },
                    withCredentials: true,  // Ensure cookies are sent with the request
                });
            
            if (response.status === 200) {
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
                {locations?.map((location) => (
                    <Paper elevation={3} sx={{ p: 2, m: 2 }} key={location.id}>
                        <ListItem key={location.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="body1">
                                Latitude: {location.latitude}, Longitude: {location.longitude}
                            </Typography>
                            <Box sx={{ display: "flex", gap: '5px' }} >
                                <IconButton edge="end" onClick={() => deleteLocation(location.id)} >
                                    <DeleteIcon />
                                </IconButton>
                                <Radio
                                    checked={selectedLocation?.id === location.id}
                                    onChange={() => setLocation(location)}
                                    value={location.id}
                                    name="location-radio"
                                    inputProps={{ 'aria-label': location.id }}
                                />
                            </Box>
                        </Box>
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
}