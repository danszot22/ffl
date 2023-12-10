import {
  Paper,
  Typography,
  TableFooter,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  FormGroup,
  Checkbox,
  Button,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { playerStatuses, formatGameInfo } from "../../utils/helpers";
import PlayerImage from "../common/PlayerImage";
import PlayerLink from "../common/PlayerLink";

function ProjectedStats({ rosterPlayer, variant, sx }) {
  return rosterPlayer.NflGame.NotPlayed ? (
    <Typography sx={sx} variant={variant} component={"div"}>
      Proj:
      {["TMQB", "QB"].includes(rosterPlayer.Player.Position.PositionCode)
        ? ` ${rosterPlayer.ProjPassYds ?? 0} Yds, ${
            rosterPlayer.ProjPassTds ?? 0
          } TDs, ${rosterPlayer.ProjPassInts ?? 0} Ints`
        : " "}
      {["RB"].includes(rosterPlayer.Player.Position.PositionCode)
        ? `${rosterPlayer.ProjRushYds ?? 0} Yds, ${
            rosterPlayer.ProjRushTds ?? 0
          } TDs`
        : " "}
      {["WR", "TE"].includes(rosterPlayer.Player.Position.PositionCode)
        ? `${rosterPlayer.ProjRecYds ?? 0} Yds, ${
            rosterPlayer.ProjRecTds ?? 0
          } TDs`
        : " "}
      {["TMPK", "PK"].includes(rosterPlayer.Player.Position.PositionCode)
        ? ` ${rosterPlayer.ProjFgYds ?? 0} FGYds, ${
            rosterPlayer.ProjXPs ?? 0
          } XPs`
        : " "}
      {["S", "CB", "LB", "DE", "DT"].includes(
        rosterPlayer.Player.Position.PositionCode
      )
        ? ` ${rosterPlayer.ProjTackles ?? 0} Tcks, ${
            rosterPlayer.ProjSacks ?? 0
          } Sacks`
        : " "}
    </Typography>
  ) : null;
}

function LineupTable({
  isUpdating,
  roster,
  week,
  currentWeek,
  errorList,
  handleSave,
  handleChange,
}) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
              Status
            </TableCell>
            <TableCell>Game</TableCell>
            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
              Projections
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roster?.Players.map((rosterPlayer, index) => (
            <TableRow
              sx={{
                borderTop:
                  index > 0 &&
                  rosterPlayer.Player?.Position?.Group !==
                    roster?.Players[index - 1].Player?.Position?.Group
                    ? 3
                    : 1,
              }}
              key={rosterPlayer.RosterPlayerId}
            >
              <TableCell sx={{ p: 0 }}>
                <FormGroup>
                  <Checkbox
                    onChange={handleChange}
                    name={"" + rosterPlayer.RosterPlayerId}
                    disabled={
                      currentWeek !== week ||
                      (rosterPlayer.NflGame.GameDate &&
                        !rosterPlayer.NflGame.NotPlayed)
                    }
                    checked={rosterPlayer.Starting}
                  />
                </FormGroup>
              </TableCell>
              <TableCell>
                <PlayerImage
                  positionCode={rosterPlayer.Player?.Position?.PositionCode}
                  nflTeamCode={rosterPlayer.Player?.NflTeam?.DisplayCode}
                  espnPlayerId={rosterPlayer.Player?.EspnPlayerId}
                  height={40}
                />
              </TableCell>
              <TableCell>
                <PlayerLink
                  playerId={rosterPlayer.PlayerId}
                  playerName={rosterPlayer.Player?.Name}
                  positionCode={rosterPlayer.Player?.Position?.PositionCode}
                />
                {` ${rosterPlayer.Player?.Position?.PositionCode} ${rosterPlayer.Player?.NflTeam?.DisplayCode}`}
                <ProjectedStats
                  rosterPlayer={rosterPlayer}
                  variant={"caption"}
                  sx={{ display: { xs: "block", md: "none" } }}
                />
                <Typography
                  variant="caption"
                  sx={{ display: { xs: "block", md: "none" }, pr: 1 }}
                >
                  {rosterPlayer.Player?.Status?.StatusDescription}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  maxWidth: 300,
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                <Typography variant="caption" sx={{ pr: 1 }}>
                  {playerStatuses[rosterPlayer.Player?.Status?.StatusCode]}
                </Typography>
                <Typography variant="caption" sx={{ pr: 1 }}>
                  {rosterPlayer.Player?.Status?.StatusDescription}
                </Typography>
              </TableCell>
              <TableCell>
                {formatGameInfo(
                  rosterPlayer.Player.NflTeam?.NflTeamId,
                  rosterPlayer.NflGame
                )}
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                <ProjectedStats rosterPlayer={rosterPlayer} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  sx={{ ml: 1, mb: 2 }}
                  onClick={handleSave}
                  disabled={isUpdating || errorList.length > 0}
                >
                  Save
                </Button>
                <Button variant="contained" sx={{ ml: 1 }} to={`/Lineups`}>
                  Cancel
                </Button>
                {isUpdating ? <CircularProgress /> : null}
                <FormControl
                  required
                  error={errorList.length > 0}
                  sx={{ display: { xs: "inline", md: "none" } }}
                >
                  {errorList.map((error, index) => (
                    <FormHelperText key={index}>{error}</FormHelperText>
                  ))}
                </FormControl>
              </Box>
            </TableCell>
            <TableCell
              colSpan={3}
              sx={{ display: { xs: "none", md: "table-cell" } }}
            >
              <FormControl required error={errorList.length > 0}>
                {errorList.map((error, index) => (
                  <FormHelperText key={index}>{error}</FormHelperText>
                ))}
              </FormControl>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default LineupTable;
