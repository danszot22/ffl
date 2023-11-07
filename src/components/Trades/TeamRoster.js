import { Paper, Link, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatPlayerName, playerStatuses } from "../../utils/helpers";
import { FormGroup, Checkbox } from "@mui/material";

export default function TeamRoster({ roster, handlePlayerChange }) {

    return (
        <TableContainer sx={{ border: 1, }} component={Paper}>
            <Table size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan="2">
                            {roster?.team?.TeamName} ({roster?.team?.OwnerName})
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
                                        name={rosterPlayer.RosterPlayerId} />
                                </FormGroup>
                            </TableCell>
                            <TableCell>
                                {rosterPlayer.PositionCode?.startsWith('TM') ?
                                    <img
                                        alt={rosterPlayer.DisplayCode}
                                        height={40}
                                        src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${rosterPlayer.DisplayCode}.png&h=150&w=150`}
                                        loading="lazy"
                                        style={{ borderRadius: '50%' }}
                                    /> : rosterPlayer.EspnPlayerId ?
                                        <img
                                            alt="?"
                                            height={40}
                                            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${rosterPlayer.EspnPlayerId}.png&h=120&w=120&scale=crop`}
                                            loading="lazy"
                                            style={{ borderRadius: '50%' }}
                                        /> :
                                        <img
                                            alt="?"
                                            height={40}
                                            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=120&h=120&scale=crop`}
                                            loading="lazy"
                                            style={{ borderRadius: '50%' }}
                                        />
                                }
                            </TableCell>
                            <TableCell>
                                <Link to={`/Player/${rosterPlayer.PlayerId}`} >{formatPlayerName(rosterPlayer.PlayerName, rosterPlayer.PositionCode)}</Link>
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