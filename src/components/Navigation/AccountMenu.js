import { useContext, useState } from 'react';
import { Box, Avatar, Menu, MenuItem, Divider, Tooltip, IconButton, ListItemIcon, MenuList, Typography, ListItemText } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import { FantasyTeamContext, setLeague, setTeam, setUser } from '../../contexts/FantasyTeamContext';
import { useNavigate } from 'react-router-dom';
import { Password } from '@mui/icons-material';
import { dispatchLeagueChange, formatFantasyTeamName } from '../../utils/helpers';
import { updateDefaultLeague } from '../../api/ffl';

export default function AccountMenu({ user, leagues, league, team }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { dispatch } = useContext(FantasyTeamContext);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = async (leagueId) => {
        await updateDefaultLeague(user?.userId, leagueId);
        dispatchLeagueChange(dispatch, user.userId, leagueId);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        dispatch(setTeam(null));
        dispatch(setLeague(null));
        dispatch(setUser(null));
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate(`/Login`);
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>{user?.firstName?.length > 0 ? user?.firstName[0] : '?'}</Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem disabled>
                    <ListItemText primaryTypographyProps={{
                        fontWeight: 'bolder',
                        variant: 'body2',
                    }} secondaryTypographyProps={{
                        fontWeight: 'bolder',
                        variant: 'body2',
                    }}
                        primary={`${league?.LeagueName}`} secondary={team ? (formatFantasyTeamName(team)) : null} />
                </MenuItem>
                <Divider />
                <MenuItem to="/Account">
                    <Avatar />Profile
                </MenuItem>
                <MenuItem to="/ChangePassword">
                    <ListItemIcon> <Password /></ListItemIcon>Change Password
                </MenuItem>
                <Divider />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <MenuList title="Leagues">
                        {
                            leagues
                                .filter((siteLeague) => siteLeague.LeagueId !== league?.LeagueId)
                                .map((siteLeague) => (
                                    <MenuItem key={siteLeague.LeagueId} onClick={() => handleChange(siteLeague.LeagueId)}>
                                        {siteLeague.LeagueName}
                                    </MenuItem>)
                                )
                        }
                    </MenuList>
                </Typography>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}
