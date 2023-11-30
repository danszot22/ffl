import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Root from "../Root";
import { leaguePlayersLoader } from "../../api/graphql";
import PageToolbar from "../common/PageToolbar";
import { Box } from "@mui/material";
import AddPlayers from "./AddPlayers";
import withAuth from "../withAuth";

function RosterPlayerDrop({ league, team }) {
  const navigate = useNavigate();
  const { rosterPlayerId } = useParams();
  const [rosterPlayer, setRosterPlayer] = useState();

  useEffect(() => {
    const fetchData = async () => {
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
      setRosterPlayer(
        response.find(
          (rosterPlayer) => rosterPlayer?.RosterPlayerId === +rosterPlayerId
        )
      );
    };
    if (rosterPlayerId) {
      fetchData();
    } else {
      navigate("/Team");
    }
  }, [rosterPlayerId, league?.LeagueId, navigate]);

  return (
    <Root title={"Drop Player"}>
      <PageToolbar title={"Drop Player"} />
      <Box
        sx={{
          p: 1,
          m: 1,
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {rosterPlayer?.PositionCode?.startsWith("TM") ? (
          <img
            alt={rosterPlayer?.DisplayCode}
            height={100}
            src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${rosterPlayer?.DisplayCode}.png&h=150&w=150`}
            loading="lazy"
            style={{ borderRadius: "50%" }}
          />
        ) : rosterPlayer?.EspnPlayerId ? (
          <img
            alt="?"
            height={100}
            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${rosterPlayer.EspnPlayerId}.png&h=120&w=120&scale=crop`}
            loading="lazy"
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <img
            alt="?"
            height={100}
            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=120&h=120&scale=crop`}
            loading="lazy"
            style={{ borderRadius: "50%" }}
          />
        )}
        <Box
          sx={{
            p: 1,
            m: 1,
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <div>{rosterPlayer?.PlayerName}</div>
          <div>{rosterPlayer?.PositionCode}</div>
          <div>{rosterPlayer?.DisplayCode}</div>
        </Box>
      </Box>
      <AddPlayers
        teamId={team?.TeamId}
        rosterPlayerToDrop={rosterPlayer}
        leagueId={league?.LeagueId}
      />
    </Root>
  );
}

export default withAuth(RosterPlayerDrop);
