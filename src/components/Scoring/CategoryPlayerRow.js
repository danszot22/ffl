import { StyledTableRow } from '../common/styled';
import { Typography, TableCell, Link } from "@mui/material";
import { formatGameInfo } from '../../utils/helpers';

export default function CategoryPlayerRow({ row, showProjections, showGame }) {
    return (
        <StyledTableRow key={row.PlayerId}>
            <TableCell component="th" scope="row">
                <Link to={`/Player/${row.PlayerId}`}>{row.Player.Name}</Link>
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