import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Skeleton, CircularProgress } from "@mui/material";
import { Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatPlayerFullName } from "../../utils/helpers";
import { StyledTableHeaderRow } from "../common/styled";
import { useState } from "react";
import { getTransactionText, updateRoster } from "../../api/ffl";
import TeamRosterPlayers from "../common/TeamRosterPlayers";
import { useNavigate } from "react-router-dom";

export default function DropRosterPlayers({ leagueId, roster, playerToAdd }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [selectedRosterPlayer, setSelectedRosterPlayer] = useState({});
    const [transactionText, setTransactionText] = useState('');
    const [errorText, setErrorText] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleClickOpen = (rosterPlayerToDrop) => {
        setOpen(true);
        setSelectedRosterPlayer(rosterPlayerToDrop);

        const fetchText = async (nflTeamId, rosterPlayerId) => {
            const response = await getTransactionText(nflTeamId, rosterPlayerId);
            if (!response?.Message) {
                setTransactionText(response);
            }
        }
        fetchText(playerToAdd.NflTeam?.NflTeamId, rosterPlayerToDrop?.RosterPlayerId);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRosterPlayer({});
        setErrorText('');
    };

    const handleClickConfirm = async () => {
        setIsUpdating(true);
        const result = await updateRoster(leagueId, selectedRosterPlayer.TeamId, playerToAdd.PlayerId, selectedRosterPlayer.RosterPlayerId);
        setIsUpdating(false);
        if (result?.Message) {
            setErrorText(result?.Message);
        }
        else {
            navigate(`/Team`);
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Move"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div" id="alert-dialog-description">
                        <Typography component="div">
                            {playerToAdd?.Name ? `Adding ${formatPlayerFullName(playerToAdd?.Name)} ${playerToAdd?.Position?.PositionCode}` : null}
                        </Typography>
                        <Typography component="div">
                            {selectedRosterPlayer?.PlayerName ? `Dropping ${formatPlayerFullName(selectedRosterPlayer?.PlayerName)} ${selectedRosterPlayer?.PositionCode}` : null}
                        </Typography>
                        {transactionText.length === 0 ?
                            <Skeleton sx={{ p: 1 }} variant="rectangular" height={40}>Loading...</Skeleton>
                            :
                            <Typography component="div">
                                {transactionText}
                            </Typography>
                        }
                        <Typography color="error" component="div">
                            {errorText}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isUpdating ? <CircularProgress /> : null}
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={isUpdating || transactionText.length === 0} onClick={handleClickConfirm} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer sx={{ maxWidth: 750 }} component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <StyledTableHeaderRow>
                            <TableCell colSpan={6}>
                                Roster
                            </TableCell>
                        </StyledTableHeaderRow>
                        <TableRow>
                            <TableCell>

                            </TableCell>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                                Stats
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                                Status
                            </TableCell>
                            <TableCell>
                                Bye
                            </TableCell>
                            <TableCell>

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TeamRosterPlayers roster={roster} handleClick={handleClickOpen} />
                </Table>
            </TableContainer>
        </>)
}