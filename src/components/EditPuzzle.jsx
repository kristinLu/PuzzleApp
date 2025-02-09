import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
  } from '@mui/material';
  import ClearIcon from '@mui/icons-material/Clear';
  import { useEffect, useState } from 'react';
  //import PropTypes from 'prop-types';
  import { addPuzzle } from '../components/PuzzleService';
  
  function EditPuzzle() {
    const completionStatusSelectOptions = ["Not yet started", "Under construction", "Completed", "Abandoned"];
    const [puzzle, setPuzzle] = useState({
      id: '',
      title: '',
      brand: '',
      ean: '',
      pieces: '',
      image: '',
      image_url: '',
      ownership_status: '',
      completion_status: '',
      description: ''
    });
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
  
    const inputChanged = (event) => {
      if (event.target.type === 'file') {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
        setPuzzle({ ...puzzle, picture: event.target.files[0].name });
      } else {
        setPuzzle({ ...puzzle, [event.target.name]: event.target.value });
      }
    }
  
    const handleRemoveFile = () => {
      setSelectedFile(null);
    };
  
    const lisaa = () => {
      if (puzzle.id == '' || puzzle.title == '' || puzzle.brand == '' || puzzle.pieces == '') {
        setMessage('Please insert the required data');
      } else {
        setPuzzle({
          id: '',
          title: '',
          brand: '',
          ean: '',
          pieces: '',
          image: '',
          image_url: '',
          ownership_status: '',
          completion_status: '',
          description: ''
        });
        setMessage('New puzzle successfully added!');
        add(puzzle);
      }
    }
  
    const add = async(puzzle) => {
      try {
          await addPuzzle(puzzle);
      } catch (error) {
          console.log('Something went wrong');
      }
  }
  
    useEffect(() => {
      const timeout = setTimeout(() => { setMessage(''); }, 2000);
      return () => clearTimeout(timeout);
    });
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
        <Typography variant='h4'>Add a Puzzle</Typography>
        <Box component='form' sx={{maxWidth: '700px'}}>
          <TextField fullWidth margin='normal' label='Id' name='id' value={puzzle.id} onChange={inputChanged} />
          <TextField fullWidth margin='normal' label='Title' name='title' value={puzzle.title} onChange={inputChanged} />
          <TextField fullWidth margin='normal' label='Brand' name='brand' value={puzzle.brand} onChange={inputChanged} />
          <TextField fullWidth margin='normal' label='EAN' name='ean' value={puzzle.ean} onChange={inputChanged} />
          <TextField fullWidth margin='normal' type='number' label='Number of pieces' name='pieces' value={puzzle.pieces || ''} onChange={inputChanged} />
  
          <FormControl>
            <FormLabel id='ownership_status'>Add to</FormLabel>
            <RadioGroup
              row
              name='ownership_status'
              value={puzzle.ownership_status}
              onChange={inputChanged}
            >
              <FormControlLabel value='Owned' control={<Radio />} label='My collection' />
              <FormControlLabel value='Wishlisted' control={<Radio />} label='Wishlist' />
              <FormControlLabel value='Previously owned' control={<Radio />} label='Archive' />
            </RadioGroup>
          </FormControl>
  
          <FormControl fullWidth margin='normal' >
            <InputLabel id='completion_status'>Status</InputLabel>
            <Select
              labelId='completion_status'
              name='completion_status'
              value={puzzle.completion_status}
              label='Status'
              onChange={inputChanged}>
              {completionStatusSelectOptions.map((option, index) => {
                return <MenuItem key={index} value={option}>{option}</MenuItem>
              })}
            </Select>
          </FormControl>
  
          <TextField
            fullWidth
            multiline
            rows={4}
            label='Add a description'
            name='description'
            value={puzzle.description}
            onChange={inputChanged}
            InputProps={{
              style: { resize: 'vertical' }
            }}
          />
  
          <TextField
            fullWidth
            margin='normal'
            label='Add image url'
            name='image_url'
            value={puzzle.image_url}
            onChange={inputChanged}
          />
  
          <InputLabel>Upload a picture</InputLabel>
          <Box display='flex' alignItems='center'>
            <Input
              type='file'
              onChange={inputChanged}
              style={{ display: 'none' }}
              inputProps={{ accept: '.jpg, .png, .jpeg' }}
              id='upload-button'
            />
            <InputLabel htmlFor='upload-button'>
              <Button fullWidth variant='contained' component='span' size='large'>
                Upload File
              </Button>
            </InputLabel>
            {selectedFile && (
              <Box display='flex' alignItems='center' ml={1}>
                <Typography>{selectedFile.name}</Typography>
                <IconButton size='small' onClick={handleRemoveFile}>
                  <ClearIcon />
                </IconButton>
              </Box>
            )}
          </Box>
  
          <Button sx={{ margin: 1 }} variant='outlined' onClick={lisaa}>Add</Button>
        </Box>
        <Typography sx={{ marginBottom: 1, color: 'red' }}>{message}</Typography>
      </Box>
    )
  }
  
  export default EditPuzzle;  