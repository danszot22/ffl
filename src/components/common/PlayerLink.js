import { Link, useMediaQuery, useTheme } from "@mui/material";
import { formatPlayerFullName, formatPlayerName } from "../../utils/helpers";

export default function PlayerLink({ playerId, playerName, positionCode, variant, xsOnly }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Link variant={variant} to={`/Player/${playerId}`} >
            {isXs || xsOnly
                ? formatPlayerName(playerName, positionCode)
                : formatPlayerFullName(playerName)}
        </Link>
    )
}