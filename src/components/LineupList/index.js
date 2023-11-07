import { Paper, Box, Button, ButtonGroup, Typography, Skeleton, Grid, Tabs, Tab, Link } from "@mui/material";
import { Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState, useEffect, useContext } from 'react';
import Root from '../Root';
import { lineupsLoader, nflGamesLoader, scoringLoader } from '../../api/graphql';
import { mapToLineupList, mapTeamScoringTotals } from "../../utils/parsers";
import { a11yProps, CustomTabPanel } from "../common/CustomTabPanel";
import { grey } from '@mui/material/colors';
import { NflWeekContext } from "../../contexts/NflWeekContext";
import PageToolbar from "../common/PageToolbar";
import LineupPlayers from "./LineupPlayers";
import withAuth from "../withAuth";

function LineupList({ league, team, user }) {
    const { state: nflWeekState } = useContext(NflWeekContext);

    const [isLoading, setIsLoading] = useState(true);
    const [week, setWeek] = useState();
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [lineups, setLineups] = useState([]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const fetchLineups = async (leagueId, lineupWeek) => {
            setIsLoading(true);
            const lineupResponse = await lineupsLoader(leagueId, lineupWeek);
            const scoringResponse = await scoringLoader(leagueId, lineupWeek);
            const nflGameResponse = await nflGamesLoader(lineupWeek);
            const scoring = mapTeamScoringTotals(scoringResponse);
            setLineups(mapToLineupList(lineupResponse, scoring, nflGameResponse, team?.TeamId));
            setIsLoading(false);
        }
        fetchLineups(league?.LeagueId, week);
    }, [week, league, team]);

    useEffect(() => {
        setWeeks([...Array(nflWeekState.lineupWeek).keys()]);
        setWeek(nflWeekState.lineupWeek);
    }, [nflWeekState]);

    useEffect(() => {
        setSelectedTeam(lineups[value]?.team);
    }, [value, lineups]);

    const handleClick = (selectedWeek) => {
        setWeek(selectedWeek);
        setValue(0);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Root>
            <PageToolbar title={'Lineups'} />
            <Grid sx={{ m: 1 }} container spacing={2} justifyContent="center" alignItems="center">
                <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                    <Typography p={1}>Week:</Typography>
                    {weeks.map((i) => <Button key={i} variant={week === i + 1 ? "contained" : "outlined"} onClick={() => handleClick(i + 1)}>{i + 1}</Button>)}
                </ButtonGroup>
            </Grid>

            {
                isLoading ? (
                    <Skeleton variant="rectangular" height={48} />
                ) : (
                    <Box
                        sx={{
                            justifyContent: 'center',
                            flexGrow: 1,
                            bgcolor: (theme) => theme.palette.mode === 'light' ? grey[100] : grey[700],
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                textAlign: 'center',
                            }}
                        >
                            <Typography sx={{ width: 1, bgcolor: (theme) => theme.palette.mode === 'light' ? grey[300] : grey[700] }} p={1}>Select Team</Typography>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={value}
                                onChange={handleChange}
                                aria-label="lineups"
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                            >
                                {lineups.map((lineup, index) => (
                                    <Tab key={lineup.team.TeamId} label={`${lineup.team.TeamName} (${lineup.team.OwnerName})`} {...a11yProps(index)} />
                                ))}
                            </Tabs>
                        </Box>
                        {lineups.map((lineup, index) => (
                            <CustomTabPanel key={lineup.key} value={value} index={index}>
                                <TableContainer component={Paper}>
                                    <Table size="small" sx={{ minWidth: 400 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            flexDirection: 'column',
                                                        }}>
                                                        <Link to={`/Team/${selectedTeam?.TeamId}`}>{selectedTeam?.TeamName} ({selectedTeam?.OwnerName})</Link>
                                                        {!selectedTeam?.complete ?
                                                            <Typography variant="caption">Projected: {selectedTeam?.projectedScore.toFixed(1)} </Typography>
                                                            : null
                                                        }
                                                        {!selectedTeam?.complete && team?.score > 0 ?
                                                            <Typography variant="caption">Actual: {selectedTeam?.score.toFixed(1)} </Typography>
                                                            : null
                                                        }
                                                        {selectedTeam?.complete ?
                                                            <Typography variant="caption">Finished: {selectedTeam?.score.toFixed(1)} </Typography>
                                                            : null
                                                        }
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {(team?.TeamId === selectedTeam?.TeamId && nflWeekState.lineupWeek === week) ||
                                                        (user?.isAdmin || user?.isCommissioner) ?
                                                        <Button
                                                            variant="outlined"
                                                            sx={{ ml: 1 }}
                                                            to={`/Lineup/Edit/${selectedTeam?.TeamId}?week=${week}`}
                                                        >
                                                            Edit
                                                        </Button>
                                                        : null}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <LineupPlayers players={lineup.Starters} />
                                    </Table>
                                </TableContainer>
                            </CustomTabPanel>
                        ))}
                    </Box>
                )
            }
        </Root>
    );
}

export default withAuth(LineupList);