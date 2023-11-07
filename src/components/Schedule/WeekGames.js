
import { Paper, Link } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function WeekGames({ week, games }) {
    return (
        <TableContainer component={Paper}>
            <Table style={{ tableLayout: 'fixed' }} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={4}>
                            NFL Week {week}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Away Team
                        </TableCell>
                        <TableCell align="right">
                            Score
                        </TableCell>
                        <TableCell align="left">
                            Score
                        </TableCell>
                        <TableCell align="right">
                            Home Team
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {games.map((game) => (
                        <TableRow key={game.FantasyGameId}>
                            <TableCell sx={{ fontWeight: (game.AwayTeam.PointTotal > game.HomeTeam.PointTotal ? 'bold' : 'regular') }}>
                                <Link to={`/Team/${game.AwayTeam.TeamId}`}>{game.AwayTeam.TeamName} ({game.AwayTeam.OwnerName})</Link>
                            </TableCell>
                            <TableCell align="right" sx={{ borderRight: 1, fontWeight: (game.AwayTeam.PointTotal > game.HomeTeam.PointTotal ? 'bold' : 'regular') }}>
                                {game.AwayTeam.PointTotal > 0 ? game.AwayTeam.PointTotal.toFixed(1) : " "} {!game.Complete && game.AwayTeam.ProjectedTotal > 0 ? `(${game.AwayTeam.ProjectedTotal.toFixed(1)})` : " "}
                            </TableCell>
                            <TableCell sx={{ fontWeight: (game.HomeTeam.PointTotal > game.AwayTeam.PointTotal ? 'bold' : 'regular') }} align="left">
                                {game.HomeTeam.PointTotal > 0 ? game.HomeTeam.PointTotal.toFixed(1) : " "} {!game.Complete && game.HomeTeam.ProjectedTotal > 0 ? `(${game.HomeTeam.ProjectedTotal.toFixed(1)})` : " "}
                            </TableCell>
                            <TableCell sx={{ fontWeight: (game.HomeTeam.PointTotal > game.AwayTeam.PointTotal ? 'bold' : 'regular') }} align="right">
                                <Link to={`/Team/${game.HomeTeam.TeamId}`}>{game.HomeTeam.TeamName} ({game.HomeTeam.OwnerName})</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}