import { StyledTableRow } from "../../common/styled";
import { useState } from "react";
import {
  Box,
  TableCell,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import PlayerList from "./PlayerList";
import TeamLink from "../../common/TeamLink";
import {
  formatFantasyTeamName,
  formatPlayerName,
} from "../../../utils/helpers";
import { Link } from "react-router-dom";

export default function TeamPoints({
  category,
  userTeamId,
  row,
  showProjections,
  lineup,
  showGame = true,
}) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isBelowLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <StyledTableRow onClick={() => setOpen(!open)} key={row.TeamId}>
        <TableCell>
          <TeamLink
            team={row.Team}
            variant="inherit"
            sx={{ fontWeight: row.TeamId === userTeamId ? 600 : 0 }}
            shortName={isBelowLarge}
          />
        </TableCell>
        <TableCell
          sx={{
            pl: 0,
            pr: 0,
            display: showProjections ? "table-cell" : "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              sx={{
                textAlign: "center",
                p: 1,
                mr: { xs: 0, md: 1 },
                minWidth: 40,
                color: "#fff",
                bgcolor: (theme) => theme.palette.warning.dark,
              }}
            >
              {
                lineup?.Starters?.filter(
                  (player) =>
                    player.NflGame?.Playing &&
                    ((category.startsWith("Pass") &&
                      ["TMQB", "QB"].includes(
                        player.Player.Position.PositionCode
                      )) ||
                      (category.startsWith("Rush") &&
                        ["RB"].includes(player.Player.Position.PositionCode)) ||
                      (category.startsWith("Rec") &&
                        ["WR", "TE"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("Fg") &&
                        ["TMPK", "PK"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("XP") &&
                        ["TMPK", "PK"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("Tack") &&
                        ["S", "CB", "LB", "DE", "DT"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("Sack") &&
                        ["S", "CB", "LB", "DE", "DT"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("DEF") &&
                        ["S", "CB", "LB", "DE", "DT"].includes(
                          player.Player.Position.PositionCode
                        )))
                ).length
              }
            </Paper>
            <Paper
              sx={{
                textAlign: "center",
                minWidth: 40,
                p: 1,
                color: "#fff",
                bgcolor: (theme) => theme.palette.error.dark,
              }}
            >
              {
                lineup?.Starters?.filter(
                  (player) =>
                    player.NflGame?.NotPlayed &&
                    ((category.startsWith("Pass") &&
                      ["TMQB", "QB"].includes(
                        player.Player.Position.PositionCode
                      )) ||
                      (category.startsWith("Rush") &&
                        ["RB"].includes(player.Player.Position.PositionCode)) ||
                      (category.startsWith("Rec") &&
                        ["WR", "TE"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("FG") &&
                        ["TMPK", "PK"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("XP") &&
                        ["TMPK", "PK"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("Tack") &&
                        ["S", "CB", "LB", "DE", "DT"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("Sack") &&
                        ["S", "CB", "LB", "DE", "DT"].includes(
                          player.Player.Position.PositionCode
                        )) ||
                      (category.startsWith("DeF") &&
                        ["S", "CB", "LB", "DE", "DT"].includes(
                          player.Player.Position.PositionCode
                        )))
                ).length
              }
            </Paper>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Typography
            variant="inherit"
            sx={{ fontWeight: row.TeamId === userTeamId ? 600 : 0 }}
          >
            {(row.PointTotal + row.BonusTotal).toFixed(1)}
          </Typography>
        </TableCell>
        <TableCell
          align="right"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          <Typography
            variant="inherit"
            sx={{ fontWeight: row.TeamId === userTeamId ? 600 : 0 }}
          >
            {row.BonusTotal}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Link
            variant="inherit"
            sx={{ fontWeight: row.TeamId === userTeamId ? 600 : 0 }}
            onClick={() => setOpen(!open)}
          >
            <Typography
              variant="inherit"
              sx={{
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#90caf9" : "",
              }}
            >
              {row.StatisticalTotal}{" "}
              {showProjections && !isBelowMedium
                ? `(${row.ProjStatisticalTotal})`
                : null}
            </Typography>
          </Link>
        </TableCell>
        <TableCell align="right">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "flex-end",
            }}
          >
            {row.Starters?.map((starter, index) =>
              starter.Total > 0 && index < 4 ? (
                <Typography sx={{ ml: { xs: 0, md: 1 } }} variant="caption">
                  {`${formatPlayerName(starter.Player.Name, "")}(${
                    starter.Total
                  }${
                    starter.RelatedStatistics.length > 0 ? ":" : ""
                  }${starter.RelatedStatistics?.join(", ")})`}
                </Typography>
              ) : null
            )}
          </Box>
        </TableCell>
      </StyledTableRow>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ backgroundColor: "black", color: "white" }}
        >
          {formatFantasyTeamName(row.Team, false)}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "black", color: "white" }}>
          <PlayerList
            title={`Starters`}
            players={row.Starters}
            showProjections={showProjections}
            showGame={showGame}
          />
          {row.Bench ? (
            <PlayerList
              title={`Bench`}
              players={row.Bench}
              showProjections={showProjections}
              showGame={showGame}
            />
          ) : null}
          <DialogTitle
            id="alert-dialog-title"
            sx={{ backgroundColor: "black", color: "white" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                justifyContent: "space-around",
              }}
            >
              <Typography variant={"caption"} sx={{ color: "error.light" }}>
                Not Played
              </Typography>
              <Typography variant="caption" sx={{ color: "warning.light" }}>
                Playing
              </Typography>
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}
