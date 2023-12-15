import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PlayerRow from "./PlayerRow";
import { grey } from "@mui/material/colors";

export default function PlayerList({
  players,
  showProjections,
  title,
  showGame,
}) {
  return (
    <Paper sx={{ minWidth: { xs: 300, md: 500 } }} elevation={3}>
      <Table size="small" aria-label="players">
        <TableHead>
          <TableRow>
            <TableCell>{title}</TableCell>
            <TableCell align="right">Total</TableCell>
            {showProjections ? (
              <TableCell align="right">Projected</TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {players?.length > 0 ? (
            players.map((player) => (
              <PlayerRow
                key={player.PlayerId}
                row={player}
                showGame={showGame}
                showProjections={showProjections}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                variant="caption"
                scope="row"
                colSpan={4}
                sx={{ pl: 0, backgroundColor: "black", color: grey[400] }}
              >
                <Typography variant="caption">No Players</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
