import { Box, Button, Checkbox, CircularProgress, Divider, FormControl, FormGroup, FormHelperText, InputLabel, MenuItem, Select, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { useEffect, useState } from "react";
import { siteScheduleLoader, teamsLoader } from "../../api/graphql";
import withAuth from "../withAuth";
import { updateSize } from "../../api/ffl";
import { useNavigate } from "react-router-dom";

function EditLeagueSize({ league }) {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [teams, setTeams] = useState([]);
    const [playoffSchedules, setPlayoffSchedules] = useState([]);
    const [regularSchedules, setRegularSchedules] = useState([]);
    const [teamCount, setTeamCount] = useState(league?.NumberOfTeams);
    const [playoffSchedule, setPlayoffSchedule] = useState(league?.PlayoffScheduleId);
    const [regularSchedule, setRegularSchedule] = useState(league?.ScheduleId);
    const [teamsToRemove, setTeamsToRemove] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [isUpdating, setIsUpdating] = useState();

    useEffect(() => {
        let errors = [];

        if (teams?.length - teamsToRemove?.length > teamCount) {
            errors.push(`Select ${teams.length - teamCount} teams to remove`);
        }

        if (!regularSchedule) {
            errors.push(`Select regular season schedule`);
        }

        if (!playoffSchedule) {
            errors.push(`Select playoff schedule`);
        }

        setErrorList(errors)

    }, [teams, teamCount, teamsToRemove, regularSchedule, playoffSchedule]);

    useEffect(() => {
        const fetchSchedule = async (leagueId) => {
            const response = await siteScheduleLoader();
            setSchedules(response);
            const responseTeams = await teamsLoader(leagueId);
            setTeams(responseTeams);
        }
        fetchSchedule(league.LeagueId);
    }, [league]);

    useEffect(() => {
        const rs = schedules.filter((schedule) =>
            schedule.NumberOfTeams === teamCount && schedule.ScheduleType === 0);
        setRegularSchedules(rs);
    }, [schedules, teamCount]);

    useEffect(() => {
        const ps = schedules.filter((schedule) =>
            schedule.NumberOfTeams === teamCount && schedule.ScheduleType === 1);
        setPlayoffSchedules(ps);
    }, [schedules, teamCount]);

    const handleTeamCountChange = (e) => {
        setRegularSchedule();
        setPlayoffSchedule();
        setTeamCount(e.target.value);
    }

    const handleChange = (event) => {
        if (!event.target.checked) {
            const updatedTeams = teamsToRemove?.filter(teamId => +event.target.Id === teamId);
            setTeamsToRemove(updatedTeams);
        }
        else {
            setTeamsToRemove(teamsToRemove.concat(+event.target.id));
        }
    };

    const handleSave = async () => {
        let errors = [];
        setIsUpdating(true);
        const teams = teamsToRemove.map((team) => {
            return { TeamId: team }
        })
        const result = await updateSize(league.LeagueId,
            {
                NumberOfTeams: teamCount,
                ScheduleId: regularSchedule,
                PlayoffScheduleId: playoffSchedule,
                Teams: teams
            });
        setIsUpdating(false);
        if (result?.Message) {
            errors.push(result?.Message);
            setErrorList(errors)
        }
        else {
            navigate('/Settings');
        }
    };

    return (
        <Root title={'Change League Size'}>
            <PageToolbar title={'Change League Size'} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 2
            }}>
                <FormControl fullWidth>
                    <InputLabel id="team-count-select-label"># of Teams</InputLabel>
                    <Select
                        labelId="team-count-select-label"
                        id="team-count-select"
                        value={teamCount}
                        label="# of Teams"
                        onChange={handleTeamCountChange}
                    >
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={14}>14</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="schedule-select-label">Regular Season Schedule</InputLabel>
                    <Select
                        labelId="schedule-select-label"
                        id="schedule-select"
                        value={regularSchedules?.length > 0 ? regularSchedule : ''}
                        label="Regular Season Schedule"
                        onChange={(event) => setRegularSchedule(event.target.value)}
                    >
                        {regularSchedules?.map((regularSchedule) => <MenuItem key={regularSchedule.ScheduleId} value={regularSchedule.ScheduleId}>{regularSchedule.Description}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="playoff-schedule-select-label">Playoff Schedule</InputLabel>
                    <Select
                        labelId="playoff-schedule-select-label"
                        id="playoff-schedule-select"
                        value={playoffSchedules?.length > 0 ? playoffSchedule : ''}
                        label="Playoff Schedule"
                        onChange={(event) => setPlayoffSchedule(event.target.value)}
                    >
                        {playoffSchedules?.map((playoffSchedule) => <MenuItem key={playoffSchedule.ScheduleId} value={playoffSchedule.ScheduleId}>{playoffSchedule.Description}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>
            {league?.NumberOfTeams > teamCount ?
                <TableContainer sx={{ p: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2}>
                                Select Teams To Delete
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.map((team) =>
                            <TableRow key={team.TeamId}>
                                <TableCell>
                                    <FormGroup>
                                        <Checkbox id={team.TeamId} name={team.TeamId} onChange={handleChange} />
                                    </FormGroup>
                                </TableCell>
                                <TableCell>
                                    {team.TeamName}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </TableContainer>
                : null}
            <Divider />
            <Button
                variant="contained"
                sx={{ mt: 1, ml: 1 }}
                onClick={handleSave}
                disabled={errorList.length > 0}
            >
                Save
            </Button>
            <Button
                variant="contained"
                sx={{ mt: 1, ml: 1 }}
                to={`/Settings`}
            >
                Cancel
            </Button>
            {isUpdating ? <CircularProgress /> : null}
            <FormControl required error={errorList.length > 0}>
                {errorList.map(error =>
                    <FormHelperText>{error}</FormHelperText>
                )}
            </FormControl>
        </Root>
    )
}
export default withAuth(EditLeagueSize);