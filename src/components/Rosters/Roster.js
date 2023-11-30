import { Paper } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PlayerLink from "../common/PlayerLink";
import PlayerImage from "../common/PlayerImage";
import TeamLink from "../common/TeamLink";

export default function Roster({ roster }) {
  return (
    <TableContainer sx={{ maxWidth: 400, m: 1 }} component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
              <TeamLink team={roster?.team} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roster?.Players.map((player) => (
            <TableRow key={player.PlayerId}>
              <TableCell>{player.PositionCode}</TableCell>
              <TableCell>
                <PlayerImage
                  positionCode={player?.PositionCode}
                  nflTeamCode={player?.DisplayCode}
                  espnPlayerId={player.EspnPlayerId}
                  height={50}
                />
              </TableCell>
              <TableCell>
                <PlayerLink
                  playerId={player.PlayerId}
                  playerName={player.PlayerName}
                  positionCode={player.PositionCode}
                />
              </TableCell>
              <TableCell>{player.Name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
