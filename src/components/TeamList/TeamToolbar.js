import { EventRepeat, Layers, Send } from '@mui/icons-material';
import { Box, Button, CircularProgress, Toolbar, Tooltip, Typography } from '@mui/material';
import { GridRowModes } from '@mui/x-data-grid';
import { recreateSchedule, reorganizeLeague, sendInvitations, updateTeams } from '../../api/ffl';

function TeamToolbar(props) {
    const { gridMode, rowModesModel, setRowModesModel, teams, apiRef, leagueId, isUpdating, setIsUpdating, message, setMessage } = props;

    const convertArrayToObject = (array, key, mode, ignoreModifications) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]: {
                    ...rowModesModel[item[key]],
                    mode, ignoreModifications,
                },
            };
        }, initialValue);
    };

    const handleSaveOrEdit = async () => {
        setMessage();
        if (gridMode === 'edit') {
            setRowModesModel(convertArrayToObject(teams, 'TeamId', GridRowModes.View, false));
            const updatedRows = Object.keys(apiRef?.current?.state.editRows).map((key) => {
                return {
                    TeamId: +key,
                    TeamName: apiRef?.current?.state.editRows[key]?.TeamName?.value,
                    OwnerName: apiRef?.current?.state.editRows[key]?.OwnerName?.value,
                    AvlAddDrops: apiRef?.current?.state.editRows[key]?.AvlAddDrops?.value
                }
            });
            setIsUpdating(true);
            const result = await updateTeams(leagueId, updatedRows);
            setIsUpdating(false);
            if (result?.Message) {
                setMessage([result?.Message]);
            }

        } else {
            setRowModesModel(convertArrayToObject(teams, 'TeamId', GridRowModes.Edit, true));
        }
    };

    const handleCancel = () => {
        setRowModesModel(convertArrayToObject(teams, 'TeamId', GridRowModes.View, true));
    };

    const handleSendInvites = async () => {
        setIsUpdating(true);
        const result = await sendInvitations(leagueId);
        setIsUpdating(false);
        if (result?.Message) {
            setMessage([result?.Message]);
        }
    };

    const handleReorganizeDivisions = async () => {
        setIsUpdating(true);
        const result = await reorganizeLeague(leagueId);
        setIsUpdating(false);
        if (result?.Message) {
            setMessage([result?.Message]);
        }
    };

    const handleRecreateSchedule = async () => {
        setIsUpdating(true);
        const result = await recreateSchedule(leagueId);
        setIsUpdating(false);
        if (result?.Message) {
            setMessage([result?.Message]);
        }
    };

    const handleMouseDown = (event) => {
        // Keep the focus in the cell
        event.preventDefault();
    };

    return (
        <Toolbar
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                pt: { xs: 1 },
                pl: { sm: 1 },
                pr: { xs: 1, sm: 1, },
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'row',
            }}
            >
                <Button
                    onClick={handleSaveOrEdit}
                    onMouseDown={handleMouseDown}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    {gridMode === 'edit' ? 'Save' : 'Edit'}
                </Button>
                <Button
                    onClick={handleCancel}
                    onMouseDown={handleMouseDown}
                    disabled={gridMode === 'view'}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    Cancel
                </Button>
                {isUpdating ? <CircularProgress /> : null}
                <Tooltip arrow placement="right" title="Send Invitations" >
                    <Button onClick={handleSendInvites}>
                        <Send />
                    </Button>
                </Tooltip>
                <Tooltip arrow placement="right" title="Reorganize Divisions" >
                    <Button onClick={handleReorganizeDivisions}>
                        <Layers />
                    </Button>
                </Tooltip>
                <Tooltip arrow placement="right" title="Recreate Schedule" >
                    <Button onClick={handleRecreateSchedule}>
                        <EventRepeat />
                    </Button>
                </Tooltip>
                <Typography color="error">{message}</Typography>
            </Box>
        </Toolbar>
    );
}

export default TeamToolbar;