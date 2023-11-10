import { StyledTableRow } from '../common/styled';
import { Typography, TableCell } from "@mui/material";
import { formatGameInfo } from '../../utils/helpers';
import PlayerLink from '../common/PlayerLink';

export default function CategoryPlayerRow({ row, showProjections, showGame }) {
    return (
        <StyledTableRow key={row.PlayerId}>
            <TableCell component="th" scope="row">
                <PlayerLink playerId={row.PlayerId} playerName={row?.Player.Name} positionCode={row.Player?.Position?.PositionCode} variant={'caption'} />
            </TableCell>
            {showGame ? (
                <TableCell>
                    <Typography color={row.NflGame?.NotPlayed ? "error.dark" : row.NflGame?.Playing ? "warning.dark" : ""} variant="caption">
                        {formatGameInfo(row.Player.NflTeam?.NflTeamId, row.NflGame)}
                    </Typography>
                </TableCell>
            ) : null}
            <TableCell align="right">
                {row.Total}
            </TableCell>
            {showProjections ? (
                <TableCell align="right">
                    {!row.NflGame.Final ? row.ProjTotal : null}
                </TableCell>
            ) : null}
        </StyledTableRow>
    )
}