import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MenuList from './MenuList';
import AccountMenu from './AccountMenu';
import { formatFantasyTeamName } from '../../utils/helpers';

export default function NavItems({ leagues, league, teams, team, isAuthenticated, user }) {
    return (
        <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button color="inherit" to="/">Home</Button >
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button color="inherit" to="/Standings">Standings</Button>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button color="inherit" to="/Scoring">Scoring</Button>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <MenuList title="Lineups">
                    <MenuItem to="/Lineups">View Lineups</MenuItem>
                    <MenuItem to="/Lineup/Edit">Edit Lineup</MenuItem>
                </MenuList>
            </Typography>
            {team?.TeamId ?
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" to="/Team">Team</Button >
                </Typography>
                : null}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <MenuList title="Players">
                    <MenuItem to="/PlayerList/1?availability=All&spot=All">Player Listing</MenuItem>
                    <MenuItem to="/Leaders" >Statistical Leaders</MenuItem>
                </MenuList>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <MenuList title="League">
                    <MenuItem to="/Teams">Teams</MenuItem>
                    <MenuItem to="/Transactions">Transactions</MenuItem>
                    <MenuItem to="/LeagueTrades">Trades</MenuItem>
                    <MenuItem to="/Settings">Settings</MenuItem>
                    <MenuItem to="/Rosters">Rosters</MenuItem>
                    <MenuItem to="/Schedule">Schedule</MenuItem>
                    <MenuItem to="/Finances">Finances</MenuItem>
                </MenuList>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <MenuList title="Opposing Teams">
                    {
                        teams.filter((leagueTeam) => leagueTeam.TeamId !== team?.teamId)
                            .map((leagueTeam) => (
                                <MenuItem key={leagueTeam.TeamId} to={`/Team/${leagueTeam.TeamId}`}>
                                    {formatFantasyTeamName(leagueTeam)}
                                </MenuItem>))
                    }
                </MenuList>
            </Typography>
            {isAuthenticated ? <AccountMenu user={user} leagues={leagues} league={league} team={team} /> : null}
        </>
    )
}