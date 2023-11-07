import { Paper, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatDollars } from '../../utils/helpers';
import { StyledTableRow } from '../common/styled';
import { mapSeasonPoints } from '../../utils/parsers';
import TableToolbar from './TableToolbar';

function SeasonPoints({ data }) {
    const points = mapSeasonPoints(data);
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>Season Points</TableCell>
                        <TableCell colSpan={3}> <TableToolbar /> </TableCell>
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
                            <TableCell>
                                <Link to={`/Team/${point.TeamId}`} >{point.Team.TeamName} ({point.Team.OwnerName})</Link>
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