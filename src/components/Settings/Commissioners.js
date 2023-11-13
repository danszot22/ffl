import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import { StyledTableRow } from '../common/styled';
import { convertDateToLocal } from "../../utils/helpers";
import { Delete, Send } from '@mui/icons-material';
import { useState } from 'react';

export default function Commissioners({ commissioners, handleDelete, isEditable }) {

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEmail('');
    };

    const handleAdd = () => {
        setOpen(false);
        console.log(email);
        //TODO Call API

        setEmail('');
    };

    const handleSendInvite = (id) => {
        console.log(id);
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ border: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={3}>
                                Commissioners
                            </TableCell>
                            <TableCell>
                                {isEditable ?
                                    <Button sx={{ ml: 1 }} variant='outlined' onClick={handleClickOpen}>
                                        Add
                                    </Button>
                                    : null}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            commissioners?.map((commissioner) => {
                                return (
                                    <StyledTableRow key={commissioner.Email}>
                                        <TableCell>
                                            {commissioner.Email}
                                        </TableCell>
                                        <TableCell>
                                            {commissioner.UserId ? "joined" : commissioner.InvitationCode ? "invited" : "new"}
                                        </TableCell>
                                        <TableCell>
                                            {convertDateToLocal(commissioner.UpdateDateTime).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {isEditable ?
                                                <>
                                                    <Button onClick={() => handleDelete(commissioner.LeagueCommissionerId)}>
                                                        <Delete />
                                                    </Button>
                                                    <Tooltip arrow placement="right" title="Send Invitation" >
                                                        <Button onClick={() => handleSendInvite(commissioner.LeagueCommissionerId)}>
                                                            <Send />
                                                        </Button>
                                                    </Tooltip>
                                                </> : null}
                                        </TableCell>
                                    </StyledTableRow>
                                )
                            })
                        }

                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Commissioner</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a commissioner, please enter their email address here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}