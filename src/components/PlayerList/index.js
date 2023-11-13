import { MaterialReactTable } from 'material-react-table';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton } from "@mui/material";
import { useSearchParams, useParams } from 'react-router-dom';
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import Root from "../Root";
import usePlayerTableColumns from "../../hooks/usePlayerTableColumns";
import usePlayerTableLoader from "../../hooks/usePlayerTableLoader";
import { PersonAdd, PersonRemove } from '@mui/icons-material';

function PlayerList({ league, team }) {
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const {
        nflTeamFilter, setNflTeamFilter,
        positionFilter, setPositionFilter,
        availability, spot, summaryType,
        isError, isLoading, isRefetching,
        players, rowCount,
        columnFilters, setColumnFilters,
        pagination, setPagination,
        sorting, setSorting,
    } = usePlayerTableLoader(id,
        searchParams.has("spot") ? searchParams.get("spot") : "All",
        searchParams.has("availability") ? searchParams.get("availability") : "All",
        league?.LeagueId);
    const { columns, positions, nflTeams } = usePlayerTableColumns(spot);

    return (
        <Root title={'Players'}>
            <PageToolbar title={'Players'} />
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
                muiTableBodyCellProps={{
                    sx: { pr: 0 }
                }}
                manualFiltering
                manualPagination
                manualSorting
                enableRowActions
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: '',
                        size: 50
                    },
                }}
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
                                <IconButton color="success" to={`/RosterPlayer/Add/${row.original.PlayerId}`}>
                                    <PersonAdd />
                                </IconButton>
                            </Tooltip>
                            : null
                        }
                        {row.original.TeamId && row.original.TeamId === team?.TeamId ?
                            <Tooltip title="Drop">
                                <IconButton color="error" to={`/RosterPlayer/Drop/${row.original.TeamId}/${row.original.PlayerId}`}>
                                    <PersonRemove />
                                </IconButton>
                            </Tooltip> : null
                        }
                    </Box>
                )}
                renderTopToolbar={({ table }) => (
                    <Typography sx={{ p: 1, m: 1 }}>{(summaryType === "5" ?
                        "Weekly Projections" : "Player Listing")} - {availability} {spot === "DF"
                            ? "Defensive Players" :
                            spot === "RB" ? "Running Backs" :
                                spot === "R" ? "Receivers" :
                                    spot === "TMPK" ? "Team Kickers" :
                                        spot === "TMQB" ? "Team Quarterbacks" :
                                            "Players"}</Typography>
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
        </Root>
    )
}

export default withAuth(PlayerList);