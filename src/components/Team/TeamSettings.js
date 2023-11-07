import { useLocation, useNavigate, useParams } from "react-router-dom";
import Root from "../Root";
import { Box, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";

function TeamSettings({ league, team }) {
    const { state } = useLocation();
    const { leagueId } = useParams();
    const [ownerName, setOwnerName] = useState(state?.OwnerName);
    const [teamName, setTeamName] = useState(state?.TeamName);
    const navigate = useNavigate();

    useEffect(() => {
        if (+leagueId !== league?.LeagueId) {
            if (!team.TeamId)
                navigate('/');
            else
                navigate('/Team');
        }
    }, [navigate, leagueId, league?.LeagueId, team.TeamId]);


    const handleSave = (event) => {
        //TODO : Call API
        console.log(state, ownerName, teamName);
    };

    return (
        <Root>
            <PageToolbar title={'Team Settings'} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 2,
                maxWidth: 600
            }}>
                <TextField
                    id="outlined-controlled"
                    label="Owner"
                    value={ownerName}
                    onChange={(event) => setOwnerName(event.target.value)}
                />
                <TextField
                    id="outlined-controlled"
                    label="Team"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                />
            </Box>
            <Button
                variant="contained"
                sx={{ ml: 1 }}
                onClick={handleSave}
            >
                Save
            </Button>
            <Button
                variant="contained"
                sx={{ ml: 1 }}
                to={`/Team/${state?.TeamId}`}
            >
                Cancel
            </Button>
        </Root>)
}

export default withAuth(TeamSettings);