import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getArchive } from '../components/PuzzleService';
import List from './List';

function Archive() {
    const [puzzles, setPuzzles] = useState([]);
    const [message, setMessage] = useState('Loading data');

    const getPuzzles = async () => {
        try {
            const response = await getArchive();
            setPuzzles(response.data);
            if (response.data.length === 0) {
                setMessage('There are currently no items in your Archive')
            }
        } catch (error) {
            setPuzzles([]);
            setMessage(error.message);
        }
    }

    useEffect(() => { getPuzzles(); }, []);

    if (puzzles.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                <Typography paragraph variant='h5'>{message}</Typography>
            </Box>
        )
    }

    return (
        <List puzzles={puzzles} refreshList={getPuzzles} listType={'archive'} />
    )
}

export default Archive;