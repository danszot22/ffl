import { Typography } from "@mui/material";

export default function FormattedPlayerStats({ player, sx }) {
    return (
        <Typography variant="caption" sx={sx}>
            {["TMQB", "QB"].includes(player.PositionCode) ? `${player.PassYds ?? 0} Yds, ${player.PassTds ?? 0} TDs, ${player.PassInts ?? 0} Ints` : ' '}
            {["RB"].includes(player.PositionCode) ? `${player.RushingYds ?? 0} Yds, ${player.RushingTds ?? 0} TDs` : ' '}
            {["WR", "TE"].includes(player.PositionCode) ? `${player.ReceivingYds ?? 0} Yds, ${player.ReceivingTds ?? 0} TDs` : ' '}
            {["TMPK", "PK"].includes(player.PositionCode) ? ` ${player.FGYds ?? 0} FGYds, ${player.XPs ?? 0} XPs` : ' '}
            {["S", "CB", "LB", "DE", "DT"].includes(player.PositionCode) ? ` ${player.Tackles ?? 0} Tckls, ${player.Sacks ?? 0} Sacks` : ' '}
        </Typography>
    )
}