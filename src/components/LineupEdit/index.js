import { Paper, Typography, TableFooter, Box } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { playerStatuses, formatGameInfo, formatFantasyTeamName } from "../../utils/helpers";
import Root from "../Root";
import { NflWeekContext } from "../../contexts/NflWeekContext";
import { useSearchParams, useParams } from "react-router-dom";
import { leaguePlayersLoader, scoringLoader, nflGamesLoader, leagueSettingsLoader, teamLineupLoader } from "../../api/graphql";
import { useEffect, useState, useContext } from "react";
import { mapTeamScoringTotals, mapRosterToTeamLineup, mapLineupToTeamLineup } from "../../utils/parsers";
import { FormGroup, Checkbox, Button, FormHelperText, FormControl } from "@mui/material";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import PlayerImage from "../common/PlayerImage";
import PlayerLink from "../common/PlayerLink";

function ProjectedStats({ rosterPlayer, variant, sx }) {
    return (
        rosterPlayer.NflGame.NotPlayed ? (
            <Typography sx={sx} variant={variant} component={"div"}>
                Proj:
                {["TMQB", "QB"].includes(rosterPlayer.Player.Position.PositionCode) ? ` ${rosterPlayer.ProjPassYds ?? 0} Yds, ${rosterPlayer.ProjPassTds ?? 0} TDs, ${rosterPlayer.ProjPassInts ?? 0} Ints` : ' '}
                {["RB"].includes(rosterPlayer.Player.Position.PositionCode) ? `${rosterPlayer.ProjRushYds ?? 0} Yds, ${rosterPlayer.ProjRushTds ?? 0} TDs` : ' '}
                {["WR", "TE"].includes(rosterPlayer.Player.Position.PositionCode) ? `${rosterPlayer.ProjRecYds ?? 0} Yds, ${rosterPlayer.ProjRecTds ?? 0} TDs` : ' '}
                {["TMPK", "PK"].includes(rosterPlayer.Player.Position.PositionCode) ? ` ${rosterPlayer.ProjFgYds ?? 0} FGYds, ${rosterPlayer.ProjXPs ?? 0} XPs` : ' '}
                {["S", "CB", "LB", "DE", "DT"].includes(rosterPlayer.Player.Position.PositionCode) ? ` ${rosterPlayer.ProjTackles ?? 0} Tcks, ${rosterPlayer.ProjSacks ?? 0} Sacks` : ' '}
            </Typography>
        ) : null
    )
}

