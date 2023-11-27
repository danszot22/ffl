import { Card, CardContent, Table, TableRow, TableCell, TableHead, TableBody, Paper, Link, useMediaQuery, useTheme } from "@mui/material";
import { formatFantasyTeamName } from "../../utils/helpers";


export default function GameHeaderCard({ game, handleOpen, showProjections }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card onClick={handleOpen}>
            <CardContent p={0}>
                <Paper sx={{ border: 0 }} elevation={8}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={3}><Link onClick={handleOpen}>All Games</Link></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{formatFantasyTeamName(game.HomeTeam, isBelowMedium)}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{game.HomeTotal.toFixed(1)}</TableCell>
                                {showProjections ?
                                    <TableCell sx={{ textAlign: 'right' }}>{`(${game.ProjectedHomeTotal.toFixed(1)})`}</TableCell>
                                    : null}
                            </TableRow>
                            <TableRow>
                                <TableCell>{formatFantasyTeamName(game.AwayTeam, isBelowMedium)}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{game.AwayTotal.toFixed(1)}</TableCell>
                                {showProjections ?
                                    <TableCell sx={{ textAlign: 'right' }}>{`(${game.ProjectedAwayTotal.toFixed(1)})`}</TableCell>
                                    : null}
                            </TableRow >
                        </TableBody>
                    </Table>
                </Paper>
            </CardContent>
        </Card>
    )
}