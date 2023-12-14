import Root from "../Root";
import { useNavigate, useParams } from "react-router-dom";
import {
  teamLoader,
  leaguePlayersLoader,
  teamScheduleLoader,
  teamTransactionsLoader,
  teamWaiverRequestsLoader,
} from "../../api/graphql";
import { useEffect, useState } from "react";
import PageToolbar from "../common/PageToolbar";
import { Box, Typography, Button, Divider, Link } from "@mui/material";
import TeamRoster from "./TeamRoster";
import TeamSchedule from "./TeamSchedule";
import TeamTransactions from "./TeamTransactions";
import { mapToRosterList, mapToTeamGameList } from "../../utils/parsers";
import withAuth from "../withAuth";

function Team({ league, team, user }) {
  const { id } = useParams();
  const [teamDetails, setTeamDetails] = useState({});
  const [roster, setRoster] = useState();
  const [schedule, setSchedule] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [waivers, setWaivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      league?.LeagueId &&
      teamDetails?.LeagueId &&
      league?.LeagueId !== teamDetails?.LeagueId
    ) {
      if (!team.TeamId) navigate("/");
      else navigate("/Team");
    }
  }, [navigate, team?.TeamId, league?.LeagueId, teamDetails?.LeagueId]);

  useEffect(() => {
    const fetchTeam = async (teamId) => {
      const teamResponse = await teamLoader(teamId);
      setTeamDetails(teamResponse);
      const scheduleResponse = await teamScheduleLoader(teamId);
      setSchedule(mapToTeamGameList(scheduleResponse, teamId));
      const waiverResponse = await teamWaiverRequestsLoader(teamId, 0);
      setWaivers(waiverResponse);
      const transactionResponse = await teamTransactionsLoader(teamId);
      setTransactions(transactionResponse);
      const response = await leaguePlayersLoader(
        league?.LeagueId,
        "All",
        "OnRosters",
        1,
        1000,
        1,
        "All",
        "All",
        " ",
        "PositionId",
        "ASC"
      );
      setRoster(
        mapToRosterList(response, teamId).find(
          (rosterPlayer) => rosterPlayer?.team.TeamId === teamId
        )
      );
    };
    fetchTeam(Number.isInteger(+id) ? +id : team?.TeamId);
  }, [id, team?.TeamId, league?.LeagueId]);

  function handleGoToTeamSettings() {
    navigate(`/TeamSettings/${teamDetails?.LeagueId}/${teamDetails?.TeamId}`, {
      state: { ...teamDetails },
    });
  }

  return (
    <Root title={"Team Details"}>
      <PageToolbar title={"Team Details"} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-evenly",
          p: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", lg: "column" },
          }}
        >
          <Typography
            sx={{
              ml: 1,
              fontWeight: 700,
              minWidth: { xs: 200 },
            }}
          >
            Team
          </Typography>
          <Typography
            sx={{
              ml: 1,
            }}
          >
            {teamDetails?.TeamName} - {teamDetails?.OwnerName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", lg: "column" },
          }}
        >
          <Typography
            sx={{
              ml: 1,
              fontWeight: 700,
              minWidth: { xs: 200 },
            }}
          >
            # Add/Drops
          </Typography>
          <Typography
            sx={{
              ml: 1,
            }}
          >
            {teamDetails?.AvlAddDrops}
          </Typography>
        </Box>
        {waivers?.length > 0 && team?.TeamId === teamDetails?.TeamId ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", lg: "column" },
            }}
          >
            <Typography
              sx={{
                ml: 1,
                fontWeight: 700,
                minWidth: { xs: 200 },
              }}
            >
              Waivers
            </Typography>
            <Typography
              sx={{
                ml: 1,
              }}
            >
              <Link to={`/WaiverRequests/`}>
                {`${waivers?.length}`} pending
              </Link>
            </Typography>
          </Box>
        ) : null}
        {team?.TeamId === teamDetails?.TeamId ||
        user?.isAdmin ||
        user?.isCommissioner ? (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "row", lg: "column" },
            }}
          >
            <Button
              sx={{ maxWidth: 300 }}
              variant="contained"
              onClick={handleGoToTeamSettings}
            >
              Change Name
            </Button>
            {team?.TeamId === teamDetails?.TeamId ? (
              <Button
                sx={{ maxWidth: 300 }}
                variant="contained"
                to={`/TeamTrades`}
              >
                Trade Proposals
              </Button>
            ) : null}
          </Box>
        ) : null}
      </Box>

      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "center",
          gap: 5,
          p: { xs: 0, sm: 1 },
          m: { xs: 0, sm: 1 },
        }}
      >
        <TeamRoster
          roster={roster}
          teamDetails={teamDetails}
          isEditable={user?.isAdmin || user?.isCommissioner}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <TeamTransactions transactions={transactions} />
          <TeamSchedule games={schedule} />
        </Box>
      </Box>
    </Root>
  );
}

export default withAuth(Team);
