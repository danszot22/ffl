import { useEffect, useState } from "react";
import Root from "../Root";
import { teamLoader, teamWaiverRequestsLoader } from "../../api/graphql";
import TeamWaiverRequests from "./TeamWaiverRequests";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import { deleteWaiverRequest, updateWaiverRequestOrder } from "../../api/ffl";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../common/ConfirmationDialog";

function WaiverRequests({ team }) {
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [waivers, setWaivers] = useState([]);
  const [teamDetails, setTeamDetails] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(false);
  const [requestId, setRequestId] = useState();

  useEffect(() => {
    const fetchTeam = async (teamId) => {
      const teamResponse = await teamLoader(teamId);
      setTeamDetails(teamResponse);
      const waiverResponse = await teamWaiverRequestsLoader(teamId, 2);
      setWaivers(waiverResponse);
    };
    fetchTeam(team?.TeamId);
  }, [team?.TeamId]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleSave = async () => {
    setMessage();
    setIsUpdating(true);
    const result = await updateWaiverRequestOrder(
      team?.TeamId,
      waivers.map((waiver) => waiver.WaiverRequestId)
    );
    setIsUpdating(false);
    if (result?.Message) {
      setMessage(result?.Message);
    } else {
      navigate("/Team");
    }
  };

  const handleDragEnd = ({ destination, source }) => {
    // reorder list
    if (!destination) return;

    setWaivers(reorder(waivers, source.index, destination.index));
  };

  const handleDelete = async (id) => {
    setRequestId(id);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmClick = async () => {
    setShowDeleteConfirmation(false);
    setMessage();
    setIsUpdating(true);
    const result = await deleteWaiverRequest(requestId);
    setIsUpdating(false);
    if (result?.Message) {
      setMessage(result?.Message);
    } else {
      const updatedWaivers = waivers.filter((waiver) => {
        return waiver.WaiverRequestId !== requestId;
      });
      setWaivers(updatedWaivers);
    }
  };

  return (
    <Root title={"Waiver Requests"}>
      <PageToolbar title={"Waiver Requests"} />
      <ConfirmationDialog
        open={showDeleteConfirmation}
        setOpen={setShowDeleteConfirmation}
        message={message}
        isUpdating={isUpdating}
        handleConfirmClick={handleDeleteConfirmClick}
        confirmationMessage={"Delete Waiver Request?"}
      />
      <div style={{ width: "100%" }}>
        <TeamWaiverRequests
          waiverRequests={waivers}
          team={teamDetails}
          onDragEnd={handleDragEnd}
          handleDelete={handleDelete}
        />
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{ ml: 1, mb: 2 }}
          onClick={handleSave}
          disabled={isUpdating}
        >
          Save
        </Button>
        <Button variant="contained" sx={{ ml: 1 }} to={`/Team`}>
          Cancel
        </Button>
        {isUpdating ? <CircularProgress /> : null}
        <Typography color="error">{message}</Typography>
      </Box>
    </Root>
  );
}

export default withAuth(WaiverRequests);
