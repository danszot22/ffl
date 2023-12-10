import { Typography, Tooltip, Box, IconButton } from "@mui/material";
import { TableBody, TableCell, TableRow } from "@mui/material";
import {
  playerStatuses,
  formatDateToMonthYear,
  numberOfDaysSinceDate,
} from "../../utils/helpers";
import { Delete, Info, PersonRemove } from "@mui/icons-material";
import PlayerImage from "../common/PlayerImage";
import PlayerLink from "../common/PlayerLink";
import FormattedPlayerStats from "../common/FormattedPlayerStats";

export default function TeamRosterPlayers({
  roster,
  teamDetails,
  team,
  isEditable,
  handleDelete,
  handleClick,
}) {
  return (
    <TableBody>
      {roster?.map((player, index) => (
        <TableRow
          sx={{
            borderTop:
              index > 0 && player?.Group !== roster[index - 1]?.Group ? 3 : 1,
          }}
          key={player.PlayerId}
        >
          <TableCell>
            <PlayerImage
              positionCode={player?.PositionCode}
              nflTeamCode={player?.DisplayCode}
              espnPlayerId={player.EspnPlayerId}
            />
          </TableCell>
          <TableCell>
            <PlayerLink
              playerId={player.PlayerId}
              playerName={player.PlayerName}
              positionCode={player.PositionCode}
              xsOnly={true}
            />
            {` ${player.PositionCode} ${player.DisplayCode}`}
            <Typography sx={{ display: { xs: "block", sm: "none" } }}>
              {player.StatusDescription?.length > 0 ? (
                <Tooltip component="span" title={player.StatusDescription}>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Typography variant="caption" sx={{ pr: 1 }}>
                      {playerStatuses[player.StatusCode]}
                    </Typography>
                    <Info />
                  </Box>
                </Tooltip>
              ) : null}
            </Typography>
          </TableCell>
          <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
            <FormattedPlayerStats player={player} />
          </TableCell>
          <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
            {player.StatusCode ? (
              <Tooltip
                component="span"
                title={
                  player.StatusDescription?.length > 0
                    ? player.StatusDescription
                    : playerStatuses[player.StatusCode]
                }
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Typography variant="caption" sx={{ pr: 1 }}>
                    {playerStatuses[player.StatusCode]}{" "}
                    {formatDateToMonthYear(player.InjuryDate)}
                  </Typography>
                  <Info />
                </Box>
              </Tooltip>
            ) : null}
          </TableCell>
          <TableCell>{player.ByeWeek}</TableCell>
          <TableCell sx={{ p: { xs: 0, sm: 1 } }}>
            {team?.TeamId === teamDetails?.TeamId &&
            (teamDetails?.AvlAddDrops > 0 ||
              (player.StatusCode === 1 &&
                numberOfDaysSinceDate(player.InjuryDate) < 15)) ? (
              <Tooltip title="Drop">
                <IconButton
                  variant="contained"
                  color="error"
                  onClick={() => handleClick(player)}
                >
                  <PersonRemove />
                </IconButton>
              </Tooltip>
            ) : null}
            {isEditable ? (
              <Tooltip title="Delete">
                <IconButton
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(player)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            ) : null}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
