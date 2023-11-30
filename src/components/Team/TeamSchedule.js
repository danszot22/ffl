import { Paper } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableHeaderRow } from "../common/styled";
import TeamLink from "../common/TeamLink";

export default function TeamSchedule({ games }) {
  if (!games) return <></>;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <StyledTableHeaderRow>
            <TableCell colSpan={4}>Team Schedule</TableCell>
          </StyledTableHeaderRow>
          <TableRow>
            <TableCell>Wk</TableCell>
            <TableCell>Opponent</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="left">Record</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(games)?.map((gameWeek) => (
            <TableRow key={gameWeek.Game.FantasyGameId}>
              <TableCell>{gameWeek.Week}</TableCell>
              <TableCell>
                <TeamLink team={gameWeek.Game.Opponent} />
              </TableCell>
              <TableCell align="right" sx={{ p: { xs: 0, sm: 0 } }}>
                {gameWeek.Game.Result > " "
                  ? `(${gameWeek.Game.Result}) `
                  : " "}
                {gameWeek.Game.PointTotal > 0
                  ? gameWeek.Game.PointTotal.toFixed(1)
                  : gameWeek.Game.ProjectedTotal > 0
                  ? `(${gameWeek.Game.ProjectedTotal.toFixed(1)})`
                  : " "}
                {gameWeek.Game.Result > " " ? "-" : " "}
                {gameWeek.Game.Opponent.PointTotal > 0
                  ? gameWeek.Game.Opponent.PointTotal.toFixed(1)
                  : gameWeek.Game.Opponent.ProjectedTotal > 0
                  ? `(${gameWeek.Game.Opponent.ProjectedTotal.toFixed(1)})`
                  : " "}
              </TableCell>
              <TableCell>
                {gameWeek.Game.Complete
                  ? `${gameWeek.Wins}-${gameWeek.Losses}-${gameWeek.Ties}`
                  : gameWeek.Game.Opponent.PointTotal > 0
                  ? "In Progress"
                  : gameWeek.Game.Opponent.ProjectedTotal > 0
                  ? "Projected"
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
