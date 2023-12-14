import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Root from "../Root";
import { Box, Skeleton } from "@mui/material";
import PageToolbar from "../common/PageToolbar";
import { playerLoader, leaguePlayersLoader } from "../../api/graphql";
import { getRosterPlayersToDrop } from "../../api/ffl";
import { mapToRosterList } from "../../utils/parsers";
import DropRosterPlayers from "./DropRosterPlayers";
import withAuth from "../withAuth";

function RosterPlayerAdd({ league, team }) {
  const { playerId } = useParams();
  const [player, setPlayer] = useState([]);
  const [rosterPlayers, setRosterPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlayer = async (teamId, playerId) => {
      setIsLoading(true);
      const response = await playerLoader(playerId);
      setPlayer(response);
      const responsePlayerIds = await getRosterPlayersToDrop(
        league?.LeagueId,
        team?.TeamId,
        playerId
      );
      const responseRosters = await leaguePlayersLoader(
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
      setRosterPlayers(
        mapToRosterList(responseRosters, teamId)
          .find((rosterPlayer) => rosterPlayer?.team.TeamId === teamId)
          ?.Players.filter((rosterPlayer) =>
            responsePlayerIds.includes(rosterPlayer?.RosterPlayerId)
          )
      );
      setIsLoading(false);
    };
    fetchPlayer(team?.TeamId, playerId);
  }, [league?.LeagueId, team?.TeamId, playerId]);

  return (
    <Root title={"Add Player"}>
      <PageToolbar title={"Add Player"} />
      <Box
        sx={{
          p: 1,
          m: 1,
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {player?.Position?.PositionCode?.startsWith("TM") ? (
          <img
            alt={player?.NflTeam?.DisplayCode}
            height={100}
            src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${player?.NflTeam?.DisplayCode}.png&h=150&w=150`}
            loading="lazy"
            style={{ borderRadius: "50%" }}
          />
        ) : player?.EspnPlayerId ? (
          <img
            alt="?"
            height={100}
            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.EspnPlayerId}.png&h=120&w=120&scale=crop`}
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
          <div>{player?.Name}</div>
          <div>{player?.Position?.PositionCode}</div>
          <div>{player?.NflTeam?.DisplayName}</div>
        </Box>
      </Box>
      {isLoading ? (
        <Skeleton sx={{ p: 1 }} variant="rectangular" height={40}>
          Analyzing Roster...
        </Skeleton>
      ) : (
        <DropRosterPlayers
          leagueId={league?.LeagueId}
          team={team}
          roster={rosterPlayers}
          playerToAdd={player}
        />
      )}
    </Root>
  );
}

export default withAuth(RosterPlayerAdd);
