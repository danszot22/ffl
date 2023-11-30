import { Button, CircularProgress, Toolbar, Typography } from "@mui/material";
import { GridRowModes } from "@mui/x-data-grid";
import { updateFinances } from "../../api/ffl";

function FinanceToolbar(props) {
  const {
    gridMode,
    rowModesModel,
    setRowModesModel,
    teams,
    apiRef,
    leagueId,
    isUpdating,
    setIsUpdating,
    message,
    setMessage,
  } = props;

  const convertArrayToObject = (array, key, mode, ignoreModifications) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: {
          ...rowModesModel[item[key]],
          mode,
          ignoreModifications,
        },
      };
    }, initialValue);
  };

  const handleSaveOrEdit = async () => {
    if (gridMode === "edit") {
      setRowModesModel(
        convertArrayToObject(teams, "TeamId", GridRowModes.View, false)
      );
      const updatedRows = Object.keys(apiRef?.current?.state.editRows).map(
        (key) => {
          return {
            TeamId: +key,
            EntryFee: apiRef?.current?.state.editRows[key]?.EntryFee?.value,
            FeesPaid: apiRef?.current?.state.editRows[key]?.FeesPaid?.value,
            WinningsPaid:
              apiRef?.current?.state.editRows[key]?.WinningsPaid?.value,
          };
        }
      );
      setIsUpdating(true);
      const result = await updateFinances(leagueId, updatedRows);
      setIsUpdating(false);
      if (result?.Message) {
        setMessage([result?.Message]);
      }
    } else {
      setRowModesModel(
        convertArrayToObject(teams, "TeamId", GridRowModes.Edit, true)
      );
    }
  };

  const handleCancel = () => {
    setRowModesModel(
      convertArrayToObject(teams, "TeamId", GridRowModes.View, true)
    );
  };

  const handleMouseDown = (event) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <Toolbar
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        pt: { xs: 1 },
        pl: { sm: 1 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Button
        onClick={handleSaveOrEdit}
        onMouseDown={handleMouseDown}
        variant="outlined"
        sx={{ ml: 1 }}
      >
        {gridMode === "edit" ? "Save" : "Edit"}
      </Button>
      <Button
        onClick={handleCancel}
        onMouseDown={handleMouseDown}
        disabled={gridMode === "view"}
        variant="outlined"
        sx={{ ml: 1 }}
      >
        Cancel
      </Button>
      {isUpdating ? <CircularProgress /> : null}
      <Typography color="error">{message}</Typography>
    </Toolbar>
  );
}

export default FinanceToolbar;
