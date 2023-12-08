import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { formatFantasyTeamName } from "../../utils/helpers";
import { grey } from "@mui/material/colors";

function WeeklyGames({ fantasyGames, summaryData, open, handleClose }) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle id="alert-dialog-title">Game Results</DialogTitle>
      <DialogContent>
        {fantasyGames.map((game) => (
          <Paper key={game.FantasyGameId} sx={{ m: 1 }} elevation={8}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: grey[600] }}>
                  <TableCell sx={{ color: "white" }} colSpan={3}>
                    {!summaryData.complete ? "Projected" : "Final"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableRow>
                <TableCell>
                  {formatFantasyTeamName(game.HomeTeam, isBelowMedium)}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {game.HomeTotal.toFixed(1)}
                </TableCell>
                {!summaryData.complete ? (
                  <TableCell
                    sx={{ textAlign: "right" }}
                  >{`(${game.ProjectedHomeTotal.toFixed(1)})`}</TableCell>
                ) : null}
              </TableRow>
              <TableRow>
                <TableCell>
                  {formatFantasyTeamName(game.AwayTeam, isBelowMedium)}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {game.AwayTotal.toFixed(1)}
                </TableCell>
                {!summaryData.complete ? (
                  <TableCell
                    sx={{ textAlign: "right" }}
                  >{`(${game.ProjectedAwayTotal.toFixed(1)})`}</TableCell>
                ) : null}
              </TableRow>
            </Table>
          </Paper>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default WeeklyGames;
