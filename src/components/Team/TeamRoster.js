import { Paper } from "@mui/material";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableHeaderRow } from "../common/styled";
import withAuth from "../withAuth";
import TeamRosterPlayers from "../common/TeamRosterPlayers";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { deleteRosterPlayer } from "../../api/ffl";
import { useState } from "react";

function TeamRoster({ roster, setRoster, teamDetails, team, isEditable }) {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleClick = (rosterPlayerToDrop) => {
    navigate(
      `/RosterPlayer/Drop/${rosterPlayerToDrop?.TeamId}/${rosterPlayerToDrop.RosterPlayerId}`
    );
  };

  const handleDelete = async (row) => {
    setDeleteMessage();
    setShowDeleteConfirmation(true);
    setSelectedPlayer(row);
  };

  const handleConfirmClick = async () => {
    console.log(selectedPlayer);
    setIsDeleting(true);
    const result = await deleteRosterPlayer(
      teamDetails.LeagueId,
      selectedPlayer.RosterPlayerId
    );
    setIsDeleting(false);
    if (result?.Message) {
      setDeleteMessage([result?.Message]);
    } else {
      const updatedPlayers = roster.filter(
        (rosterPlayer) =>
          rosterPlayer.RosterPlayerId !== selectedPlayer.RosterPlayerId
      );
      setRoster(updatedPlayers);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <>
      <ConfirmationDialog
        title={"Delete Player"}
        open={showDeleteConfirmation}
        setOpen={setShowDeleteConfirmation}
        message={deleteMessage}
        isUpdating={isDeleting}
        handleConfirmClick={handleConfirmClick}
        confirmationMessage={"Are you sure you want to delete this player?"}
      />

      <TableContainer sx={{ maxWidth: 750 }} component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <StyledTableHeaderRow>
              <TableCell colSpan={6}>Roster</TableCell>
            </StyledTableHeaderRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Stats
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Status
              </TableCell>
              <TableCell>Bye</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TeamRosterPlayers
            roster={roster?.Players}
            team={team}
            teamDetails={teamDetails}
            isEditable={isEditable}
            handleClick={handleClick}
            handleDelete={handleDelete}
          />
        </Table>
      </TableContainer>
    </>
  );
}

export default withAuth(TeamRoster);
