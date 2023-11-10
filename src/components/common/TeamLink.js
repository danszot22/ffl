import { Link, useMediaQuery, useTheme } from "@mui/material";
import { formatFantasyTeamName } from "../../utils/helpers";

export default function TeamLink({ team, variant, xsOnly }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Link variant={variant} to={`/Team/${team?.TeamId}`} >
            {isXs || xsOnly
                ? team?.OwnerName
                : formatFantasyTeamName(team)}
        </Link>
    )
}