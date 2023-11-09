import { Paper, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { formatDollars } from '../../utils/helpers';
import { StyledTableRow } from '../common/styled';
import { mapSeasonPoints } from '../../utils/parsers';
import TableToolbar from './TableToolbar';

function SeasonPoints({ data }) {
    const points = mapSeasonPoints(data);
    return (
        <TableContainer component={Paper}>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={1}>Season Points</TableCell>
                        <TableCell colSpan={4}> <TableToolbar /> </TableCell>
                    </TableRow>
                </TableHead>
                <TableHead>
                    <TableRow sx={{ borderTop: 3 }}>
                        <TableCell>Rank</TableCell>
                        <TableCell>Team</TableCell>
                        <TableCell>Points</TableCell>
                        <TableCell>Points Back</TableCell>
                        <TableCell>$ Won</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {points.map((point) => (
                        <StyledTableRow key={point.TeamId}>
                            <TableCell>
                                {point.rank}
                            </TableCell>
                            <TableCell sx={{ width: { xs: 150, md: 350 } }} >
                                <Link to={`/Team/${point.TeamId}`} >
                                    <Typography variant='inherit' sx={{ display: { xs: 'none', md: 'block' }, }}>{point.Team.TeamName} ({point.Team.OwnerName})</Typography>
                                    <Typography variant='inherit' sx={{ display: { xs: 'block', md: 'none' }, }}>{point.Team.OwnerName}</Typography>
                                </Link>
                            </TableCell>
                            <TableCell>
                                {point.PointTotal}
                            </TableCell>
                            <TableCell>
                                {(points[0].PointTotal - point.PointTotal).toFixed(1)}
                            </TableCell>
                            <TableCell>
                                {formatDollars(point.PrizeTotal)}
                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default SeasonPoints;