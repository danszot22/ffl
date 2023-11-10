import { Paper, Typography, Tooltip, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Skeleton } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatPlayerFullName, playerStatuses } from "../../utils/helpers";
import { Info } from "@mui/icons-material";
import { StyledTableHeaderRow } from "../common/styled";
import { useState } from "react";
import { getTransactionText } from "../../api/ffl";
import PlayerImage from "../common/PlayerImage";
import PlayerLink from "../common/PlayerLink";
import FormattedPlayerStats from "../common/FormattedPlayerStats";

export default function DropRosterPlayers({ roster, playerToAdd }) {
    const [open, setOpen] = useState(false);
    const [selectedRosterPlayer, setSelectedRosterPlayer] = useState({});
    const [transactionText, setTransactionText] = useState('');

    const handleClickOpen = (rosterPlayerToDrop) => {
        setOpen(true);
        setSelectedRosterPlayer(rosterPlayerToDrop);

        const fetchText = async (nflTeamId, rosterPlayerId) => {
            const response = await getTransactionText(nflTeamId, rosterPlayerId);
            setTransactionText(response);
        }
        fetchText(playerToAdd.NflTeam?.NflTeamId, rosterPlayerToDrop?.RosterPlayerId);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRosterPlayer({});
    };

    function handleClickConfirm() {
        console.log(selectedRosterPlayer.TeamId, selectedRosterPlayer.RosterPlayerId, playerToAdd);

        setOpen(false);
        setSelectedRosterPlayer({});
        //TODO : Call API
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
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={transactionText.length === 0} onClick={handleClickConfirm} autoFocus>
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
                            <TableCell>
                                Stats
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                Bye
                            </TableCell>
                            <TableCell>

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roster?.map((player, index) => (
                            <TableRow sx={{ borderTop: index > 0 && player?.Group !== roster[index - 1]?.Group ? 3 : 1 }} key={player.PlayerId}>
                                <TableCell>
                                    <PlayerImage positionCode={player?.PositionCode} nflTeamCode={player?.DisplayCode} espnPlayerId={player.EspnPlayerId} height={30} />
                                </TableCell>
                                <TableCell>
                                    <PlayerLink playerId={player.PlayerId} playerName={player.PlayerName} positionCode={player.PositionCode} />
                                    {` ${player.PositionCode} ${player.DisplayCode}`}
                                </TableCell>
                                <TableCell >
                                    <FormattedPlayerStats player={player} />
                                </TableCell>
                                <TableCell>
                                    {player.StatusDescription?.length > 0 ?
                                        (<Tooltip title={player.StatusDescription}>
                                            <Box sx={{
                                                display: 'flex',
                                            }}>
                                                <Typography variant="caption" sx={{ pr: 1 }}>
                                                    {playerStatuses[player.StatusCode]}
                                                </Typography>
                                                <Info />
                                            </Box>
                                        </Tooltip>) : null
                                    }
                                </TableCell>
                                <TableCell>
                                    {player.ByeWeek}
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={() => handleClickOpen(player)}>Drop</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>)
}