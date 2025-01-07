import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
import { addPuzzle, editPuzzle } from '../components/PuzzleService';

function Form({ setActiveTab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const completionStatusSelectOptions = ['Not yet started', 'Under construction', 'Completed', 'Abandoned'];
  const [puzzle, setPuzzle] = useState({
    title: '',
    brand: '',
    ean: '',
    pieces: '',
    image: null,
    image_url: '',
    ownership_status: '',
    completion_status: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({
    title: false,
    brand: false,
    pieces: false,
    ownership_status: false,
    completion_status: false
  });
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (location.state) {
      const editablePuzzle = location.state.editablePuzzle;
      setPuzzle(editablePuzzle);
    } /*else {
      setPuzzle({
        title: '',
        brand: '',
        ean: '',
        pieces: '',
        image: null,
        image_url: '',
        ownership_status: '',
        completion_status: '',
        description: ''
      })
    }*/
  }, [location.state]);

  const inputChanged = (event) => {
    if (event.target.type === 'file') {
      const file = event.target.files[0];
      setSelectedFile(file);
      /*setPuzzle((puzzle) => ({
        ...puzzle, image: file,
        image_url: file ? 'http://localhost:8080/download/' + file.name : ''
      }));*/
    } else {
      const value = event.target.value;
      setPuzzle((puzzle) => {
        let updatedPuzzle = { ...puzzle, [event.target.name]: value };
        if (event.target.name === 'ownership_status' && value === 'Wishlisted') {
          updatedPuzzle.completion_status = '';
        }
        return updatedPuzzle;
      });
      setFormErrors((formErrors) => {
        let updFormErrors = { ...formErrors, [event.target.name]: false };
        if (event.target.name === 'ownership_status' && value === 'Wishlisted') {
          updFormErrors.completion_status = false;
        }
        return updFormErrors;
      });
    }
  }

  const validateForm = () => {
    const errors = {
      title: puzzle.title.trim() === '',
      brand: puzzle.brand.trim() === '',
      pieces: puzzle.pieces === '',
      ownership_status: puzzle.ownership_status === '',
      completion_status: (puzzle.ownership_status === 'Owned' || puzzle.ownership_status === 'Previously owned') && (puzzle.completion_status === '' || puzzle.completion_status === null)
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('title', puzzle.title);
    formData.append('brand', puzzle.brand);
    formData.append('ean', puzzle.ean);
    formData.append('pieces', puzzle.pieces);
    formData.append('image', selectedFile ? selectedFile : puzzle.image);
    formData.append('image_url', selectedFile ? 'http://localhost:8080/download/' + selectedFile.name : puzzle.image_url);
    formData.append('ownership_status', puzzle.ownership_status);
    formData.append('completion_status', puzzle.completion_status);
    formData.append('description', puzzle.description);
    return formData;
  }

  const returnToList = () => {
    if (puzzle.ownership_status === 'Owned') {
      setActiveTab(event, 3);
      navigate('/collection');
    } else if (puzzle.ownership_status === 'Wishlisted') {
      setActiveTab(event, 4);
      navigate('/wishlist');
    } else if (puzzle.ownership_status === 'Previously owned') {
      setActiveTab(event, 5);
      navigate('/archive');
    }
  }

  const add = async () => {
    if (validateForm()) {
      try {
        const response = await addPuzzle(createFormData());
        setMessage(response.data.message);
        returnToList();
      } catch (error) {
        setMessage('Something went wrong');
      }
    }
  }


  const edit = async () => {
    if (validateForm()) {
      try {
        const response = await editPuzzle(createFormData(), puzzle.id);
        setMessage(response.data.message)
        returnToList();
      } catch (error) {
        setMessage('Something went wrong');
      }
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => { setMessage(''); }, 2000);
    return () => clearTimeout(timeout);
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
      {location.state ?
        <Typography variant='h4'>Edit Puzzle</Typography> :
        <Typography variant='h4'>Add a Puzzle</Typography>}
      <Box component='form' sx={{ maxWidth: '700px' }}>

        <TextField
          fullWidth
          required
          error={formErrors.title}
          helperText={formErrors.title ? 'Insert title' : ''}
          margin='normal'
          label='Title'
          name='title'
          value={puzzle.title}
          onChange={inputChanged} />

        <TextField
          fullWidth
          required
          error={formErrors.brand}
          helperText={formErrors.brand ? 'Insert brand' : ''}
          margin='normal'
          label='Brand'
          name='brand'
          value={puzzle.brand}
          onChange={inputChanged} />

        <TextField
          fullWidth margin='normal'
          label='EAN' name='ean'
          value={puzzle.ean}
          onChange={inputChanged} />

        <TextField
          fullWidth
          required
          error={formErrors.pieces}
          helperText={formErrors.pieces ? 'Insert piece count' : ''}
          margin='normal'
          type='number'
          label='Number of pieces'
          name='pieces' value={puzzle.pieces || ''}
          onChange={inputChanged} />

        <FormControl error={formErrors.ownership_status} required>
          {location.state ?
            <FormLabel id='ownership_status'>Move to</FormLabel> :
            <FormLabel id='ownership_status'>Add to</FormLabel>}
          {formErrors.ownership_status && <FormHelperText>Select status</FormHelperText>}
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

        {(puzzle.ownership_status === 'Owned' || puzzle.ownership_status === 'Previously owned') && (
          <FormControl fullWidth margin='normal' error={formErrors.completion_status} required>
            <InputLabel id='completion_status'>Status</InputLabel>
            <Select
              labelId='completion_status'
              name='completion_status'
              value={puzzle.completion_status || ''}
              label='Status'
              onChange={inputChanged}>
              {completionStatusSelectOptions.map((option, index) => {
                return <MenuItem key={index} value={option}>{option}</MenuItem>
              })}
            </Select>
            {formErrors.completion_status && <FormHelperText>Select status</FormHelperText>}
          </FormControl>
        )}

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
            <IconButton component='span'>
              <AttachFileRoundedIcon />
            </IconButton>
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
        {location.state ?
          <Box>
            <Button fullWidth sx={{ margin: 1 }} variant='outlined' onClick={() => navigate(-1)}>Cancel</Button>
            <Button fullWidth sx={{ margin: 1 }} variant='contained' onClick={edit}>Save</Button>
          </Box> :
          <Button fullWidth sx={{ margin: 1 }} variant='contained' onClick={add}>Save</Button>}
      </Box>
      <Typography sx={{ marginBottom: 1, color: 'red' }}>{message}</Typography>
    </Box>
  )
}

Form.propTypes = {
  setActiveTab: PropTypes.func
}

export default Form;
