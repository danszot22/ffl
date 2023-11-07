import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import CategoryPlayerRow from './CategoryPlayerRow';

export default function CategoryPlayerList({ players, showProjections, title, showGame }) {
    return (
        <Paper elevation={3} >
            <Table size="small" aria-label="players">
                <TableHead>
                    <TableRow>
                        <TableCell>{title}</TableCell>
                        {showGame ? (
                            <TableCell>Game</TableCell>
                        ) : null}
                        <TableCell align="right">Total</TableCell>
                        {showProjections ? (
                            <TableCell align="right">Projected</TableCell>
                        ) : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.map((player) => (
                        <CategoryPlayerRow key={player.PlayerId} row={player} showGame={showGame} showProjections={showProjections} />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}
