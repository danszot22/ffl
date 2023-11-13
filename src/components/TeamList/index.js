import { GridAddIcon, GridDeleteIcon, GridActionsCellItem } from '@mui/x-data-grid';
import { useCallback, useMemo, useState, useEffect } from 'react';
import Root from '../Root';
import { StyledDataGrid } from "../common/styled";
import TeamToolbar from './TeamToolbar';
import ManagerList from './ManagerList';
import { teamsLoader } from '../../api/graphql';
import PageToolbar from '../common/PageToolbar';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import withAuth from '../withAuth';

function TeamList({ league, user }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState({});
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchTeams = async (leagueId) => {
            const response = await teamsLoader(leagueId);
            setTeams(response);
        }
        fetchTeams(league?.LeagueId);
    }, [league]);

    const [rowModesModel, setRowModesModel] = useState({});

    const gridMode = useMemo(() => {
        return rowModesModel[teams[0]?.TeamId]?.mode || 'view';
    }, [teams, rowModesModel]);

    const handleCellKeyDown = useCallback(
        (params, event) => {
            if (gridMode === 'edit') {
                // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
                event.defaultMuiPrevented = true;
            }
        },
        [gridMode],
    );

    const handleCellEditStop = useCallback((params, event) => {
        event.defaultMuiPrevented = true;
    }, []);

    const handleClickOpen = (row) => {
        setOpen(true);
        setSelectedTeam(row);
    };

    const handleClose = () => {
        setOpen(false);
        setEmail('');
        setSelectedTeam({});
    };

    const handleAddClick = () => {
        const updatedTeams = teams.map((team) => {
            if (team.TeamId !== selectedTeam.TeamId)
                return team;
            else
                return {
                    ...selectedTeam,
                    TeamOwner: { items: [...selectedTeam.TeamOwner.items, { Email: email, status: 'new' }] }
                }
        });
        setTeams(updatedTeams);
        setEmail('');
        setSelectedTeam({});
        setOpen(false);
        //TODO : Call API
    };

    const handleDeleteTeamClick = (row) => {
        const updatedTeams = teams.filter((team) => {
            return (team.TeamId !== row.TeamId);
        })
        setTeams(updatedTeams);
        //TODO : Call API
    };

    const handleManagerDeleteClick = (row, teamOwnerToDelete) => {
        const updatedTeams = teams.map((team) => {
            if (team.TeamId !== row.TeamId)
                return team;
            else {
                const managers = row.TeamOwner.items.filter((teamOwner) => {
                    return teamOwner.TeamOwnerId !== teamOwnerToDelete.TeamOwnerId;
                });
                return {
                    ...row,
                    TeamOwner: { items: [...managers] }
                }
            }
        })
        setTeams(updatedTeams);
        //TODO : Call API
    };

    const columns = [
        { field: 'Division', width: isBelowMedium ? 30 : 100, headerName: 'Division', sortable: false, editable: false },
        { field: 'TeamName', width: isBelowMedium ? 80 : 240, headerName: 'Name', sortable: false, editable: true },
        { field: 'OwnerName', width: isBelowMedium ? 80 : 240, headerName: 'Owner', sortable: false, editable: true },
        { field: 'AvlAddDrops', width: isBelowMedium ? 30 : 100, headerName: '#Add/Drops', type: 'number', sortable: false, editable: true, },
        {
            field: 'managers',
            headerName: 'Managers',
            sortable: false,
            width: 360,
            renderCell: (params) => (
                <ManagerList team={params.row} handleDeleteClick={handleManagerDeleteClick} isEditable={user?.isAdmin || user?.isCommissioner} />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: isBelowMedium ? 75 : 100,
            cellClassName: 'actions',
            getActions: ({ row }) => {
                const actions = (user?.isAdmin || user?.isCommissioner) ?
                    [
                        <GridActionsCellItem
                            icon={<GridAddIcon />}
                            label="Add"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={() => handleClickOpen(row)}
                        />,
                        <GridActionsCellItem
                            icon={<GridDeleteIcon />}
                            label="Delete"
                            className="textPrimary"
                            onClick={() => handleDeleteTeamClick(row)}
                            color="inherit"
                        />,
                    ] : [];
                return actions;
            },
        }];

    return (
        <Root title={'Teams'}>
            <PageToolbar title={'Teams'} />
            <StyledDataGrid
                getRowId={(row) => row.TeamId}
                rows={teams}
                columns={columns}
                getRowHeight={(row) => {
                    return row.model.TeamOwner.items.length * 120 * row.densityFactor;
                }}
                onCellKeyDown={handleCellKeyDown}
                rowModesModel={rowModesModel}
                onCellEditStop={handleCellEditStop}
                onRowModesModelChange={(model) => setRowModesModel(model)}
                disableColumnMenu
                onCellEditStart={(params, event) => {
                    event.defaultMuiPrevented = true;
                }}
                hideFooter
                slots={(user?.isAdmin || user?.isCommissioner) ? {
                    toolbar: TeamToolbar,
                } : null}
                slotProps={{
                    toolbar: {
                        gridMode,
                        rowModesModel,
                        setRowModesModel,
                        teams
                    },
                }}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Manager</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a manager, please enter their email address here.
                    </DialogContentText>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddClick}>Add</Button>
                </DialogActions>
            </Dialog>
        </Root>
    );
}

export default withAuth(TeamList);