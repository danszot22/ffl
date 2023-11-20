import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";

export default function ConfirmationDialog({ confirmationMessage, isUpdating, open, setOpen, handleConfirmClick, message }) {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Confirm"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText component="div" id="alert-dialog-description">
                    <Typography component="div">
                        {confirmationMessage}
                    </Typography>
                    <Typography color="error" component="div">
                        {message}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {isUpdating ? <CircularProgress /> : null}
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={isUpdating} onClick={handleConfirmClick} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}