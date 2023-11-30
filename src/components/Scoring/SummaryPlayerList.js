import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import SummaryPlayerRow from "./SummaryPlayerRow";

export default function SummaryPlayerList({ players, showProjections, title }) {
  return (
    <Paper elevation={3}>
      <Table size="small" aria-label={title}>
        <TableHead>
          <TableRow>
            <TableCell>{title}</TableCell>
            <TableCell colSpan={3}>Game Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players?.map((player) => (
            <SummaryPlayerRow
              key={player.PlayerId}
              row={player}
              showProjections={showProjections}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
