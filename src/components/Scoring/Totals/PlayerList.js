import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import PlayerRow from "./PlayerRow";

export default function PlayerList({
  players,
  showProjections,
  title,
  variant,
}) {
  return (
    <Paper sx={{ minWidth: { xs: 350, md: 500 } }} elevation={3}>
      <Table size="small" aria-label={title}>
        <TableHead>
          <TableRow>
            <TableCell>{title}</TableCell>
            <TableCell colSpan={3}>Game Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players?.map((player) => (
            <PlayerRow
              key={player.PlayerId}
              row={player}
              showProjections={showProjections}
              variant={variant}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
