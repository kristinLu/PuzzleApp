import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import { deletePuzzle } from '../components/PuzzleService';

export const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [updateList, setUpdateList] = useState(null);

  const openDialog = (itemId, update) => {
    setItemId(itemId);
    setUpdateList(() => update);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setItemId(null);
    setUpdateList(null);
  };

  const handleConfirmDelete = async (itemId) => {
    try {
        await deletePuzzle(itemId);
        if (updateList) {
            updateList();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
    closeDialog();
  };

  return (
    <DialogContext.Provider value={{ open, openDialog, closeDialog, handleConfirmDelete, itemId }}>
      {children}
    </DialogContext.Provider>
  );
};

DialogProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };