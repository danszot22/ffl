import { useState, useEffect, useContext } from "react";
import Root from "../Root";
import { mapCategoryScoring, mapTeamScoringTotals, mapFantasyGames } from "../../utils/parsers";
import ScoringTabs from "./ScoringTabs";
import GameHeaderCard from "./GameHeaderCard";
import { scoringLoader, fantasyGameLoader, lineupsLoader, nflGamesLoader } from "../../api/graphql";
import { Button, ButtonGroup, Box, Typography, Skeleton, Table, TableRow, TableCell, Paper, TableHead, FormControl, InputLabel, Select, MenuItem, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { NflWeekContext } from "../../contexts/NflWeekContext";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import { formatFantasyTeamName } from "../../utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { grey } from "@mui/material/colors";

function Scoring({ league, team }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
    const { state: nflWeekState } = useContext(NflWeekContext);

    const [summaryData, setSummaryData] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [fantasyGames, setFantasyGames] = useState([]);
    const [teamFantasyGame, setTeamFantasyGame] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [updatedOn, setUpdatedOn] = useState('');
    const [week, setWeek] = useState();
    const [weeks, setWeeks] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { data: fantasyGameResponse } = useQuery({
        queryKey: ['fantasyGames', league?.LeagueId, week],
        queryFn: async () => {
            if (!week) return [];
            return await fantasyGameLoader(league?.LeagueId, week);
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    useEffect(() => {
        setFantasyGames(mapFantasyGames(fantasyGameResponse));
    }, [fantasyGameResponse]);

    const { data: nflGameResponse } = useQuery({
        queryKey: ['nflGames', week],
        queryFn: async () => {
            if (!week) return [];
            return await nflGamesLoader(week);
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    const { data: lineupResponse } = useQuery({
        queryKey: ['lineups', league?.LeagueId, week],
        queryFn: async () => {
            if (!week) return [];
            return await lineupsLoader(league?.LeagueId, week);
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    const { data: scoringResponse } = useQuery({
        queryKey: ['scoring', league?.LeagueId, week],
        queryFn: async () => {
            if (!week) return [];
            return await scoringLoader(league?.LeagueId, week);
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    useEffect(() => {
        setCategoryData(mapCategoryScoring(scoringResponse));
    }, [scoringResponse]);

    useEffect(() => {
        setSummaryData(mapTeamScoringTotals(scoringResponse, lineupResponse, nflGameResponse));
        setIsLoading(false);
    }, [scoringResponse, lineupResponse, nflGameResponse]);

    useEffect(() => {
        if (summaryData?.totals?.length > 0)
            setUpdatedOn(`${summaryData?.createdDate?.toLocaleDateString()} ${summaryData?.createdDate?.toLocaleTimeString()}`);
    }, [summaryData]);

    useEffect(() => {
        setWeeks([...Array(nflWeekState.lineupWeek).keys()]?.sort((a, b) => b - a));
        if (nflWeekState?.lastScoredWeek)
            setWeek(nflWeekState.lastScoredWeek);
    }, [nflWeekState]);

    const handleClick = (selectedWeek) => {
        setIsLoading(true);
        setWeek(selectedWeek);
    }
    useEffect(() => {
        setTeamFantasyGame(fantasyGames.find((game) => game.HomeTeamId === team?.TeamId || game.AwayTeamId === team?.TeamId));
    }, [league, team, fantasyGames]);

    return (
        <Root title={`Scoring - Week ${week}`} subtitle={`Updated: ${updatedOn}`}>
            <PageToolbar title={'Scoring'} />
            <Box sx={{ pt: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, justifyContent: 'center' }} >
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
                    <ButtonGroup sx={{ mt: 1 }} variant="outlined" aria-label="outlined primary button group">
                        <Typography p={1}>Week:</Typography>
                        {weeks.map((i) => <Button key={i} variant={week === i + 1 ? "contained" : "outlined"} onClick={() => handleClick(i + 1)}>{i + 1}</Button>)}
                    </ButtonGroup>
                    <Typography variant="subtitle2" component="span" >
                        Updated: <Typography variant="caption" component="span">{updatedOn}</Typography>
                    </Typography>
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <FormControl fullWidth>
                        <InputLabel id="week-select-label">Week</InputLabel>
                        <Select
                            labelId="week-select-label"
                            id="Week"
                            value={week ? week : ''}
                            label="Week"
                            onChange={(event) => handleClick(event.target.value)}
                        >
                            {weeks.map((i) => (
                                <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {teamFantasyGame && !isLoading ?
                    (
                        <GameHeaderCard handleOpen={handleOpen} game={teamFantasyGame} showProjections={!summaryData.complete} />
                    )
                    : null}
            </Box>
            {
                isLoading ? (
                    <Skeleton variant="rectangular" height={48} />
                ) : (
                    <ScoringTabs team={team?.TeamId} data={categoryData} summaryData={summaryData.totals} week={week} showProjections={!summaryData.complete} />
                )
            }
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle id="alert-dialog-title" >
                    Game Results
                </DialogTitle>
                <DialogContent>
                    {fantasyGames.map((game) =>
                        <Paper key={game.FantasyGameId} sx={{ m: 1 }} elevation={8}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: grey[200] }}>
                                        <TableCell colSpan={3}>{!summaryData.complete ? 'Projected' : 'Final'}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableRow>
                                    <TableCell>{formatFantasyTeamName(game.HomeTeam, isBelowMedium)}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{game.HomeTotal.toFixed(1)}</TableCell>
                                    {!summaryData.complete ?
                                        <TableCell sx={{ textAlign: 'right' }}>{`(${game.ProjectedHomeTotal.toFixed(1)})`}</TableCell>
                                        : null}
                                </TableRow>
                                <TableRow >
                                    <TableCell>{formatFantasyTeamName(game.AwayTeam, isBelowMedium)}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{game.AwayTotal.toFixed(1)}</TableCell>
                                    {!summaryData.complete ?
                                        <TableCell sx={{ textAlign: 'right' }}>{`(${game.ProjectedAwayTotal.toFixed(1)})`}</TableCell>
                                        : null}
                                </TableRow >
                            </Table>
                        </Paper>
                    )}
                </DialogContent>
            </Dialog>
        </Root >

    )
}

export default withAuth(Scoring);