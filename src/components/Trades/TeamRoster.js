import { Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatFantasyTeamName, playerStatuses } from "../../utils/helpers";
import { FormGroup, Checkbox } from "@mui/material";
import PlayerImage from "../common/PlayerImage";
import PlayerLink from "../common/PlayerLink";

export default function TeamRoster({ roster, handlePlayerChange }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <TableContainer sx={{ border: 1, }} component={Paper}>
            <Table size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan="2">
                            {roster?.team ? formatFantasyTeamName(roster?.team, isBelowMedium) : null}
                        </TableCell>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell>
                            Status
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roster?.Players?.map((rosterPlayer, index) => (
                        <TableRow sx={{ borderTop: index > 0 && rosterPlayer.Group !== roster?.Players[index - 1].Group ? 3 : 1 }} key={rosterPlayer.RosterPlayerId}>
                            <TableCell>
                                <FormGroup>
                                    <Checkbox onChange={handlePlayerChange}
                                        name={'' + rosterPlayer.RosterPlayerId} />
                                </FormGroup>
                            </TableCell>
                            <TableCell>
                                <PlayerImage positionCode={rosterPlayer?.PositionCode} nflTeamCode={rosterPlayer?.DisplayCode} espnPlayerId={rosterPlayer.EspnPlayerId} height={40} />
                            </TableCell>
                            <TableCell>
                                <PlayerLink playerId={rosterPlayer.PlayerId} playerName={rosterPlayer.PlayerName} positionCode={rosterPlayer.PositionCode} xsOnly={true} />
                                {` ${rosterPlayer.PositionCode} ${rosterPlayer.DisplayCode}`}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 300 }}>
                                <Typography variant="caption" sx={{ pr: 1 }}>
                                    {playerStatuses[rosterPlayer.StatusCode]}
                                </Typography>
                                <Typography variant="caption" sx={{ pr: 1 }}>
                                    {rosterPlayer.StatusDescription}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
}