import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Drawer, Typography } from '@mui/material';
import { teamsLoader, userLeaguesLoader } from '../../api/graphql';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NavItems from './NavItems';
import withAuth from '../withAuth';

function Navigation({ league, team, isAuthenticated, user, title, subtitle }) {
    const [teams, setTeams] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        const fetchData = async (leagueId) => {
            if (leagueId) {
                setTeams(await teamsLoader(leagueId));
            }
            if (user?.userId) {
                setLeagues(await userLeaguesLoader(user?.userId));
            }
        }
        fetchData(league?.LeagueId);
    }, [user?.userId, league?.LeagueId]);

    return (
        <>
            <AppBar position="sticky" sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
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
                    <div style={{ width: '100%' }}>
                        <Box sx={{
                            alignItems: 'center',
                            alignContent: 'center',
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Typography
                                sx={{ fontWeight: 700, }}
                                variant="h6"
                                id="pageTitle"
                                component="div"
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                id="pageSubtitle"
                                component="div"
                            >
                                {subtitle}
                            </Typography>
                        </Box>
                    </div>
                </Box>
            </AppBar>
            <AppBar position="sticky" sx={{ display: { xs: 'none', md: 'block' } }}>
                <Toolbar>
                    <NavItems league={league} team={team} leagues={leagues} teams={teams} isAuthenticated={isAuthenticated} user={user} />
                </Toolbar>
            </AppBar>
        </>
    )
}

export default withAuth(Navigation);