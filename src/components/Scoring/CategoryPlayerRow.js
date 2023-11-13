import { StyledTableRow } from '../common/styled';
import { Typography, TableCell, useTheme, useMediaQuery, Box } from "@mui/material";
import { formatGameInfo } from '../../utils/helpers';
import PlayerLink from '../common/PlayerLink';

export default function CategoryPlayerRow({ row, showProjections, showGame }) {
    const theme = useTheme();
    const isAboveSmall = useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <StyledTableRow key={row.PlayerId}>
            <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <PlayerLink playerId={row.PlayerId} playerName={row?.Player.Name} positionCode={row.Player?.Position?.PositionCode} variant={'caption'} />
                    <Typography sx={{ display: { xs: 'block', md: 'none' } }} color={row.NflGame?.NotPlayed ? "error.dark" : row.NflGame?.Playing ? "warning.dark" : ""} variant="caption">
                        {formatGameInfo(row.Player.NflTeam?.NflTeamId, row.NflGame)}
                    </Typography>
                </Box>
            </TableCell>
            {showGame && isAboveSmall ? (
                <TableCell>
                    <Typography color={row.NflGame?.NotPlayed ? "error.dark" : row.NflGame?.Playing ? "warning.dark" : ""} variant="caption">
                        {formatGameInfo(row.Player.NflTeam?.NflTeamId, row.NflGame)}
                    </Typography>
                </TableCell>
            ) : null}
            <TableCell align="right">
                {row.Total}
            </TableCell>
            {showProjections && isAboveSmall ? (
                <TableCell align="right">
                    {!row.NflGame.Final ? row.ProjTotal : null}
                </TableCell>
            ) : null}
        </StyledTableRow>
    )
}