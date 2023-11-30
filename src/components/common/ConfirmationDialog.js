import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function ConfirmationDialog({
  title,
  confirmationMessage,
  isUpdating,
  open,
  setOpen,
  handleConfirmClick,
  message,
  children,
}) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div" id="alert-dialog-description">
          <Typography component="div">{confirmationMessage}</Typography>
        </DialogContentText>
        {children}
        <Typography color="error" component="div">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        {isUpdating ? <CircularProgress /> : null}
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button disabled={isUpdating} onClick={handleConfirmClick} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
