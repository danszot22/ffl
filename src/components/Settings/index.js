import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { useState, useEffect } from "react";
import { leagueSettingsLoader, rosterSettingsLoader, leaguePrizeSettingsLoader, leagueCommissionerLoader } from "../../api/graphql";
import { Box, Paper } from '@mui/material';
import Commissioners from "./Commissioners";
import GeneralSettings from "./GeneralSettings";
import PrizeSettings from "./PrizeSettings";
import RosterSettings from "./RosterSettings";
import withAuth from "../withAuth";

function Settings({ league, user }) {
    const [rosterSettings, setRosterSettings] = useState({});
    const [settings, setSettings] = useState();
    const [prizes, setPrizes] = useState({});
    const [commissioners, setCommissioners] = useState([]);

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
        }
        fetchSettings(league?.LeagueId);
    }, [
        league?.LeagueId,
    ]);

    const handleDelete = (id) => {
        const updatedCommissioners = commissioners.filter((commissioner) => {
            return commissioner.LeagueCommissionerId !== id;
        });
        setCommissioners(updatedCommissioners);

        //TODO Call API
    }

    return (
        <Root title={'Settings'}>
            <PageToolbar title={'Settings'} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    textAlign: 'center',
                    gap: 2,
                    mt: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        textAlign: 'center',
                        flexGrow: 1,
                    }}
                >
                    <Commissioners commissioners={commissioners} handleDelete={handleDelete} isEditable={user?.isAdmin || user?.isCommissioner} />
                    <GeneralSettings settings={settings} isEditable={user?.isAdmin || user?.isCommissioner} />
                    {prizes ?
                        <PrizeSettings prizes={prizes} isEditable={user?.isAdmin || user?.isCommissioner} />
                        : null}
                </Box>
                {rosterSettings ?
                    <Paper sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, border: 1 }}>
                        <RosterSettings settings={rosterSettings} isEditable={user?.isAdmin || user?.isCommissioner} />
                    </Paper>
                    : null}
            </Box>
        </Root>

    )
}

export default withAuth(Settings);