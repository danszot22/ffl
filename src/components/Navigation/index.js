import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Drawer } from '@mui/material';
import { teamsLoader, userLeaguesLoader } from '../../api/graphql';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NavItems from './NavItems';
import withAuth from '../withAuth';

function Navigation({ league, team, isAuthenticated, user }) {
    const [teams, setTeams] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        const fetchData = async (leagueId) => {
            setTeams(await teamsLoader(leagueId));
            setLeagues(await userLeaguesLoader(user?.userId));
        }
        fetchData(league?.LeagueId);
    }, [user?.userId, league?.LeagueId]);

    return (
        <>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer(true)}
                    edge="start"
                    sx={{ m: 1, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="left"
                    open={open}
                    onClose={toggleDrawer(false)}
                >
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        onKeyDown={toggleDrawer(false)}
                    >
                        <NavItems league={league} team={team} leagues={leagues} teams={teams} isAuthenticated={isAuthenticated} user={user} />
                    </Box>
                </Drawer>
            </Box>
            <AppBar position="sticky" sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Toolbar>
                    <NavItems league={league} team={team} leagues={leagues} teams={teams} isAuthenticated={isAuthenticated} user={user} />
                </Toolbar>
            </AppBar>
        </>
    )
}

export default withAuth(Navigation);