import React, { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';


export default function SavedLocations() {
    const access_token = localStorage.getItem('access_token');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);

    const deleteLocation = (id) => {
        setLoading(true);
        try {
            const response = fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            if (response.ok) {
                toast.success("Location deleted successfully");
                fetchLocations();
            }
            else {
                toast.error("Error deleting location:");
            }
        } catch (error) {
            toast.error("Error deleting location:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            toast.error("Error getting saved Locations");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <Box>
            {loading && <LinearProgress />}
            <List>
                {locations.map(location => (
                    <ListItem key={location.id}>
                        <Typography>{location.latitude}, {location.longitude}</Typography>
                        <Button onClick={() => deleteLocation(location.id)}>Delete</Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
};