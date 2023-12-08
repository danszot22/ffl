import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
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
  team,
  row,
  showProjections,
  lineup,
  showGame = true,
}) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <StyledTableRow onClick={() => setOpen(!open)} key={row.TeamId}>
        <TableCell>
          <TeamLink
            team={row.Team}
            variant="inherit"
            sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}
            shortName={isBelowMedium}
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
            sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}
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
            sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}
          >
            {row.BonusTotal}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Link
            variant="inherit"
            sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}
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
        {!isBelowMedium ? (
          <TableCell align="right">
            {formatPlayerName(row.Starters[0]?.Player.Name, "")}
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        ) : null}
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