function LineupEdit({ league, team }) {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { state: nflWeekState } = useContext(NflWeekContext);
    const [roster, setRoster] = useState();
    const [week, setWeek] = useState(searchParams.has("week") ? +searchParams.get("week") : nflWeekState?.lineupWeek);
    const [settings, setSettings] = useState({});
    const [errorList, setErrorList] = useState([]);

    useEffect(() => {
        if (!searchParams.has("week"))
            setWeek(nflWeekState.lineupWeek);
    }, [searchParams, nflWeekState]);

    useEffect(() => {
        const fetchData = async (leagueId, teamId, lineupWeek) => {
            const responseSettings = await leagueSettingsLoader(leagueId);
            setSettings(responseSettings);
            const scoringResponse = await scoringLoader(leagueId, lineupWeek);
            const scoring = mapTeamScoringTotals(scoringResponse).totals.find(total => total?.key === teamId);
            const response = await leaguePlayersLoader(leagueId, "All", "OnRosters", 1, 1000, 1, "All", "All", " ", "PositionId", "ASC");
            const teamRoster = response.filter(rosterPlayer => rosterPlayer?.TeamId === teamId);
            const nflGameResponse = await nflGamesLoader(lineupWeek);
            const lineupResponse = await teamLineupLoader(teamId, lineupWeek);
            if (nflWeekState && lineupWeek && lineupWeek < nflWeekState.lineupWeek) {
                setRoster(mapLineupToTeamLineup(lineupResponse, nflGameResponse));
            }
            else {
                setRoster(mapRosterToTeamLineup(teamRoster, scoring, nflGameResponse, lineupResponse));
            }
            if (nflWeekState?.lineupWeek > week) {
                setErrorList([`Deadline has passed. Lineups are locked for week ${week}.`]);
            }
            else if (nflWeekState?.lineupWeek < week) {
                setErrorList([`Future week lineups cannot be set.`]);
            }
            else {
                setErrorList([]);
            }
        }

        fetchData(league?.LeagueId, Number.isInteger(+id) ? +id : team?.TeamId, week);
    }, [
        id,
        team?.TeamId,
        league?.LeagueId,
        week,
        nflWeekState
    ]);

    const validateLineup = (rs) => {
        let errors = [];
        const stmqb = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "TMQB").length;
        const sqb = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "QB").length;
        const stmpk = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "TMPK").length;
        const spk = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "PK").length;
        const srb = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "RB").length;
        const swr = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "WR").length;
        const ste = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "TE").length;
        const sr = roster?.Players?.filter(rp => rp.Starting && ["WR", "TE"].includes(rp.Player.Position.PositionCode)).length;
        const scb = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "CB").length;
        const ss = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "S").length;
        const sdb = roster?.Players?.filter(rp => rp.Starting && ["CB", "S"].includes(rp.Player.Position.PositionCode)).length;
        const slb = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "LB").length;
        const sdt = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "DT").length;
        const sde = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "DE").length;
        const sdl = roster?.Players?.filter(rp => rp.Starting && ["DT", "DE"].includes(rp.Player.Position.PositionCode)).length;
        const stmdf = roster?.Players?.filter(rp => rp.Starting && rp.Player.Position.PositionCode === "TMDF").length;
        const sdf = roster?.Players?.filter(rp => rp.Starting && ["CB", "S", "DE", "DT", "LB"].includes(rp.Player.Position.PositionCode)).length;

        if (rs.STMQB !== stmqb) {
            errors.push("Invalid number of Team QBs");
        }
        if (rs.SQB !== sqb) {
            errors.push("Invalid number of QBs");
        }
        if (rs.STMPK !== stmpk) {
            errors.push("Invalid number of Team Kickers");
        }
        if (rs.SPK !== spk) {
            errors.push("Invalid number of Kickers");
        }
        if (rs.SRB > srb) {
            errors.push("Invalid number of RBs");
        }
        if (rs.SWR > swr) {
            errors.push("Invalid number of  Wide Receivers");
        }
        if (rs.STE > ste) {
            errors.push("Invalid number of Tight Ends");
        }
        if (rs.SR > sr) {
            errors.push("Invalid number of Receivers");
        }
        if (rs.SCB > scb) {
            errors.push("Invalid number of Cornerbacks");
        }
        if (rs.SS > ss) {
            errors.push("Invalid number of Safeties");
        }
        if (rs.SDB + rs.SCB + rs.SS > sdb) {
            errors.push("Invalid number of Defensive Backs");
        }
        if (rs.SLB > slb) {
            errors.push("Invalid number of Linebackers");
        }
        if (rs.SDT > sdt) {
            errors.push("Invalid number of Defensive Tackles");
        }
        if (rs.SDE > sde) {
            errors.push("Invalid number of Defensive Ends");
        }
        if (rs.SDL + rs.SDT + rs.SDE > sdl) {
            errors.push("Invalid number of Defensive Linemen");
        }
        if (rs.STMDF > stmdf) {
            errors.push("Invalid number of Team Defenses");
        }
        if (rs.SDF + rs.SCB + rs.SS + rs.SDB + rs.SLB + rs.SDL + rs.SDT + rs.SDE !== sdf) {
            errors.push("Invalid number of Defensive Players");
        }
        if (rs.SRBWR + rs.SRB + rs.SR + rs.STE + rs.SWR !== srb + swr + ste) {
            errors.push("Invalid number of combined RBs and Receivers");
        }
        setErrorList(errors);
    }

    const handleSave = (event) => {
        if (errorList.length === 0) {
            const newLineup = roster?.Players.map(rosterPlayer => {
                const lineup = {
                    RosterPlayerId: rosterPlayer.RosterPlayerId,
                    Starter: rosterPlayer.Starting
                }
                return lineup;
            });
            console.log(newLineup);
            //TODO : Call API
        }
    };

    const handleChange = (event) => {
        //const originalPlayers = [...roster.Players];
        const player = roster?.Players?.find(rosterPlayer => +event.target.name === rosterPlayer.RosterPlayerId);
        if (player) {
            player.Starting = event.target.checked;
            const newPlayers = roster?.Players.map(rosterPlayer =>
                rosterPlayer.RosterPlayerId === player.RosterPlayerId ? player : rosterPlayer);
            const newRoster = {
                key: roster.key,
                team: { ...roster.team },
                Players: [...newPlayers],
            }
            setRoster(newRoster);
        }
        validateLineup(settings);
    };

    return (
        <Root>
            <PageToolbar title={'Edit Lineup'} subtitle={roster?.team ? `${formatFantasyTeamName(roster?.team)} - Week ${week}` : ''} />
            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>

                            </TableCell>
                            <TableCell>

                            </TableCell>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                                Status
                            </TableCell>
                            <TableCell>
                                Game
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                                Projections
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roster?.Players.map((rosterPlayer, index) => (
                            <TableRow sx={{ borderTop: index > 0 && rosterPlayer.Player?.Position?.Group !== roster?.Players[index - 1].Player?.Position?.Group ? 3 : 1 }} key={rosterPlayer.RosterPlayerId}>
                                <TableCell sx={{ p: 0 }}>
                                    <FormGroup>
                                        <Checkbox onChange={handleChange}
                                            name={rosterPlayer.RosterPlayerId} disabled={nflWeekState?.lineupWeek !== week || (rosterPlayer.NflGame.GameDate && !rosterPlayer.NflGame.NotPlayed)} checked={rosterPlayer.Starting} />
                                    </FormGroup>
                                </TableCell>
                                <TableCell>
                                    <PlayerImage positionCode={rosterPlayer.Player?.Position?.PositionCode}
                                        nflTeamCode={rosterPlayer.Player?.NflTeam?.DisplayCode}
                                        espnPlayerId={rosterPlayer.Player?.EspnPlayerId}
                                        height={40} />
                                </TableCell>
                                <TableCell>
                                    <PlayerLink playerId={rosterPlayer.PlayerId} playerName={rosterPlayer.Player?.Name} positionCode={rosterPlayer.Player?.Position?.PositionCode} />
                                    {` ${rosterPlayer.Player?.Position?.PositionCode} ${rosterPlayer.Player?.NflTeam?.DisplayCode}`}
                                    <ProjectedStats rosterPlayer={rosterPlayer} variant={"caption"} sx={{ display: { xs: 'block', md: 'none' }, }} />
                                    <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, pr: 1 }}>
                                        {rosterPlayer.Player?.Status?.StatusDescription}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300, display: { xs: 'none', md: 'table-cell' }, }}>
                                    <Typography variant="caption" sx={{ pr: 1 }}>
                                        {playerStatuses[rosterPlayer.Player?.Status?.StatusCode]}
                                    </Typography>
                                    <Typography variant="caption" sx={{ pr: 1 }}>
                                        {rosterPlayer.Player?.Status?.StatusDescription}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {formatGameInfo(rosterPlayer.Player.NflTeam?.NflTeamId, rosterPlayer.NflGame)}
                                </TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                                    <ProjectedStats rosterPlayer={rosterPlayer} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}>
                                    <Button
                                        variant="contained"
                                        sx={{ ml: 1 }}
                                        onClick={handleSave}
                                        disabled={errorList.length > 0}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ ml: 1 }}
                                        to={`/Lineups`}
                                    >
                                        Cancel
                                    </Button>
                                    <FormControl required error={errorList.length > 0} sx={{ display: { xs: 'inline', md: 'none' }, }}>
                                        {errorList.map(error =>
                                            <FormHelperText>{error}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Box>

                            </TableCell>
                            <TableCell colSpan={3} sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                                <FormControl required error={errorList.length > 0}>
                                    {errorList.map(error =>
                                        <FormHelperText>{error}</FormHelperText>
                                    )}
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Root>)
}

export default withAuth(LineupEdit);