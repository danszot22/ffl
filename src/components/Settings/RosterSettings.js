import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { StyledTableRow } from '../common/styled';
import { useNavigate } from 'react-router-dom';

export default function RosterSettings({ leagueId, settings, isEditable }) {

    const navigate = useNavigate();

    function handleGoToRosterSettings() {
        navigate(`/RosterSettings/Edit`, { state: { leagueId, settings } });
    }

    return (
        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Roster Format</TableCell>
                        <TableCell>Spots</TableCell>
                        <TableCell>Starters</TableCell>
                        <TableCell>
                            {isEditable ?
                                <Button variant='outlined' onClick={handleGoToRosterSettings}>
                                    Edit
                                </Button>
                                : null}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <StyledTableRow>
                        <TableCell>
                            Quarterbacks
                        </TableCell>
                        <TableCell>
                            {settings.TMQB > 0 ? settings.TMQB : settings.QB}
                        </TableCell>
                        <TableCell>
                            {settings.TMQB > 0 ? settings.STMQB : settings.SQB}
                        </TableCell>
                        <TableCell>
                            {settings.TMQB > 0 ? "Team Quarterbacks" : " "}
                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Running Backs
                        </TableCell>
                        <TableCell>
                            {settings.RB}
                        </TableCell>
                        <TableCell>
                            {settings.SRB}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            RBs/WRs
                        </TableCell>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                            {settings.SRBWR}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Wide Receivers
                        </TableCell>
                        <TableCell>
                            {settings.R > 0 ? settings.R : settings.WR}
                        </TableCell>
                        <TableCell>
                            {settings.R > 0 ? settings.SR : settings.SWR}
                        </TableCell>
                        <TableCell>
                            {settings.TMQB > 0 ? "Include Tight Ends" : " "}
                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Tight Ends
                        </TableCell>
                        <TableCell>
                            {settings.TE}
                        </TableCell>
                        <TableCell>
                            {settings.STE}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Team Defense
                        </TableCell>
                        <TableCell>
                            {settings.TMDF}
                        </TableCell>
                        <TableCell>
                            {settings.STMDF}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Defensive Players
                        </TableCell>
                        <TableCell>
                            {settings.DF}
                        </TableCell>
                        <TableCell>
                            {settings.SDF}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Linebackers
                        </TableCell>
                        <TableCell>
                            {settings.LB}
                        </TableCell>
                        <TableCell>
                            {settings.SLB}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Cornerbacks
                        </TableCell>
                        <TableCell>
                            {settings.CB}
                        </TableCell>
                        <TableCell>
                            {settings.SCB}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Safeties
                        </TableCell>
                        <TableCell>
                            {settings.S}
                        </TableCell>
                        <TableCell>
                            {settings.SS}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Defensive Backs
                        </TableCell>
                        <TableCell>
                            {settings.DB}
                        </TableCell>
                        <TableCell>
                            {settings.SDB}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Defensive Ends
                        </TableCell>
                        <TableCell>
                            {settings.DE}
                        </TableCell>
                        <TableCell>
                            {settings.SDE}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Defensive Tackles
                        </TableCell>
                        <TableCell>
                            {settings.DT}
                        </TableCell>
                        <TableCell>
                            {settings.SDT}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Defensive Lineman
                        </TableCell>
                        <TableCell>
                            {settings.DL}
                        </TableCell>
                        <TableCell>
                            {settings.SDL}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Place Kickers
                        </TableCell>
                        <TableCell>
                            {settings.TMPK > 0 ? settings.TMPK : settings.PK}
                        </TableCell>
                        <TableCell>
                            {settings.TMPK > 0 ? settings.STMPK : settings.SPK}
                        </TableCell>
                        <TableCell>
                            {settings.TMPK > 0 ? "Team Kickers" : " "}
                        </TableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                        <TableCell>
                            Utility
                        </TableCell>
                        <TableCell>
                            {settings.UT}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}