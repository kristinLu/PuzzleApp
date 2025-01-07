import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import Results from './Results';

function BarcodeSearch({ setActiveTab }) {
  const [keyword, setKeyword] = useState('');
  const [resultsToBeShown, setResultsToBeShown] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const inputChanged = (event) => {
    setError(false);
    setMessage('');
    setKeyword(event.target.value.toLowerCase().trim());
  }

  const findPuzzles = async () => {
    //const proxyurl = 'https://wry-grizzly-donkey.glitch.me/';
    //const url = `${proxyurl}https://api.barcodelookup.com/v3/products?barcode=${keyword}&formatted=y&key=${apikey}`;
    const apikey = 'emorfgbor22rcmz8yvyal303dgbu6m';
    const url = `https://api.barcodelookup.com/v3/products?barcode=${keyword}&formatted=y&key=${apikey}`;
    if (keyword !== '') {
      setError(false);
      try {
        const response = await fetch(url);
        if (response.status === 404) {
          setMessage('No results found');
        } else {
          try {
            const json = await response.json(); 
            if (!json.products) {
              setMessage('No results found');
            }
            setResultsToBeShown(json.products);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      } catch (error) {
        setMessage('Something went wrong');
      }
    } else {
      setError(true);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
      <TextField
        required
        error={error}
        helperText={error ? 'Insert barcode' : ''}
        margin='normal'
        type='number'
        label='Search by barcode'
        name='barcode' value={keyword}
        onChange={inputChanged} />
      <Button sx={{ margin: 1 }} variant='outlined' onClick={findPuzzles}>Search</Button>
      <Results puzzles={resultsToBeShown} message={message} setActiveTab={setActiveTab} />
    </Box>
  )
}

BarcodeSearch.propTypes = {
  setActiveTab: PropTypes.func
}

export default BarcodeSearch;