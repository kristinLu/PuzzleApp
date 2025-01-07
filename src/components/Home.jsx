import { useEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { getStatistics } from '../components/PuzzleService';

function Home() {
    const [statistics, setStatistics] = useState({
        ownership_status: {},
        owned_completion_status: {},
        owned_pieces: {},
        owned_brand: {}
    });
    const options = [
        { label: 'Collection', value: 'ownership_status' },
        { label: 'Status', value: 'owned_completion_status' },
        { label: 'Piece count', value: 'owned_pieces' },
        { label: 'Brand', value: 'owned_brand' }
    ]
    const [selectedOption, setSelectedOption] = useState('ownership_status');
    const [chartData, setChartData] = useState([]);

    const getData = async () => {
        try {
            const response = await getStatistics();
            let data = await response.data;
            setStatistics(data);
            setChartData(transformData(data[selectedOption]))
        } catch (error) {
            setStatistics({
                ownership_status: {},
                owned_completion_status: {},
                owned_pieces: {},
                owned_brand: {}
            });
        }
    }

    useEffect(() => { getData(); }, []);

    const inputChanged = (event) => {
        setSelectedOption(event.target.value);
        setChartData(transformData(statistics[event.target.value]));
    }

    const transformData = (data) => {
        return Object.keys(data).map((key, index) => ({
            id: index,
            value: data[key],
            label: key,
        }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
            <Typography variant='h4'>Welcome!</Typography>
            <Typography variant='h3' paragraph>You currently have {statistics.ownership_status['Owned']} puzzles!</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <FormControl sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormLabel id='chartData'>Show distribution by</FormLabel>
                    <RadioGroup
                        row
                        name='chartData'
                        value={selectedOption}
                        onChange={inputChanged}
                    >
                        {options.map((option, index) => {
                            return <FormControlLabel key={index} value={option.value} control={<Radio />} label={option.label}></FormControlLabel>
                        })}
                    </RadioGroup>
                </FormControl>
            </Box>
            <PieChart
                series={[
                    {
                        data: chartData,
                        innerRadius: 25,
                        outerRadius: 100,
                        paddingAngle: 3,
                        cornerRadius: 15,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'white' },
                        highlighted: { additionalRadius: 20 }
                    },
                ]}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: 0,
                    },
                }}
                width={600}
                height={300}
            />
        </Box>
    );
}

export default Home;