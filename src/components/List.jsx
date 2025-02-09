import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDialog } from './useDialog';

function List({ puzzles, refreshList, listType }) {
    const navigate = useNavigate();
    const { openDialog } = useDialog();

    const columns = [
        {
            field: 'image_url',
            headerName: 'Image',
            width: 200,
            renderCell: (params) => (
                <Box style={{ maxHeight: '500px', overflow: 'hidden' }}>
                    <img alt='Image' src={params.row.image_url} style={{ maxWidth: '100%', height: 'auto' }} />
                </Box>
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 150,
            editable: true,
        },
        {
            field: 'brand',
            headerName: 'Brand',
            width: 150,
            editable: true,
        },
        {
            field: 'pieces',
            headerName: 'Number of pieces',
            type: 'number',
            width: 150,
            editable: true,
        },
        {
            field: 'completion_status',
            headerName: 'Status',
            width: 200,
            editable: true,
        },
        {
            field: 'edit',
            headerName: 'Edit',
            sortable: false,
            width: 100,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                const handleEdit = (event) => {
                    event.stopPropagation();
                    navigate('/add', { state: { editablePuzzle: params.row } });
                };
                return (
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                );
            },
        },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 120,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <Box>
                        <Button
                            variant='outlined'
                            color='primary'
                            onClick={(event) => { event.stopPropagation(); openDialog(params.row.id, refreshList) }}
                        >
                            Delete
                        </Button>
                    </Box>
                );
            },
        },
    ];

    const rows = puzzles.map(puzzle => ({
        id: puzzle.id,
        image_url: puzzle.image_url ? puzzle.image_url : 'http://localhost:8080/download/pieces.png',
        title: puzzle.title,
        brand: puzzle.brand,
        ean: puzzle.ean,
        pieces: puzzle.pieces,
        image: puzzle.image,
        ownership_status: puzzle.ownership_status,
        completion_status: puzzle.completion_status,
        description: puzzle.description
    }));

    const filteredColumns = (listType !== 'wishlist') 
    ? columns
    : columns.filter((column) => column.field !== 'completion_status');

    const handleRowClick = (params) => {
        navigate('/detailedview', { state: { puzzle: params.row } });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 5 }}>
            <Box style={{ width: '80%' }}>
                <DataGrid
                    autoHeight
                    rows={rows}
                    columns={filteredColumns}
                    getRowHeight={(params) => Math.min(params.rowHeight || 150, 150)}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 3,
                            },
                        },
                    }}
                    pageSizeOptions={[3, 5, 10, 15, 20]}
                    onRowClick={handleRowClick}
                />
            </Box>
        </Box>
    )
}

List.propTypes = {
    puzzles: PropTypes.arrayOf(PropTypes.object),
    refreshList: PropTypes.func,
    listType: PropTypes.string
}

export default List;