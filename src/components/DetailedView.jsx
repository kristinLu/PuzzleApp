import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
    Dialog,
    DialogContent,
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
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useDialog } from './useDialog';

const StyledCardMedia = styled(CardMedia)({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

function DetailedView() {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { openDialog } = useDialog();
    const { puzzle } = location.state;
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const selectAvatar = () => {
        if (puzzle.ownership_status === 'Owned') {
            return <ExtensionIcon />;
        } else if (puzzle.ownership_status === 'Wishlisted') {
            return <FavoriteIcon />
        } else {
            return <InventoryIcon />
        }
    }

    const onDelete = () => {
        navigate(-1);
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 3 }}>
            <Grid item key={puzzle.id} sx={{ width: '80%', minHeight: 400 }}>
                <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                    {puzzle.image_url ?
                        <StyledCardMedia component='img' image={puzzle.image_url} onClick={handleOpen}></StyledCardMedia>
                        :
                        <Typography sx={{ height: 300, textAlign: 'center' }}>No picture available</Typography>
                    }
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }} aria-label='puzzle'>{selectAvatar()}</Avatar>
                        <CardHeader
                            title={puzzle.title}
                            subheader={puzzle.brand} />
                    </Box>
                    <CardContent>
                        <TableContainer sx={{ width: '500px' }}>
                            <Table aria-label='puzzle details'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>EAN</TableCell>
                                        <TableCell>{puzzle.ean}</TableCell>
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
                                        <TableCell>Number of pieces</TableCell>
                                        <TableCell>{puzzle.pieces}</TableCell>
                                    </TableRow>
                                    {puzzle.ownership_status === 'Owned' || puzzle.ownership_status === 'Previously owned' ?
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell>{puzzle.completion_status}</TableCell>
                                        </TableRow>
                                        :
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell>{puzzle.ownership_status}</TableCell>
                                        </TableRow>
                                    }
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>{puzzle.description}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <CardActions disableSpacing>
                            <Tooltip title='Return'>
                                <IconButton aria-label='return' color='primary' onClick={() => { navigate(-1) }}>
                                    <ArrowBackRoundedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Edit'>
                                <IconButton aria-label='edit' color='primary' onClick={() => { navigate('/add', { state: { editablePuzzle: puzzle } }) }}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton aria-label='delete' color='primary' onClick={() => { openDialog(puzzle.id, onDelete) }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </CardActions>

                    </CardContent>
                </Card>
            </Grid>
            <Dialog open={open} onClose={handleClose} fullScreen>
                <DialogContent
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.0)'
                    }}>
                    <IconButton
                        sx={{ position: 'absolute', top: 10, right: 10, color: 'black' }}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={puzzle.image_url}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '100vh',
                            objectFit: 'contain'
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default DetailedView;