import { EventRepeat, Layers, Send } from '@mui/icons-material';
import { Box, Button, Toolbar, Tooltip } from '@mui/material';
import { GridRowModes } from '@mui/x-data-grid';

function TeamToolbar(props) {
    const { gridMode, rowModesModel, setRowModesModel, teams } = props;

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

    const handleSaveOrEdit = () => {
        if (gridMode === 'edit') {
            setRowModesModel(convertArrayToObject(teams, 'TeamId', GridRowModes.View, false));
            //TODO : Call API
        } else {
            setRowModesModel(convertArrayToObject(teams, 'TeamId', GridRowModes.Edit, true));
        }
    };

    const handleCancel = () => {
        setRowModesModel(convertArrayToObject(teams, 'TeamId', GridRowModes.View, true));
    };

    const handleSendInvites = () => {
        //setRowModesModel(convertArrayToObject(teams, 'id', GridRowModes.View, true));
        //TODO : Call API
    };

    const handleReorganizeDivisions = () => {
        //setRowModesModel(convertArrayToObject(teams, 'id', GridRowModes.View, true));
        //TODO : Call API
    };

    const handleRecreateSchedule = () => {
        //setRowModesModel(convertArrayToObject(teams, 'id', GridRowModes.View, true));
        //TODO : Call API
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
            </Box>
        </Toolbar>
    );
}

export default TeamToolbar;