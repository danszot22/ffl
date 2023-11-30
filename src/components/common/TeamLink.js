import { Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { formatFantasyTeamName } from "../../utils/helpers";

export default function TeamLink({ team, variant, shortName, sx }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Link variant={variant} to={`/Team/${team?.TeamId}`}>
      <Typography variant="inherit" sx={sx}>
        {isXs || shortName ? team?.OwnerName : formatFantasyTeamName(team)}
      </Typography>
    </Link>
  );
}
