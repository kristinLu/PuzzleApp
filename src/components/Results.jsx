import PropTypes from 'prop-types';
import { useState } from "react";
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExtensionIcon from '@mui/icons-material/Extension';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardHeader,
    CardContent,
    CardMedia,
    Collapse,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { addPuzzle } from '../components/PuzzleService';
import { useNavigate } from 'react-router-dom';

const ExpandMore = styled(({ ...other }) => (
    <IconButton {...other} />
  ))(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

const StyledCardMedia = styled(CardMedia)({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

function Results({ puzzles, message, setActiveTab }) {
    let altImg = 'http://localhost:8080/download/pieces.png';
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleExpandClick = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const returnToList = (ownership_status) => {
        if (ownership_status === 'Owned') {
            setActiveTab(event, 3);
            navigate('/collection');
        } else if (ownership_status === 'Wishlisted') {
            setActiveTab(event, 4);
            navigate('/wishlist');
        } else if (ownership_status === 'Previously owned') {
            setActiveTab(event, 5);
            navigate('/archive');
        }
    }

    const save = async (puzzle, ownership_status) => {
        const formData = new FormData();
        formData.append('title', puzzle.title);
        formData.append('brand', puzzle.brand);
        formData.append('ean', puzzle.barcode_number);
        formData.append('pieces', 0);
        formData.append('image', null);
        formData.append('image_url', puzzle.images[1] ? puzzle.images[1] : (puzzle.images[0] ? puzzle.images[0] : altImg));
        formData.append('ownership_status', ownership_status);
        formData.append('completion_status', '');
        formData.append('description', puzzle.description);
        try {
            const response = await addPuzzle(formData);
            returnToList(ownership_status);
            console.log(response.data.message);
        } catch (error) {
            console.log('Something went wrong');
        }
    }

    if (puzzles.length === 0) { return <Typography paragraph variant='h5'>{message}</Typography> }

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {puzzles.map(puzzle => {
                return (
                    <Grid item key={puzzle.barcode_number} sx={{ width: '80%', minHeight: 400 }}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label='puzzle'><ExtensionIcon /></Avatar>}
                                title={puzzle.title}
                                subheader={`EAN: ${puzzle.barcode_number}`} />
                            <StyledCardMedia
                                component='img'
                                image={puzzle.images[1]
                                    ? puzzle.images[1]
                                    : (puzzle.images[0]
                                        ? puzzle.images[0]
                                        : altImg)}>
                            </StyledCardMedia>
                            <CardActions disableSpacing>
                                <Tooltip title='Add to My Collection'>
                                    <IconButton aria-label='add to my collection' color='primary' onClick={() => save(puzzle, 'Owned')}>
                                        <ExtensionIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Add to Wishlist'>
                                    <IconButton aria-label='add to wishlist' color='primary' onClick={() => save(puzzle, 'Wishlisted')}>
                                        <FavoriteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Add to Archive'>
                                    <IconButton aria-label='add to archive' color='primary' onClick={() => save(puzzle, 'Previously owned')}>
                                        <InventoryIcon />
                                    </IconButton>
                                </Tooltip>
                                <Typography>Show details: </Typography>
                                <ExpandMore
                                    expand={expanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label='show more'
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </CardActions>
                            <Collapse in={expanded} timeout='auto' unmountOnExit>
                                <CardContent>
                                    <TableContainer sx={{ width: '500px' }}>
                                        <Table aria-label='puzzle details'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>EAN</TableCell>
                                                    <TableCell>{puzzle.barcode_number}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Title</TableCell>
                                                    <TableCell>{puzzle.title}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Brand</TableCell>
                                                    <TableCell>{puzzle.brand}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Description</TableCell>
                                                    <TableCell>{puzzle.description}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Collapse>
                        </Card>
                    </Grid>
                )
            })
            }
        </Box>
    )
}

Results.propTypes = {
    puzzles: PropTypes.arrayOf(PropTypes.object),
    message: PropTypes.string,
    setActiveTab: PropTypes.func
}

export default Results;