import { Paper, Typography, Tooltip, Box, IconButton } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { playerStatuses } from "../../utils/helpers";
import { Delete, Info, ThumbDown } from "@mui/icons-material";
import { StyledTableHeaderRow } from "../common/styled";
import withAuth from "../withAuth";
import PlayerImage from "../common/PlayerImage";
import PlayerLink from "../common/PlayerLink";
import FormattedPlayerStats from "../common/FormattedPlayerStats";

function TeamRoster({ roster, teamDetails, team, isEditable }) {

    const handleDelete = () => {
        //TODO: Call API
        console.log('delete');
    };

    return (
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
                <TableBody>
                    {roster?.Players.map((player, index) => (
                        <TableRow sx={{ borderTop: index > 0 && player?.Group !== roster?.Players[index - 1]?.Group ? 3 : 1 }} key={player.PlayerId}>
                            <TableCell>
                                <PlayerImage positionCode={player?.PositionCode} nflTeamCode={player?.DisplayCode} espnPlayerId={player.EspnPlayerId} />
                            </TableCell>
                            <TableCell>
                                <PlayerLink playerId={player.PlayerId} playerName={player.PlayerName} positionCode={player.PositionCode} xsOnly={true} />
                                {` ${player.PositionCode} ${player.DisplayCode}`}
                                <Typography sx={{ display: { xs: 'block', sm: 'none' }, }}>
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
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }} >
                                <FormattedPlayerStats player={player} />
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
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
                            <TableCell sx={{ p: { xs: 0, sm: 1 }, }}>
                                {team?.TeamId === teamDetails?.TeamId ?
                                    <Tooltip title="Drop">
                                        <IconButton variant="contained" color="error" to={`/RosterPlayer/Drop/${teamDetails?.TeamId}/${player.RosterPlayerId}`}>
                                            <ThumbDown />
                                        </IconButton>
                                    </Tooltip>
                                    : null}
                                {isEditable ?
                                    <Tooltip title="Delete">
                                        <IconButton variant="contained" color="error" onClick={handleDelete}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                    : null}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
}

export default withAuth(TeamRoster);