import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { StyledTableRow } from "../common/styled";
import { convertDateToLocal } from "../../utils/helpers";
import { Delete, Send } from "@mui/icons-material";
import { useState } from "react";
import { addCommissioner, sendCommissionerInvitation } from "../../api/ffl";
import ConfirmationDialog from "../common/ConfirmationDialog";

export default function Commissioners({
  leagueId,
  commissioners,
  setCommissioners,
  handleDelete,
  isEditable,
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState();
  const [isSending, setIsSending] = useState(false);
  const [sendMessage, setSendMessage] = useState();

  const handleClickOpen = () => {
    setAddMessage();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
  };

  const handleAdd = async () => {
    const newCommissioner = { LeagueId: leagueId, Email: email };
    setIsAdding(true);
    const result = await addCommissioner(leagueId, newCommissioner);
    setIsAdding(false);
    if (result?.Message) {
      setAddMessage([result?.Message]);
    } else {
      const updatedCommissioners = commissioners.concat({
        LeagueCommissionerId: result?.LeagueCommissionerId,
        Email: email,
        status: "new",
      });
      setCommissioners(updatedCommissioners);
      setEmail("");
      setOpen(false);
    }
  };

  const handleSendInvite = async () => {
    setSendMessage();
    setIsSending(true);
    const result = await sendCommissionerInvitation(leagueId);
    setIsSending(false);
    if (result?.Message) {
      setSendMessage([result?.Message]);
    }
  };

  return (
    <>
      {isSending ? <CircularProgress /> : null}
      <Typography color="error" component="div">
        {sendMessage}
      </Typography>
      <TableContainer component={Paper} sx={{ border: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>Commissioners</TableCell>
              <TableCell>
                {isEditable ? (
                  <Button
                    sx={{ ml: 1 }}
                    variant="outlined"
                    onClick={handleClickOpen}
                  >
                    Add
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissioners?.map((commissioner) => {
              return (
                <StyledTableRow key={commissioner.Email}>
                  <TableCell>{commissioner.Email}</TableCell>
                  <TableCell>
                    {commissioner.UserId
                      ? "joined"
                      : commissioner.InvitationCode
                      ? "invited"
                      : "new"}
                  </TableCell>
                  <TableCell>
                    {convertDateToLocal(
                      commissioner.UpdateDateTime
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {isEditable ? (
                      <>
                        <Button
                          onClick={() =>
                            handleDelete(commissioner.LeagueCommissionerId)
                          }
                        >
                          <Delete />
                        </Button>
                        <Tooltip
                          arrow
                          placement="right"
                          title="Send Invitation"
                        >
                          <Button
                            onClick={() =>
                              handleSendInvite(
                                commissioner.LeagueCommissionerId
                              )
                            }
                          >
                            <Send />
                          </Button>
                        </Tooltip>
                      </>
                    ) : null}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmationDialog
        title={"Add Commissioner"}
        open={open}
        setOpen={handleClose}
        message={addMessage}
        isUpdating={isAdding}
        handleConfirmClick={handleAdd}
        confirmationMessage={
          "To add a commissioner, please enter their email address here."
        }
      >
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </ConfirmationDialog>
    </>
  );
}
