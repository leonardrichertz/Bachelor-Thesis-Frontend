import React, { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';


export default function SavedLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);

    const deleteLocation = (id) => {
        setLoading(true);
        try {
            const response = fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations/${id}`, {
                method: 'DELETE',
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
            const response = await fetch(`${import.meta.env.VITE_BACHELOR_THESIS_BACKEND}/api/locations`);
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
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