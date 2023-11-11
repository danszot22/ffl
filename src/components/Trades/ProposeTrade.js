import { useState, useEffect } from "react";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { leaguePlayersLoader, teamsLoader } from "../../api/graphql";
import { mapToRosterList } from "../../utils/parsers";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TeamRoster from "./TeamRoster";
import withAuth from "../withAuth";
import { formatFantasyTeamName } from "../../utils/helpers";

function ProposeTrade({ league, team }) {
    const [rosters, setRosters] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamRoster, setTeamRoster] = useState([]);
    const [proposedTeamRoster, setProposedTeamRoster] = useState([]);
    const [proposedTeam, setProposedTeam] = useState({});
    const [givingPlayers, setGivingPlayers] = useState([]);
    const [receivingPlayers, setReceivingPlayers] = useState([]);

    useEffect(() => {
        setProposedTeamRoster(rosters.find(rosterPlayer => rosterPlayer?.team.TeamId === proposedTeam));
    }, [
        proposedTeam,
        rosters
    ]);

    useEffect(() => {
        const fetchTeams = async (leagueId, teamId) => {
            const response = await teamsLoader(leagueId);
            setTeams(response.filter((team) => team.TeamId !== teamId));
        }
        fetchTeams(league?.LeagueId, team?.TeamId);
    }, [
        team?.TeamId,
        league?.LeagueId
    ]);

    useEffect(() => {
        setTeamRoster(rosters.find(rosterPlayer => rosterPlayer?.team.TeamId === team?.TeamId));
    }, [
        team?.TeamId,
        rosters,
    ]);

    useEffect(() => {
        const fetchPlayers = async (leagueId, teamId) => {
            try {
                const response = await leaguePlayersLoader(leagueId, "All", "OnRosters", 1, 1000, 1, "All", "All", " ", "PositionId", "ASC");
                setRosters(mapToRosterList(response, teamId));

            } catch (error) {
                console.error(error);
                return;
            }
        }
        fetchPlayers(league?.LeagueId, team?.TeamId);
    }, [
        team?.TeamId,
        league?.LeagueId,
    ]);

    const handleChange = (event) => {
        setProposedTeam(event.target.value);
        setReceivingPlayers([]);
    };

    const handleSubmit = (event) => {
        //TODO : Call API
        console.log(givingPlayers, receivingPlayers);
    };

    const handlePlayerChange = (event) => {
        //TODO : Call API
        const player = teamRoster?.Players?.find(rosterPlayer => +event.target.name === rosterPlayer.RosterPlayerId);
        if (player) {
            if (event.target.checked) {
                setGivingPlayers(givingPlayers.concat(player));
            }
            else {
                const players = givingPlayers.filter((rp) =>
                    rp.RosterPlayerId !== +event.target.name
                )
                setGivingPlayers(players);
            }
        }
        const proposedPlayer = proposedTeamRoster?.Players?.find(rosterPlayer => +event.target.name === rosterPlayer.RosterPlayerId);
        if (proposedPlayer) {
            if (event.target.checked) {
                setReceivingPlayers(receivingPlayers.concat(proposedPlayer));
            }
            else {
                const players = receivingPlayers.filter((rp) =>
                    rp.RosterPlayerId !== +event.target.name
                )
                setReceivingPlayers(players);
            }
        }
    };

    return (
        <Root>
            <PageToolbar title="Propose Trade" />
            <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">Trade With</InputLabel>
                <Select
                    labelId="trade-with-select-label"
                    id="trade-with-select"
                    value={proposedTeam}
                    label="Trade With"
                    onChange={handleChange}
                >
                    {teams.map((team) => (<MenuItem key={team.TeamId} value={team.TeamId}>{formatFantasyTeamName(team)}</MenuItem>))}
                </Select>
            </FormControl>
            <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
                <TeamRoster roster={teamRoster} handlePlayerChange={handlePlayerChange} />
                <TeamRoster roster={proposedTeamRoster} handlePlayerChange={handlePlayerChange} />
            </Box>
            <Button onClick={handleSubmit} variant="contained">Submit</Button>
            <Button
                variant="contained"
                sx={{ ml: 1 }}
                to={`/TeamTrades/${team?.TeamId}`}
            >
                Cancel
            </Button>
        </Root>
    )
}

export default withAuth(ProposeTrade);