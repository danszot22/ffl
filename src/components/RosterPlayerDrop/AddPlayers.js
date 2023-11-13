import { useState } from "react";
import { formatPlayerFullName } from "../../utils/helpers";
import { MaterialReactTable } from 'material-react-table';
import { getTransactionText } from "../../api/ffl";
import { Box, Typography, Button, Skeleton, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton } from "@mui/material";
import { alpha } from '@mui/material/styles';
import usePlayerTableLoader from "../../hooks/usePlayerTableLoader";
import usePlayerTableColumns from "../../hooks/usePlayerTableColumns";
import { PersonAdd } from "@mui/icons-material";

export default function AddPlayers({ teamId, rosterPlayerToDrop, leagueId, }) {
    const [open, setOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState({});
    const [transactionText, setTransactionText] = useState('');

    const {
        nflTeamFilter, setNflTeamFilter,
        positionFilter, setPositionFilter,
        isError, isLoading, isRefetching,
        players, rowCount,
        columnFilters, setColumnFilters,
        pagination, setPagination,
        sorting, setSorting,
    } = usePlayerTableLoader(1, "All", "Available", leagueId);
    const { columns, positions, nflTeams, isLoadingPositions } = usePlayerTableColumns("All", leagueId, teamId, rosterPlayerToDrop, setPositionFilter);

    const handleClose = () => {
        setOpen(false);
        setSelectedPlayer({});
    };

    const handleClickOpen = (playerToAdd) => {
        setOpen(true);
        setSelectedPlayer(playerToAdd);

        const fetchText = async (nflTeamId, rosterPlayerId) => {
            const response = await getTransactionText(nflTeamId, rosterPlayerId);
            setTransactionText(response);
        }
        fetchText(playerToAdd.NflTeamId, rosterPlayerToDrop?.RosterPlayerId);
    };

    function handleClickConfirm() {
        console.log(rosterPlayerToDrop.TeamId, rosterPlayerToDrop.RosterPlayerId, selectedPlayer);

        setOpen(false);
        setSelectedPlayer({});
        //TODO : Call API
    }

    return (
        <>
            {isLoadingPositions ?
                <Skeleton sx={{ p: 1 }} variant="rectangular" height={40}>Loading...</Skeleton>
                :
                <>
                    <Box
                        sx={{
                            justifyContent: 'center',
                            flexGrow: 1,
                            display: { xs: 'flex', sm: 'none' },
                            flexDirection: 'row',
                            p: 1,
                            gap: 1,
                        }}
                    >
                        <FormControl fullWidth>
                            <InputLabel id="lineup-team-select-label">Pro Team</InputLabel>
                            <Select
                                labelId="pro-team-select-label"
                                id="ProTeam"
                                label="Pro Team"
                                value={nflTeamFilter}
                                onChange={(event) => setNflTeamFilter(event.target.value)}
                            >
                                {nflTeams?.map((nflteam, index) => (
                                    <MenuItem key={nflteam} value={nflteam}>{`${nflteam}`}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="position-select-label">Position</InputLabel>
                            <Select
                                labelId="position-select-label"
                                id="position"
                                label="Position"
                                value={positionFilter}
                                onChange={(event) => setPositionFilter(event.target.value)}
                            >
                                {positions?.map((i) => (
                                    <MenuItem key={i} value={i}>{i}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <MaterialReactTable columns={columns} data={players} getRowId={(row) => row.PlayerId}
                        manualFiltering
                        manualPagination
                        manualSorting
                        enableRowActions
                        initialState={{ showColumnFilters: true }}
                        muiToolbarAlertBannerProps={
                            isError
                                ? {
                                    color: 'error',
                                    children: 'Error loading data',
                                }
                                : undefined
                        }
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', gap: '1rem' }}>
                                {!row.original.OwnerName ?
                                    <Tooltip title="Add">
                                        <IconButton color="success" onClick={() => handleClickOpen(row.original)}>
                                            <PersonAdd />
                                        </IconButton>
                                    </Tooltip>
                                    : null
                                }
                            </Box>
                        )}
                        renderTopToolbar={({ table }) => (
                            <Typography sx={{ p: 1, m: 1, backgroundColor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity), }}>Add Player</Typography>
                        )}
                        isLoading={isLoading}
                        isRefetching={isRefetching}
                        onColumnFiltersChange={setColumnFilters}
                        onPaginationChange={setPagination}
                        onSortingChange={setSorting}
                        rowCount={rowCount}
                        state={{
                            columnFilters,
                            isLoading,
                            pagination,
                            showAlertBanner: isError,
                            showProgressBars: isRefetching,
                            showSkeletons: isLoading || isRefetching,
                            sorting,
                        }} />
                </>}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Move"}
                </DialogTitle>
                <DialogContent >
                    <DialogContentText component="div" id="alert-dialog-description">
                        <Typography component="div">
                            {selectedPlayer?.PlayerName ? `Adding ${formatPlayerFullName(selectedPlayer?.PlayerName)} ${selectedPlayer?.PositionCode}` : null}
                        </Typography>
                        <Typography component="div">
                            {rosterPlayerToDrop?.PlayerName ? `Dropping ${formatPlayerFullName(rosterPlayerToDrop?.PlayerName)} ${rosterPlayerToDrop?.PositionCode}` : null}
                        </Typography>
                        {transactionText.length === 0 ?
                            <Skeleton sx={{ p: 1 }} variant="rectangular" height={40}>Loading...</Skeleton>
                            :
                            <Typography component="div">
                                {transactionText}
                            </Typography>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={transactionText.length === 0} onClick={handleClickConfirm} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}