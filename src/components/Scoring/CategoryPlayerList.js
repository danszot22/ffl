import { Paper, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import CategoryPlayerRow from './CategoryPlayerRow';
import { StyledTableHeaderRow } from "../common/styled";

export default function CategoryPlayerList({ players, showProjections, title, showGame }) {
    const theme = useTheme();
    const isAboveSmall = useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <Paper elevation={3} >
            <Table size="small" aria-label="players">
                <TableHead>
                    <StyledTableHeaderRow>
                        <TableCell>{title}</TableCell>
                        {showGame && isAboveSmall ? (
                            <TableCell>Game</TableCell>
                        ) : null}
                        <TableCell align="right">Total</TableCell>
                        {showProjections && isAboveSmall ? (
                            <TableCell align="right">Projected</TableCell>
                        ) : null}
                    </StyledTableHeaderRow>
                </TableHead>
                <TableBody>
                    {players?.length > 0 ? players.map((player) => (
                        <CategoryPlayerRow key={player.PlayerId} row={player} showGame={showGame} showProjections={showProjections} />
                    )) : <TableRow><TableCell>No Players</TableCell></TableRow>}
                </TableBody>
            </Table>
        </Paper>
    )
}
