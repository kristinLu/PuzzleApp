import axios from 'axios';

let puzzleServer = 'http://localhost:8080/';

export const getMyCollection = async () => {
  try {
    const response = await axios.get(puzzleServer + 'puzzle/collection');
    return (response);
  } catch (error) {
    return ({ status: 500, message: 'Processing request failed: ' + error.message });
  }
}

export const getArchive = async () => {
  try {
    const response = await axios.get(puzzleServer + 'puzzle/archive');
    return (response);
  } catch (error) {
    return ({ status: 500, message: 'Processing request failed: ' + error.message });
  }
}

export const getWishlist = async () => {
  try {
    const response = await axios.get(puzzleServer + 'puzzle/wishlist');
    return (response);
  } catch (error) {
    return ({ status: 500, message: 'Processing request failed: ' + error.message });
  }
}

export const getStatistics = async () => {
  try {
    const response = await axios.get(puzzleServer + 'puzzle/statistics');
    return (response);
  } catch (error) {
    return ({ status: error.status, message: 'Processing request failed: ' + error.message });
  }
}

export const getPuzzleById = async (id) => {
  try {
    const response = await axios.get(puzzleServer + 'puzzle/' + id);
    return (response);
  } catch (error) {
    return ({ status: error.status, message: 'Processing request failed: ' + error.message });
  }
}

export const addPuzzle = async (puzzle) => {
  try {
    const response = await axios.post(puzzleServer + 'puzzle', puzzle, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return (response);
  } catch (error) {
    return ({ status: 500, message: 'Processing request failed: ' + error.message });
  }
}

export const editPuzzle = async (puzzle, id) => {
  try {
    const response = await axios.put(puzzleServer + 'puzzle/' + id, puzzle, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return (response);
  } catch (error) {
    return ({ status: 500, message: 'Processing request failed: ' + error.message });
  }
}

export const deletePuzzle = async (id) => {
  try {
    const response = await axios.delete(puzzleServer + 'puzzle/' + id);
    return (response);
  } catch (error) {
    return ({ status: error.status, message: 'Processing request failed: ' + error.message });
  }
}