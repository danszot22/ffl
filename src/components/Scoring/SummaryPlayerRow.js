import { grey } from "@mui/material/colors";
import { formatGameInfo } from "../../utils/helpers";
import PlayerLink from "../common/PlayerLink";
import { Typography, TableCell, Box, TableRow } from "@mui/material";

export default function SummaryPlayerRow({ row, showProjections }) {
  return (
    <TableRow
      key={row.PlayerId}
      sx={{
        backgroundColor: "black",
        color: row.NflGame?.NotPlayed
          ? "error.light"
          : row.NflGame?.Playing
          ? "warning.light"
          : grey[400],
      }}
    >
      <TableCell sx={{ pl: 0, pr: 0 }} variant="caption" scope="row">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <PlayerLink
              playerId={row.PlayerId}
              playerName={row?.Player.Name}
              positionCode={row.Player?.Position?.PositionCode}
              variant={"caption"}
              xsOnly={true}
              sx={{
                backgroundColor: "black",
                color: row.NflGame?.NotPlayed
                  ? "error.light"
                  : row.NflGame?.Playing
                  ? "warning.light"
                  : grey[400],
              }}
            />
            <Typography variant="caption">
              {" "}
              {row.Player?.Position.PositionCode}
            </Typography>
          </Box>
          {row.NflGame.GameDate ? (
            <Typography variant="caption">
              {formatGameInfo(row.Player.NflTeam?.NflTeamId, row.NflGame)}
            </Typography>
          ) : (
            <Typography variant="caption">Bye</Typography>
          )}
        </Box>
      </TableCell>
      <TableCell variant="caption">
        {row.NflGame.GameDate ? (
          <Typography variant="caption">
            {["TMQB", "QB"].includes(row.Player.Position.PositionCode)
              ? `${row.PassYds ?? 0} Yds, ${row.PassTds ?? 0} TDs, ${
                  row.PassInts ?? 0
                } Ints`
              : " "}
            {["RB"].includes(row.Player.Position.PositionCode)
              ? `${row.RushYds ?? 0} Yds, ${row.RushTds ?? 0} TDs`
              : " "}
            {["WR", "TE"].includes(row.Player.Position.PositionCode)
              ? `${row.RecYds ?? 0} Yds, ${row.RecTds ?? 0} TDs`
              : " "}
            {["TMPK", "PK"].includes(row.Player.Position.PositionCode)
              ? ` ${row.FgYds ?? 0} FGYds, ${row.XPs ?? 0} XPs`
              : " "}
            {["S", "CB", "LB", "DE", "DT"].includes(
              row.Player.Position.PositionCode
            )
              ? ` ${row.Tackles ?? 0} Tckls, ${row.Sacks ?? 0} Sacks`
              : " "}
          </Typography>
        ) : null}
        {showProjections ? (
          <>
            <br />
            {row.NflGame.GameDate && !row.NflGame.Final ? (
              <Typography variant="caption">
                Proj:
                {["TMQB", "QB"].includes(row.Player.Position.PositionCode)
                  ? `${row.ProjPassYds ?? 0} Yds, ${
                      row.ProjPassTds ?? 0
                    } TDs, ${row.ProjPassInts ?? 0} Ints`
                  : " "}
                {["RB"].includes(row.Player.Position.PositionCode)
                  ? `${row.ProjRushYds ?? 0} Yds, ${row.ProjRushTds ?? 0} TDs`
                  : " "}
                {["WR", "TE"].includes(row.Player.Position.PositionCode)
                  ? `${row.ProjRecYds ?? 0} Yds, ${row.ProjRecTds ?? 0} TDs`
                  : " "}
                {["TMPK", "PK"].includes(row.Player.Position.PositionCode)
                  ? ` ${row.ProjFgYds ?? 0} FGYds, ${row.ProjXPs ?? 0} XPs`
                  : " "}
                {["S", "CB", "LB", "DE", "DT"].includes(
                  row.Player.Position.PositionCode
                )
                  ? ` ${row.ProjTackles ?? 0} Tcks, ${row.ProjSacks ?? 0} Sacks`
                  : " "}
              </Typography>
            ) : (
              " "
            )}
          </>
        ) : null}
      </TableCell>
      <TableCell
        variant="caption"
        sx={{ display: { xs: "none", md: "table-cell" } }}
      >
        {row.NflGame.GameDate ? (
          <Typography variant="caption">
            {["QB", "WR", "TE"].includes(row.Player.Position.PositionCode)
              ? `${row.RushYds ?? 0} RushYds, ${row.RushTds ?? 0} TDs`
              : " "}
            {["RB"].includes(row.Player.Position.PositionCode)
              ? `${row.RecYds ?? 0} RecYds, ${row.RecTds ?? 0} TDs`
              : " "}
          </Typography>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
