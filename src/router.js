
import { Route, Routes, createBrowserRouter, useNavigate, } from "react-router-dom"
import TeamList from "./components/TeamList";
import PlayerList from "./components/PlayerList";
import LineupList from "./components/LineupList";
import Home from "./components/Home";
import Standings from "./components/Standings";
import Scoring from "./components/Scoring";
import Team from "./components/Team"
import Leaders from "./components/Leaders";
import Rosters from "./components/Rosters";
import TeamPrizes from "./components/TeamPrizes";
import Schedule from "./components/Schedule";
import Finances from "./components/Finances";
import Transactions from "./components/Transactions";
import WaiverResults from "./components/WaiverResults";
import Player from "./components/Player";
import Settings from "./components/Settings";
import LineupEdit from "./components/LineupEdit";
import RosterPlayerDrop from "./components/RosterPlayerDrop";
import RosterPlayerAdd from "./components/RosterPlayerAdd";
import TeamSettings from "./components/Team/TeamSettings";
import Breakdown from "./components/Standings/Breakdown";
import WaiverRequests from "./components/WaiverRequests";
import TeamTrades from "./components/Trades/TeamTrades";
import LeagueTrades from "./components/Trades/LeagueTrades";
import ProposeTrade from "./components/Trades/ProposeTrade";
import EditRosterSettings from "./components/Settings/EditRosterSettings";
import EditPrizeSettings from "./components/Settings/EditPrizeSettings";
import EditGeneralSettings from "./components/Settings/EditGeneralSettings";
import PlayoffBracket from "./components/Schedule/PlayoffBracket";
import EditLeagueSize from "./components/Settings/EditLeagueSize";
import Login from "./components/Login";
import Account from "./components/Account";
import fflInterceptors from "./api/fflInterceptors";
import { useEffect } from "react";
import ForgotUsername from "./components/Account/ForgotUsername";
import ForgotPassword from "./components/Account/ForgotPassword";
import ChangePassword from "./components/Account/ChangePassword";
import ResetPassword from "./components/Account/ResetPassword";

function Root() {
    const navigate = useNavigate();

    useEffect(() => {
        fflInterceptors(navigate);
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/ResetPassword/:id" element={<ResetPassword />} />
            <Route path="/ForgotUsername" element={<ForgotUsername />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Standings" element={<Standings />} />
            <Route path="/Breakdown" element={<Breakdown />} />
            <Route path="/Teams" element={<TeamList />} />
            <Route path="/Lineups" element={<LineupList />} />
            <Route path="/Lineup/Edit/:id" element={<LineupEdit />} />
            <Route path="/Lineup/Edit" element={<LineupEdit />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Schedule" element={<Schedule />} />
            <Route path="/Scoring" element={<Scoring />} />
            <Route path="/TeamPrizes" element={<TeamPrizes />} />
            <Route path="/Leaders" element={<Leaders />} />
            <Route path="/RosterPlayer/Drop/:id/:rosterPlayerId" element={<RosterPlayerDrop />} />
            <Route path="/RosterPlayer/Add/:playerId" element={<RosterPlayerAdd />} />
            <Route path="/Player/:id" element={<Player />} />
            <Route path="/Team/:id" element={<Team />} />
            <Route path="/TeamTrades" element={<TeamTrades />} />
            <Route path="/LeagueTrades" element={<LeagueTrades />} />
            <Route path="/RosterSettings/Edit" element={<EditRosterSettings />} />
            <Route path="/PrizeSettings/Edit" element={<EditPrizeSettings />} />
            <Route path="/GeneralSettings/Edit" element={<EditGeneralSettings />} />
            <Route path="/ProposeTrade" element={<ProposeTrade />} />
            <Route path="/WaiverRequests" element={<WaiverRequests />} />
            <Route path="/TeamSettings/:leagueId/:teamId" element={<TeamSettings />} />
            <Route path="/Team" element={<Team />} />
            <Route path="/Rosters" element={<Rosters />} />
            <Route path="/Finances" element={<Finances />} />
            <Route path="/Transactions" element={<Transactions />} />
            <Route path="/PlayoffBracket" element={<PlayoffBracket />} />
            <Route path="/WaiverResults" element={<WaiverResults />} />
            <Route path="/League/Size" element={<EditLeagueSize />} />
        </Routes>
    );
}

export const router = createBrowserRouter([
    { path: "*", Component: Root },
    { path: "/PlayerList/:id", Component: PlayerList }
]);