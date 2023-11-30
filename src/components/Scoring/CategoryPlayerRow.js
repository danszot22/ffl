import { Typography, TableCell, Box, TableRow } from "@mui/material";
import { formatGameInfo } from "../../utils/helpers";
import PlayerLink from "../common/PlayerLink";
import { grey } from "@mui/material/colors";

export default function CategoryPlayerRow({ row, showProjections, showGame }) {
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
          <PlayerLink
            playerId={row.PlayerId}
            playerName={row?.Player.Name}
            positionCode={row.Player?.Position?.PositionCode}
            variant={"caption"}
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
            {formatGameInfo(row.Player.NflTeam?.NflTeamId, row.NflGame)}
          </Typography>
        </Box>
      </TableCell>
      <TableCell variant="caption" align="right">
        {row.Total}
      </TableCell>
      {showProjections ? (
        <TableCell variant="caption" align="right">
          {!row.NflGame.Final ? row.ProjTotal : null}
        </TableCell>
      ) : null}
    </TableRow>
  );
}
