import { Paper, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { StyledTableRow } from '../common/styled';
import { mapSeasonRecords } from '../../utils/parsers';

function SeasonRecords({ data }) {
    const leagueRecords = mapSeasonRecords(data);

    return (
        <TableContainer component={Paper}>
            {leagueRecords?.map((leagueRecord, index) =>
                <Table key={leagueRecord.key} sx={{ minWidth: 650 }}>
                    <TableHead>
                        {index === 0 ? <TableRow>
                            <TableCell>
                                Season Records
                            </TableCell>
                            <TableCell colSpan={4}>
                                <Button variant='outlined' to='/PlayoffBracket'>
                                    Preview Playoff Bracket
                                </Button>
                            </TableCell>
                        </TableRow> : null}
                        <TableRow sx={{ borderTop: 3 }} >
                            <TableCell>Division {leagueRecord.key}</TableCell>
                            <TableCell>W</TableCell>
                            <TableCell>L</TableCell>
                            <TableCell>T</TableCell>
                            <TableCell>DIV</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leagueRecord.records.map((record) => (
                            <StyledTableRow key={record.TeamId}>
                                <TableCell sx={{ width: 350 }}>
                                    <Link to={`/Team/${record.TeamId}`} >{record.Team.TeamName} ({record.Team.OwnerName})</Link>
                                </TableCell>
                                <TableCell>
                                    {record.Wins}
                                </TableCell>
                                <TableCell>
                                    {record.Losses}
                                </TableCell>
                                <TableCell>
                                    {record.Ties}
                                </TableCell>
                                <TableCell>
                                    {record.DivisionWins}-{record.DivisionLosses}-{record.DivisionTies}
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>)}
        </TableContainer>)


}

export default SeasonRecords;