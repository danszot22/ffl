import { Paper } from "@mui/material";
import { Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableHeaderRow } from "../common/styled";
import withAuth from "../withAuth";
import TeamRosterPlayers from "../common/TeamRosterPlayers";
import { useNavigate } from "react-router-dom";

function TeamRoster({ roster, teamDetails, team, isEditable }) {
    const navigate = useNavigate();

    const handleClick = (rosterPlayerToDrop) => {
        navigate(`/RosterPlayer/Drop/${rosterPlayerToDrop?.TeamId}/${rosterPlayerToDrop.RosterPlayerId}`);
    };

    const handleDelete = () => {
        //TODO: Call API
        console.log('delete');
    };

    return (
        <TableContainer sx={{ maxWidth: 750 }} component={Paper}>
            <Table size="small" aria-label="simple table">
                <TableHead>
                    <StyledTableHeaderRow>
                        <TableCell colSpan={6}>
                            Roster
                        </TableCell>
                    </StyledTableHeaderRow>
                    <TableRow>
                        <TableCell>

                        </TableCell>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                            Stats
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                            Status
                        </TableCell>
                        <TableCell>
                            Bye
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </TableRow>
                </TableHead>
                <TeamRosterPlayers roster={roster?.Players} team={team} teamDetails={teamDetails} isEditable={isEditable} handleClick={handleClick} handleDelete={handleDelete} />
            </Table>
        </TableContainer>)
}

export default withAuth(TeamRoster);