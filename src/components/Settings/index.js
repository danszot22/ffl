import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { useState, useEffect } from "react";
import {
  leagueSettingsLoader,
  rosterSettingsLoader,
  leaguePrizeSettingsLoader,
  leagueCommissionerLoader,
} from "../../api/graphql";
import { Box, Paper } from "@mui/material";
import Commissioners from "./Commissioners";
import GeneralSettings from "./GeneralSettings";
import PrizeSettings from "./PrizeSettings";
import RosterSettings from "./RosterSettings";
import withAuth from "../withAuth";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { deleteCommissioner } from "../../api/ffl";

function Settings({ league, user }) {
  const [rosterSettings, setRosterSettings] = useState({});
  const [settings, setSettings] = useState();
  const [prizes, setPrizes] = useState({});
  const [commissioners, setCommissioners] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCommissioner, setSelectedCommissioner] = useState();

  useEffect(() => {
    const fetchSettings = async (leagueId) => {
      try {
        const response = await leagueSettingsLoader(leagueId);
        setSettings(response);
        const responseRoster = await rosterSettingsLoader(leagueId);
        setRosterSettings(responseRoster);
        const responsePrizes = await leaguePrizeSettingsLoader(leagueId);
        setPrizes(responsePrizes);
        const responseCommissioners = await leagueCommissionerLoader(leagueId);
        setCommissioners(responseCommissioners);
      } catch (error) {
        console.error(error);
        return;
      }
    };
    fetchSettings(league?.LeagueId);
  }, [league?.LeagueId]);

  const handleDelete = async (id) => {
    setDeleteMessage();
    setShowDeleteConfirmation(true);
    setSelectedCommissioner(id);
  };

  const handleConfirmClick = async () => {
    setIsDeleting(true);
    const result = await deleteCommissioner(selectedCommissioner);
    setIsDeleting(false);
    if (result?.Message) {
      setDeleteMessage([result?.Message]);
    } else {
      const updatedCommissioners = commissioners.filter((commissioner) => {
        return commissioner.LeagueCommissionerId !== selectedCommissioner;
      });
      setCommissioners(updatedCommissioners);
    }
  };

  return (
    <Root title={"Settings"}>
      <PageToolbar title={"Settings"} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          bgcolor: "background.paper",
          borderRadius: 1,
          textAlign: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          <Commissioners
            leagueId={league?.LeagueId}
            commissioners={commissioners}
            setCommissioners={setCommissioners}
            handleDelete={handleDelete}
            isEditable={user?.isAdmin || user?.isCommissioner}
          />
          <ConfirmationDialog
            title={"Delete Commissioner"}
            open={showDeleteConfirmation}
            setOpen={setShowDeleteConfirmation}
            message={deleteMessage}
            isUpdating={isDeleting}
            handleConfirmClick={handleConfirmClick}
            confirmationMessage={
              "Are you sure you want to delete this commissioner?"
            }
          />
          <GeneralSettings
            leagueId={league?.LeagueId}
            settings={settings}
            isEditable={user?.isAdmin || user?.isCommissioner}
          />
          {prizes ? (
            <PrizeSettings
              leagueId={league?.LeagueId}
              prizes={prizes}
              isEditable={user?.isAdmin || user?.isCommissioner}
            />
          ) : null}
        </Box>
        {rosterSettings ? (
          <Paper
            sx={{
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
              border: 1,
            }}
          >
            <RosterSettings
              leagueId={league?.LeagueId}
              settings={rosterSettings}
              isEditable={user?.isAdmin || user?.isCommissioner}
            />
          </Paper>
        ) : null}
      </Box>
    </Root>
  );
}

export default withAuth(Settings);
