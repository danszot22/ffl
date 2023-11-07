import { formatGameInfo } from "../../utils/helpers";
import { TableCell, TableRow, Typography, Link, Box, Grid, Collapse, Paper, Table, TableHead, TableBody } from "@mui/material";
import { StyledExpandableTableRow } from '../common/styled';

export default function TeamPlayerStatisticRow({ player, game, teamPlayers, open }) {

    return (
        <>
            <StyledExpandableTableRow key={game.NflGameId} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    {game.Week}
                </TableCell>
                <TableCell>
                    <Typography color={game?.NotPlayed ? "error.light" : game?.Playing ? "warning.light" : ""}>
                        <Link color="inherit" to={game?.BoxScoreURL}>{formatGameInfo(player.Player.NflTeam?.NflTeamId, game)}</Link>
                    </Typography>
                </TableCell>
                <TableCell align="right"></TableCell>
                <TableCell colSpan={5}></TableCell>
            </StyledExpandableTableRow>
            {teamPlayers.length > 0 ? (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            bgcolor: 'background.default',
                                            display: 'grid',
                                        }}
                                    >
                                        <Paper elevation={3} >
                                            <Table size="small" aria-label="players">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Player</TableCell>
                                                        <TableCell align="right">{["TMPK"].includes(player?.Player?.Position?.PositionCode) ? "FGYds" : "PassYds"}</TableCell>
                                                        <TableCell align="right">{["TMPK"].includes(player?.Player?.Position?.PositionCode) ? "XPs" : "PassTds"}</TableCell>
                                                        <TableCell align="right">{["TMPK"].includes(player?.Player?.Position?.PositionCode) ? " " : "PassInts"}</TableCell>
                                                        <TableCell align="right">{["TMPK"].includes(player?.Player?.Position?.PositionCode) ? " " : "RushYds"}</TableCell>
                                                        <TableCell align="right">{["TMPK"].includes(player?.Player?.Position?.PositionCode) ? " " : "RushTds"}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {teamPlayers.map((player) => (
                                                        <TableRow key={player?.Player?.PlayerId}>
                                                            <TableCell>{player?.Player?.Name}</TableCell>
                                                            <TableCell align="right">{["PK"].includes(player?.Player?.Position?.PositionCode) ? player?.FgYds ?? 0 : player?.PassYds ?? 0}</TableCell>
                                                            <TableCell align="right">{["PK"].includes(player?.Player?.Position?.PositionCode) ? player?.XPs ?? 0 : player?.PassTds ?? 0}</TableCell>
                                                            <TableCell align="right">{["PK"].includes(player?.Player?.Position?.PositionCode) ? null : player?.PassInts ?? 0}</TableCell>
                                                            <TableCell align="right">{["PK"].includes(player?.Player?.Position?.PositionCode) ? null : player?.RushYds ?? 0}</TableCell>
                                                            <TableCell align="right">{["PK"].includes(player?.Player?.Position?.PositionCode) ? null : player?.RushTds ?? 0}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </TableCell>
                </TableRow>) : <TableRow />}
        </>
    )
}