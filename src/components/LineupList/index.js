import { Paper, Box, Button, ButtonGroup, Typography, Skeleton, Grid, Tabs, Tab, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
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
import TeamLink from "../common/TeamLink";
import { formatFantasyTeamName } from "../../utils/helpers";

function LineupList({ league, team, user }) {
    const { state: nflWeekState } = useContext(NflWeekContext);

    const [isLoading, setIsLoading] = useState(true);
    const [week, setWeek] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
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
        if (nflWeekState?.lineupWeek)
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
        console.log(newValue);
        setValue(newValue);
    };

    return (
        <Root title={'Lineups'}>
            <PageToolbar title={'Lineups'} />
            <Grid sx={{ m: 1 }} container spacing={2} justifyContent="center" alignItems="center">
                <ButtonGroup sx={{ display: { xs: 'none', md: 'flex' } }} variant="outlined" aria-label="outlined primary button group">
                    <Typography p={1}>Week:</Typography>
                    {weeks.map((i) => <Button key={i} variant={week === i + 1 ? "contained" : "outlined"} onClick={() => handleClick(i + 1)}>{i + 1}</Button>)}
                </ButtonGroup>
            </Grid>
            <Box
                sx={{
                    justifyContent: 'center',
                    flexGrow: 1,
                    display: { xs: 'flex', md: 'none' },
                    flexDirection: 'row',
                    p: 1,
                    gap: 1,
                }}
            >
                <FormControl fullWidth>
                    <InputLabel id="lineup-team-select-label">Team</InputLabel>
                    <Select
                        labelId="lineup-team-select-label"
                        id="LineupTeam"
                        value={lineups?.length > 0 ? value : ''}
                        label="Team"
                        onChange={(event) => handleChange(event, event.target.value)}
                    >
                        {lineups.map((lineup, index) => (
                            <MenuItem key={lineup.team.TeamId} value={index}>{`${lineup.team.OwnerName}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="lineup-week-select-label">Week</InputLabel>
                    <Select
                        labelId="lineup-week-select-label"
                        id="LineupWeek"
                        value={week > 0 ? week : ''}
                        label="Week"
                        onChange={(event) => handleClick(event.target.value)}
                    >
                        {weeks.map((i) => (
                            <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
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
                            flexDirection: { xs: 'column', md: 'row' },
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                                p: { xs: 0, md: 1 },
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
                                    <Tab key={lineup.team.TeamId} label={formatFantasyTeamName(lineup.team)} {...a11yProps(index)} />
                                ))}
                            </Tabs>
                        </Box>
                        {lineups.map((lineup, index) => (
                            <CustomTabPanel key={lineup.key} value={value} index={index}>
                                <TableContainer component={Paper}>
                                    <Table size="small" sx={{ minWidth: 400 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}></TableCell>
                                                <TableCell colSpan={2}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            flexDirection: 'column',
                                                        }}>
                                                        <TeamLink team={selectedTeam} />
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
                                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}></TableCell>
                                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}></TableCell>
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