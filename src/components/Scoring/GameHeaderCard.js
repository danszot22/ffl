import { Card, CardContent, Table, TableRow, TableCell, TableHead, TableBody, Paper, Link } from "@mui/material";
import { formatFantasyTeamName } from "../../utils/helpers";

export default function GameHeaderCard({ game, handleOpen, showProjections }) {

    return (
        <Card onClick={handleOpen}>
            <CardContent p={0}>
                <Paper sx={{ border: 0 }} elevation={8}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={1}>Game</TableCell>
                                <TableCell colSpan={2}><Link onClick={handleOpen}>View All</Link></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{formatFantasyTeamName(game.HomeTeam)}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{game.HomeTotal.toFixed(1)}</TableCell>
                                {showProjections ?
                                    <TableCell sx={{ textAlign: 'right' }}>{`(${game.ProjectedHomeTotal.toFixed(1)})`}</TableCell>
                                    : null}
                            </TableRow>
                            <TableRow>
                                <TableCell>{formatFantasyTeamName(game.AwayTeam)}</TableCell>
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