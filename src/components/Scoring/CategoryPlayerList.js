import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import CategoryPlayerRow from './CategoryPlayerRow';
import { grey } from "@mui/material/colors";

export default function CategoryPlayerList({ players, showProjections, title, showGame }) {
    const theme = useTheme();
    const isAboveSmall = useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <Paper elevation={3} >
            <Table size="small" aria-label="players">
                <TableHead>
                    <TableRow>
                        <TableCell>{title}</TableCell>
                        {showGame && isAboveSmall ? (
                            <TableCell>Game</TableCell>
                        ) : null}
                        <TableCell align="right">Total</TableCell>
                        {showProjections ? (
                            <TableCell align="right">Projected</TableCell>
                        ) : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players?.length > 0 ? players.map((player) => (
                        <CategoryPlayerRow key={player.PlayerId} row={player} showGame={showGame} showProjections={showProjections} />
                    )) :
                        <TableRow>
                            <TableCell variant="caption" scope="row" colSpan={4} sx={{ pl: 0, backgroundColor: 'black', color: grey[400] }}>
                                <Typography variant="caption">
                                    No Players
                                </Typography>
                            </TableCell>
                        </TableRow>}
                </TableBody>
            </Table>
        </Paper>
    )
}
