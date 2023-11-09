import { Paper, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from '@mui/material';
import { StyledTableRow } from '../common/styled';
import { mapSeasonRecords } from '../../utils/parsers';

function SeasonRecords({ data }) {
    const leagueRecords = mapSeasonRecords(data);

    return (
        <TableContainer component={Paper}>
            {leagueRecords?.map((leagueRecord, index) =>
                <Table key={leagueRecord.key}>
                    <TableHead>
                        {index === 0 ? <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant='inherit' sx={{ pr: 1 }} component='span' >Season Records</Typography>
                                <Button sx={{ pl: 1 }} variant='outlined' to='/PlayoffBracket'>
                                    Playoff Bracket Preview
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
                                <TableCell sx={{ width: { xs: 150, md: 350 } }} >
                                    <Link to={`/Team/${record.TeamId}`} >
                                        <Typography variant='inherit' sx={{ display: { xs: 'none', md: 'block' }, }}>{record.Team.TeamName} ({record.Team.OwnerName})</Typography>
                                        <Typography variant='inherit' sx={{ display: { xs: 'block', md: 'none' }, }}>{record.Team.OwnerName}</Typography>
                                    </Link>
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