import { useState, useEffect, useMemo } from "react";
import { formatPlayerFullName, playerStatusCodes } from "../../utils/helpers";
import { MaterialReactTable } from 'material-react-table';
import { leaguePlayersLoader, nflTeamsLoader } from "../../api/graphql";
import { getPositionsToAdd, getTransactionText } from "../../api/ffl";
import { Box, Link, Typography, Button, Skeleton, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog } from "@mui/material";
import { alpha } from '@mui/material/styles';

export default function AddPlayers({ teamId, rosterPlayerToDrop, leagueId }) {
    const [open, setOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState({});
    const [transactionText, setTransactionText] = useState('');

    const [nflTeams, setNflTeams] = useState([]);
    const [nameFilter, setNameFilter] = useState(' ');
    const [nflTeamFilter, setNflTeamFilter] = useState('All');
    const [positionFilter, setPositionFilter] = useState(' ');
    const [positions, setPositions] = useState([]);

    const [players, setPlayers] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isLoadingPositions, setIsLoadingPositions] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    const [columnFilters, setColumnFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingPositions(true);
            if (rosterPlayerToDrop && rosterPlayerToDrop.PlayerId) {
                const result = await getPositionsToAdd(leagueId, teamId, rosterPlayerToDrop.PlayerId);
                setPositions(result);
                setPositionFilter(result.join(','));
            }
            setIsLoadingPositions(false);

        }
        fetchData();
    }, [
        rosterPlayerToDrop,
        teamId,
        leagueId
    ]);

    useEffect(() => {
        setNameFilter(' ');
        setNflTeamFilter('All');
        setPositionFilter(positions.join(','));
        columnFilters.forEach((columnFilter) => {
            if (columnFilter.id === "PlayerName") {
                setNameFilter(columnFilter.value);
            }
            if (columnFilter.id === "NflTeamName") {
                setNflTeamFilter(columnFilter.value);
            }
            if (columnFilter.id === "PositionCode") {
                setPositionFilter(columnFilter.value);
            }
        })
    }, [
        positions,
        columnFilters
    ]);

    useEffect(() => {
        const fetchTeams = async () => {
            const response = await nflTeamsLoader();
            setNflTeams(response);
        }
        fetchTeams();
    }, []);

    useEffect(() => {
        const fetchPlayers = async () => {
            setIsLoading(true);
            setIsRefetching(true);
            try {
                const response = await leaguePlayersLoader(leagueId, "All", "Available", pagination.pageIndex + 1, pagination.pageSize, 1,
                    positionFilter, nflTeamFilter, nameFilter,
                    sorting?.length > 0 ? sorting[0].id : "Points",
                    sorting?.length > 0 ? (sorting[0].desc ? "DESC" : "ASC") : "DESC");
                setPlayers(response);
                setRowCount(response[0]?.TotalRows);
            } catch (error) {
                setIsError(true);
                console.error(error);
                return;
            }
            setIsError(false);
            setIsLoading(false);
            setIsRefetching(false);
        }
        fetchPlayers();
    }, [
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        leagueId,
        nameFilter, positionFilter, nflTeamFilter,
    ]);

    const columns = useMemo(
        () => {
            let allcolumns = [
                {
                    accessorFn: (row) => row.RowNumber,
                    id: "RowNumber",
                    header: "#",
                    size: 50,
                    enableSorting: false,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => formatPlayerFullName(row?.PlayerName), //accessorFn used to join multiple data into a single cell
                    id: 'PlayerName', //id is still required when using accessorFn instead of accessorKey
                    header: 'Name',
                    size: 250,
                    enableSorting: false,
                    Cell: ({ renderedCellValue, row }) => (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            {row.original.PositionCode?.startsWith('TM') ?
                                <img
                                    alt={row.original?.DisplayCode}
                                    height={30}
                                    src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${row.original?.DisplayCode}.png&h=150&w=150`}
                                    loading="lazy"
                                    style={{ borderRadius: '50%' }}
                                /> : row.original.EspnPlayerId ?
                                    <img
                                        alt="?"
                                        height={30}
                                        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${row.original.EspnPlayerId}.png&h=120&w=120&scale=crop`}
                                        loading="lazy"
                                        style={{ borderRadius: '50%' }}
                                    /> :
                                    <img
                                        alt="?"
                                        height={30}
                                        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=120&h=120&scale=crop`}
                                        loading="lazy"
                                        style={{ borderRadius: '50%' }}
                                    />
                            }
                            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                            <Link to={`/Player/${row.original.PlayerId}`}>{renderedCellValue}</Link>
                            <Typography variant="caption">{playerStatusCodes[row.original.StatusCode]}</Typography>
                        </Box>
                    ),
                },
                {
                    accessorFn: (row) => row.Name != null ? `${row.Name}` : 'Free Agent',
                    id: 'NflTeamName',
                    header: 'Team',
                    size: 200,
                    enableSorting: false,
                    filterVariant: 'select',
                    filterSelectOptions: ['All', ...nflTeams],
                    Cell: ({ renderedCellValue, row }) => (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            {
                                row.original.DisplayCode ?
                                    <img
                                        alt={row.original.DisplayCode}
                                        height={30}
                                        src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${row.original.DisplayCode}.png&h=150&w=150`}
                                        loading="lazy"
                                        style={{ borderRadius: '50%' }}
                                    /> :
                                    <img
                                        alt="Free Agent"
                                        height={30}
                                        src='https://secure.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png&h=150&w=150'
                                        loading="lazy"
                                        style={{ borderRadius: '50%' }} />
                            }
                            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                            <span>{renderedCellValue}</span>
                        </Box>
                    ),
                },
                {
                    accessorFn: (row) => row.PositionCode != null ? `${row.PositionCode}` : ' ',
                    id: 'PositionCode',
                    header: 'Position',
                    size: 50,
                    enableSorting: false,
                    filterVariant: 'select',
                    filterSelectOptions: positions,
                },
                {
                    accessorFn: (row) => row.OwnerName != null ? `${row.OwnerName}` : 'Available',
                    id: 'Availability',
                    header: 'Type',
                    size: 150,
                    enableSorting: false,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.StatusDescription,
                    id: 'Status',
                    header: 'Status',
                    size: 200,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.Points,
                    id: 'Points',
                    header: 'Points',
                    size: 50,
                    enableColumnFilter: false,
                }
            ];
            allcolumns = [...allcolumns,
            {
                id: 'Stats',
                header: 'Stats',
                size: 200,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({ renderedCellValue, row }) => (
                    <Typography>
                        {["TMQB", "QB"].includes(row.original.PositionCode) ? `${row.original.PassYds ?? 0} Yds, ${row.original.PassTds ?? 0} TDs, ${row.original.PassInts ?? 0} Ints` : ' '}
                        {["RB"].includes(row.original.PositionCode) ? `${row.original.RushingYds ?? 0} Yds, ${row.original.RushingTds ?? 0} TDs` : ' '}
                        {["WR", "TE"].includes(row.original.PositionCode) ? `${row.original.ReceivingYds ?? 0} Yds, ${row.original.ReceivingTds ?? 0} TDs` : ' '}
                        {["TMPK", "PK"].includes(row.original.PositionCode) ? ` ${row.original.FGYds ?? 0} FGYds, ${row.original.XPs ?? 0} XPs` : ' '}
                        {["S", "CB", "LB", "DE", "DT"].includes(row.original.PositionCode) ? ` ${row.original.Tackles ?? 0} Tckls, ${row.original.Sacks ?? 0} Sacks` : ' '}
                    </Typography>
                )
            }];
            return allcolumns;
        },
        [nflTeams, positions],
    );

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
                                <Button variant="contained" color="success" onClick={() => handleClickOpen(row.original)}>
                                    Add
                                </Button> : null
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
                    }} />}
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