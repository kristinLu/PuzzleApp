import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useDialog } from './useDialog';

const ConfirmationDialog = () => {
    const { open, closeDialog, handleConfirmDelete, itemId } = useDialog();

    if (!open) {
        return null;
      }

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>Are you sure you want to delete this puzzle?</DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color='primary'>
          Cancel
        </Button>
        <Button onClick={() => handleConfirmDelete(itemId)} color='primary'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;