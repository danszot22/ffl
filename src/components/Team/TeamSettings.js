import { useLocation, useNavigate, useParams } from "react-router-dom";
import Root from "../Root";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import { updateTeam } from "../../api/ffl";

function TeamSettings({ league, team }) {
  const { state } = useLocation();
  const { leagueId } = useParams();
  const [ownerName, setOwnerName] = useState(state?.OwnerName);
  const [teamName, setTeamName] = useState(state?.TeamName);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (league?.LeagueId && +leagueId !== league?.LeagueId) {
      if (!team?.TeamId) navigate("/");
      else navigate("/Team");
    }
  }, [navigate, leagueId, league?.LeagueId, team?.TeamId]);

  const handleSave = async () => {
    setMessage();
    setIsUpdating(true);
    const result = await updateTeam(team?.TeamId, { ownerName, teamName });
    setIsUpdating(false);
    if (result?.Message) {
      setMessage(result?.Message);
    } else {
      navigate("/Team");
    }
  };

  return (
    <Root>
      <PageToolbar title={"Team Settings"} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 2,
          maxWidth: 600,
        }}
      >
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
      <Button variant="contained" sx={{ ml: 1 }} onClick={handleSave}>
        Save
      </Button>
      <Button variant="contained" sx={{ ml: 1 }} to={`/Team/${state?.TeamId}`}>
        Cancel
      </Button>
      {isUpdating ? <CircularProgress /> : null}
      <Typography color="error">{message}</Typography>
    </Root>
  );
}

export default withAuth(TeamSettings);
