import {
  TableCell,
  Box,
  Typography,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { StyledTableRow } from "../common/styled";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import SummaryPlayerList from "./SummaryPlayerList";
import { useTheme, useMediaQuery } from "@mui/material";
import TeamLink from "../common/TeamLink";
import { formatFantasyTeamName } from "../../utils/helpers";

export default function ExpandableSummaryRow({
  team,
  row,
  topScore,
  showProjections,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <StyledTableRow onClick={() => setOpen(!open)} key={row.key}>
        <TableCell sx={{ pr: 0 }} component="th" scope="row">
          <Typography
            variant="inherit"
            sx={{ fontWeight: row.key === team ? 600 : 0 }}
          >
            {row.rank}
          </Typography>
        </TableCell>
        <TableCell sx={{ pl: 0, pr: 0 }}>
          <TeamLink
            team={row.team}
            variant="inherit"
            sx={{ fontWeight: row.key === team ? 600 : 0 }}
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
              {row.Starters.filter((player) => player.NflGame.Playing).length}
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
              {row.Starters.filter((player) => player.NflGame.NotPlayed).length}
            </Paper>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Link
            variant="inherit"
            sx={{ fontWeight: row.key === team ? 600 : 0 }}
            onClick={() => setOpen(!open)}
          >
            {row.total.toFixed(1)}{" "}
            {showProjections ? `(${row.projectedTotal.toFixed(1)})` : " "}
          </Link>
        </TableCell>
        {!isXs ? (
          <>
            <TableCell align="right">
              <Typography
                variant="inherit"
                sx={{ fontWeight: row.key === team ? 600 : 0 }}
              >
                {(topScore - row.total).toFixed(1)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          </>
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
          {formatFantasyTeamName(row.team, false)}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "black", color: "white" }}>
          <SummaryPlayerList
            title={"Starters"}
            players={row.Starters}
            showProjections={showProjections}
          />
          <SummaryPlayerList
            title="Bench"
            players={row.Bench}
            showProjections={showProjections}
          />
        </DialogContent>
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
      </Dialog>
    </>
  );
}
