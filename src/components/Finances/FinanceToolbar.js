import { Button, Toolbar } from '@mui/material';
import { GridRowModes } from '@mui/x-data-grid';

function FinanceToolbar(props) {
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

    const handleMouseDown = (event) => {
        // Keep the focus in the cell
        event.preventDefault();
    };

    return (
        <Toolbar
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'row',
                pt: { xs: 1 },
                pl: { sm: 1 },
                pr: { xs: 1, sm: 1, },
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
        </Toolbar>
    );
}

export default FinanceToolbar;