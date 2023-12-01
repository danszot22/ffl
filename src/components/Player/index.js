import Root from "../Root";
import { useParams } from "react-router-dom";
import {
  playerLoader,
  teamPositionPlayerLoader,
  allNflGamesLoader,
} from "../../api/graphql";
import { playerNewsLoader } from "../../api/espnData";
import { Fragment, useContext, useEffect, useState } from "react";
import PageToolbar from "../common/PageToolbar";
import { mapPlayerDetails, mapTeamPlayerDetails } from "../../utils/parsers";
import { convertDateToLocal } from "../../utils/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import PlayerStatisticRow from "./PlayerStatisticRow";
import TeamPlayerStatisticRow from "./TeamPlayerStatisticRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import { NflWeekContext } from "../../contexts/NflWeekContext";
import withAuth from "../withAuth";

function Player({ user }) {
  const { state: nflWeekState } = useContext(NflWeekContext);
  const { id } = useParams();
  const [player, setPlayer] = useState([]);
  const [playerResponse, setPlayerResponse] = useState();
  const [teamPlayerResponse, setTeamPlayerResponse] = useState();
  const [allGames, setAllGames] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [playerNews, setPlayerNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPlayerNews = async () => {
      setIsLoading(true);
      if (
        player?.Player?.EspnPlayerId &&
        player?.Player?.NflTeam?.ExternalCode &&
        nflWeekState?.seasonYear
      ) {
        setPlayerNews(
          await playerNewsLoader(
            nflWeekState?.seasonYear,
            player?.Player?.EspnPlayerId,
            player?.Player?.NflTeam?.ExternalCode
          )
        );
      }
      setIsLoading(false);
    };
    fetchPlayerNews();
  }, [nflWeekState?.seasonYear, player]);

  useEffect(() => {
    const fetchTeamPlayers = async (player) => {
      if (player.Position?.PositionCode.startsWith("TM")) {
        const position = player.Position?.PositionCode.replace("TM", "");
        setTeamPlayerResponse(
          await teamPositionPlayerLoader(player?.NflTeam?.NflTeamId, position)
        );
      }
    };
    if (playerResponse) fetchTeamPlayers(playerResponse);
  }, [playerResponse]);

  useEffect(() => {
    const fetchPlayer = async (playerId) => {
      setPlayerResponse(await playerLoader(playerId));
    };
    fetchPlayer(id);
  }, [id, user]);

  useEffect(() => {
    const mapPlayer = async () => {
      if (allGames && playerResponse) {
        setPlayer(mapPlayerDetails(playerResponse, allGames));
      }
      if (allGames && teamPlayerResponse) {
        const games = allGames.filter(
          (game) =>
            game.AwayTeam.NflTeamId === playerResponse?.NflTeam?.NflTeamId ||
            game.HomeTeam.NflTeamId === playerResponse?.NflTeam?.NflTeamId
        );
        setTeamPlayers(mapTeamPlayerDetails(teamPlayerResponse, games));
      }
    };
    mapPlayer();
  }, [allGames, teamPlayerResponse, playerResponse]);

  useEffect(() => {
    const getAllGames = async () => {
      setAllGames(await allNflGamesLoader());
    };
    getAllGames();
  }, [user]);

  return (
    <Root title={"Player Details"}>
      <PageToolbar title={"Player Details"} />
      <Box
        sx={{
          p: 1,
          m: 1,
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {player?.Player?.Position?.PositionCode?.startsWith("TM") ? (
          <img
            alt={player?.Player?.NflTeam?.DisplayCode}
            height={100}
            src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${player?.Player?.NflTeam?.DisplayCode}.png&h=150&w=150`}
            loading="lazy"
            style={{ borderRadius: "50%" }}
          />
        ) : player?.Player?.EspnPlayerId ? (
          <img
            alt="?"
            height={100}
            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.Player.EspnPlayerId}.png&h=120&w=120&scale=crop`}
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
          <div>{player?.Player?.Name}</div>
          <div>{player?.Player?.Position?.PositionCode}</div>
          <div>{player?.Player?.NflTeam.DisplayName}</div>
          {isLoading ? (
            <Skeleton sx={{ p: 1 }} variant="rectangular" height={40}>
              Loading...
            </Skeleton>
          ) : (
            playerNews?.map((playerNewsItem) => (
              <Box key={playerNewsItem.id}>
                <Typography>{playerNewsItem.shortComment}</Typography>
                <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                  {playerNewsItem.longComment}
                </Typography>
                <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                  {convertDateToLocal(playerNewsItem.date).toLocaleDateString()}{" "}
                  {convertDateToLocal(playerNewsItem.date).toLocaleTimeString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Week</TableCell>
              <TableCell>Opponent</TableCell>
              <TableCell>
                {["QB"].includes(player?.Player?.Position?.PositionCode)
                  ? "PassYds"
                  : "RB" === player?.Player?.Position?.PositionCode
                  ? "RushYds"
                  : ["WR", "TE"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "RecYds"
                  : ["PK"].includes(player?.Player?.Position?.PositionCode)
                  ? "FgYds"
                  : ["S", "CB", "LB", "DE", "DT"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "Tackles"
                  : " "}
              </TableCell>
              <TableCell>
                {["QB"].includes(player?.Player?.Position?.PositionCode)
                  ? "PassTds"
                  : "RB" === player?.Player?.Position?.PositionCode
                  ? "RushTds"
                  : ["WR", "TE"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "RecTds"
                  : ["PK"].includes(player?.Player?.Position?.PositionCode)
                  ? "XPs"
                  : ["S", "CB", "LB", "DE", "DT"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "Solo"
                  : " "}
              </TableCell>
              <TableCell>
                {["QB"].includes(player?.Player?.Position?.PositionCode)
                  ? "PassInts"
                  : "RB" === player?.Player?.Position?.PositionCode
                  ? "RecYds"
                  : ["WR", "TE"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "RushYds"
                  : ["S", "CB", "LB", "DE", "DT"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "Sacks"
                  : " "}
              </TableCell>
              <TableCell>
                {["QB"].includes(player?.Player?.Position?.PositionCode)
                  ? "RushYds"
                  : "RB" === player?.Player?.Position?.PositionCode
                  ? "RecTds"
                  : ["WR", "TE"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "RushTds"
                  : ["S", "CB", "LB", "DE", "DT"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "DefInts"
                  : " "}
              </TableCell>
              <TableCell>
                {["QB"].includes(player?.Player?.Position?.PositionCode)
                  ? "RushTds"
                  : ["S", "CB", "LB", "DE", "DT"].includes(
                      player?.Player?.Position?.PositionCode
                    )
                  ? "DefTds"
                  : " "}
              </TableCell>
              {player?.Player?.Position?.PositionCode === "TMQB" ||
              player?.Player?.Position?.PositionCode === "TMPK" ? (
                <TableCell>
                  {open ? "Hide Players" : "Show Players"}
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {player?.Player?.Position?.PositionCode === "TMQB" ||
            player?.Player?.Position?.PositionCode === "TMPK"
              ? Object.values(teamPlayers).map((teamPlayer) => (
                  <TeamPlayerStatisticRow
                    key={teamPlayer.Game.NflGameId}
                    open={open}
                    player={player}
                    game={teamPlayer.Game}
                    teamPlayers={teamPlayer.Players}
                  />
                ))
              : player?.Statistics?.map((statistic, index) => {
                  return (
                    <Fragment key={statistic.Game.NflGameId}>
                      {index > 0 &&
                      player?.Statistics[index - 1].Game?.PlayerNflTeam
                        .NflTeamId !==
                        statistic.Game.PlayerNflTeam?.NflTeamId ? (
                        <TableRow>
                          <TableCell colSpan={7}>{`Previously with ${
                            player?.Statistics[index - 1].Game?.PlayerNflTeam
                              ?.DisplayCode
                          }, Acquired by ${
                            statistic.Game.PlayerNflTeam?.DisplayCode
                          }`}</TableCell>
                        </TableRow>
                      ) : null}
                      <PlayerStatisticRow
                        playerNflTeam={statistic.Game.PlayerNflTeam}
                        player={player}
                        statistic={statistic}
                      />
                    </Fragment>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default withAuth(Player);
