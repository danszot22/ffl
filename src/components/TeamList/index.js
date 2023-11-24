import { GridAddIcon, GridActionsCellItem } from '@mui/x-data-grid';
import { useCallback, useMemo, useState, useEffect } from 'react';
import Root from '../Root';
import { StyledDataGrid } from "../common/styled";
import TeamToolbar from './TeamToolbar';
import ManagerList from './ManagerList';
import { teamsLoader } from '../../api/graphql';
import PageToolbar from '../common/PageToolbar';
import { TextField, useMediaQuery, useTheme } from '@mui/material';
import withAuth from '../withAuth';
import useApiRef from '../../hooks/useApiRef';
import { addManager, deleteManager } from '../../api/ffl';
import ConfirmationDialog from '../common/ConfirmationDialog';

function TeamList({ league, user }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState({});
    const [selectedTeamOwner, setSelectedTeamOwner] = useState({});
    const [open, setOpen] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [email, setEmail] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState();
    const [isAdding, setIsAdding] = useState(false);
    const [addMessage, setAddMessage] = useState();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState();

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

    const handleClickAddOpen = (row) => {
        setAddMessage();
        setOpen(true);
        setSelectedTeam(row);
    };

    const handleClose = () => {
        setOpen(false);
        setEmail('');
        setSelectedTeam({});
    };

    const handleAddClick = async () => {
        const newManager = { TeamId: selectedTeam.TeamId, Email: email };
        setIsAdding(true);
        const result = await addManager(league?.LeagueId, newManager);
        setIsAdding(false);
        if (result?.Message) {
            setAddMessage([result?.Message]);
        }
        else {
            const updatedTeams = teams.map((team) => {
                if (team.TeamId !== selectedTeam.TeamId)
                    return team;
                else
                    return {
                        ...selectedTeam,
                        TeamOwner: {
                            items: [...selectedTeam.TeamOwner.items,
                            { TeamOwnerId: result?.TeamOwnerId, Email: email, status: 'new' }]
                        }
                    }
            });
            setTeams(updatedTeams);
            setEmail('');
            setSelectedTeam({});
            setOpen(false);
        }
    };

    const handleDelete = async (row, teamOwnerToDelete) => {
        setDeleteMessage();
        setShowDeleteConfirmation(true);
        setSelectedTeam(row);
        setSelectedTeamOwner(teamOwnerToDelete);
    }

    const handleConfirmClick = async () => {
        setIsDeleting(true);
        const result = await deleteManager(selectedTeamOwner.TeamOwnerId);
        setIsDeleting(false);
        if (result?.Message) {
            setDeleteMessage([result?.Message]);
        }
        else {
            const updatedTeams = teams.map((team) => {
                if (team.TeamId !== selectedTeam.TeamId)
                    return team;
                else {
                    const managers = selectedTeam.TeamOwner.items.filter((teamOwner) => {
                        return teamOwner.TeamOwnerId !== selectedTeamOwner.TeamOwnerId;
                    });
                    return {
                        ...selectedTeam,
                        TeamOwner: { items: [...managers] }
                    }
                }
            })
            setTeams(updatedTeams);
            setShowDeleteConfirmation(false);
        }
    };

    const columns = [
        { field: 'Division', width: isBelowMedium ? 50 : 100, headerName: 'Division', sortable: false, editable: false },
        { field: 'TeamName', width: isBelowMedium ? 160 : 240, headerName: 'Name', sortable: false, editable: true },
        { field: 'OwnerName', width: isBelowMedium ? 160 : 240, headerName: 'Owner', sortable: false, editable: true },
        { field: 'AvlAddDrops', width: isBelowMedium ? 50 : 100, headerName: '#Add/Drops', type: 'number', sortable: false, editable: true, },
        {
            field: 'managers',
            headerName: 'Managers',
            sortable: false,
            width: isBelowMedium ? 240 : 360,
            renderCell: (params) => (
                <ManagerList team={params.row} handleDeleteClick={handleDelete} isEditable={user?.isAdmin || user?.isCommissioner} />
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
                            label="Add Manager"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={() => handleClickAddOpen(row)}
                        />,
                    ] : [];
                return actions;
            },
        }];

    const { apiRef, columns: refColumns } = useApiRef(columns);
    return (
        <Root title={'Teams'}>
            <PageToolbar title={'Teams'} />
            <StyledDataGrid
                getRowId={(row) => row.TeamId}
                rows={teams}
                columns={refColumns}
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
                        teams,
                        apiRef,
                        leagueId: league?.LeagueId,
                        isUpdating,
                        setIsUpdating,
                        message,
                        setMessage
                    },
                }}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
            />
            <ConfirmationDialog title={'Delete Manager'} open={showDeleteConfirmation} setOpen={setShowDeleteConfirmation}
                message={deleteMessage} isUpdating={isDeleting} handleConfirmClick={handleConfirmClick}
                confirmationMessage={'Are you sure you want to delete this manager?'} />
            <ConfirmationDialog title={'Add Manager'} open={open} setOpen={handleClose}
                message={addMessage} isUpdating={isAdding} handleConfirmClick={handleAddClick}
                confirmationMessage={'To add a manager, please enter their email address here.'} >
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
        </Root>
    );
}

export default withAuth(TeamList);