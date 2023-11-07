import { useState, useEffect, useMemo } from "react";
import { formatPlayerFullName, playerStatusCodes } from "../../utils/helpers";
import Root from "../Root";
import { MaterialReactTable } from 'material-react-table';
import { leaguePlayersLoader, nflTeamsLoader } from "../../api/graphql";
import { Box, Link, Typography, Button } from "@mui/material";
import { useSearchParams, useParams } from 'react-router-dom';
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";

function PlayerList({ league, team }) {
    const [nflTeams, setNflTeams] = useState([]);
    const [searchParams] = useSearchParams();
    const [availability, setAvailability] = useState(searchParams.has("availability") ? searchParams.get("availability") : "All");
    const [nameFilter, setNameFilter] = useState(' ');
    const [positionFilter, setPositionFilter] = useState('All');
    const [nflTeamFilter, setNflTeamFilter] = useState('All');
    const [summaryType, setSummaryType] = useState(1);
    const spot = searchParams.has("spot") ? searchParams.get("spot") : "All";
    const { id } = useParams();

    const [players, setPlayers] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    const [columnFilters, setColumnFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    useEffect(() => {
        setSummaryType(id);
    }, [
        id,
    ]);

    useEffect(() => {
        setNameFilter(' ');
        setNflTeamFilter('All');
        setPositionFilter('All');
        setSummaryType(1);
        setAvailability(searchParams.has("availability") ? searchParams.get("availability") : "All");
        columnFilters.forEach((columnFilter) => {
            if (columnFilter.id === "Availability") {
                setAvailability(columnFilter.value);
            }
            if (columnFilter.id === "PlayerName") {
                setNameFilter(columnFilter.value);
            }
            if (columnFilter.id === "NflTeamName") {
                setNflTeamFilter(columnFilter.value);
            }
            if (columnFilter.id === "PositionCode") {
                setPositionFilter(columnFilter.value);
            }
            if (columnFilter.id === "Points") {
                setSummaryType(columnFilter.value === "Last 2 Weeks" ? 2 : columnFilter.value === 'Last 4 Weeks' ? 3 :
                    columnFilter.value === 'Season' ? 1 : columnFilter.value === 'Weekly Projections' ? 5 : 0);
            }
        })
    }, [
        columnFilters,
        searchParams
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
                const response = await leaguePlayersLoader(league?.LeagueId, spot, availability, pagination.pageIndex + 1, pagination.pageSize, summaryType, positionFilter, nflTeamFilter, nameFilter,
                    sorting?.length > 0 ? sorting[0].id : "Points", sorting?.length > 0 ? (sorting[0].desc ? "DESC" : "ASC") : "DESC");
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
        spot, availability, summaryType,
        league?.LeagueId,
        nameFilter, positionFilter, nflTeamFilter
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
                    enableColumnFilter: spot === "DF" || spot === "R" || spot === "All",
                    filterVariant: 'select',
                    filterSelectOptions: spot === "DF" ? ['All', 'DE', 'CB', 'S', 'LB'] : spot === "R" ? ['All', 'WR', 'TE'] : spot === "All" ? ['All', 'TMQB', 'RB', 'WR', 'TE', 'TMPK', 'DE', 'CB', 'S', 'LB'] : [spot],
                },
                {
                    accessorFn: (row) => row.OwnerName != null ? `${row.OwnerName}` : 'Available',
                    id: 'Availability',
                    header: 'Type',
                    size: 150,
                    enableSorting: false,
                    //enableColumnFilter: false,
                    filterVariant: 'select',
                    filterSelectOptions: ['All', 'Available'],
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
                    //enableColumnFilter: false,
                    filterVariant: 'select',
                    filterSelectOptions: ['Last 2 Weeks', 'Last 4 Weeks', 'Season', 'Weekly Projections'],
                }
            ];
            if (spot === "TMQB") {
                allcolumns = [...allcolumns,
                {
                    accessorFn: (row) => row.PassYds,
                    id: "PassYds",
                    header: "PassYds",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.PassTds,
                    id: "PassTds",
                    header: "PassTds",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.PassInts,
                    id: "PassInts",
                    header: "PassInts",
                    size: 150,
                    enableColumnFilter: false,
                },
                ]
            }
            if (spot === "TMPK") {
                allcolumns = [...allcolumns,
                {
                    accessorFn: (row) => row.FGYds,
                    id: "FGYds",
                    header: "FGYds",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.XPs,
                    id: "XPs",
                    header: "XPs",
                    size: 150,
                    enableColumnFilter: false,
                },
                ]
            }
            if (spot === "RB" || spot === "TMQB") {
                allcolumns = [...allcolumns,
                {
                    accessorFn: (row) => row.RushingYds,
                    id: "RushingYds",
                    header: "RushingYds",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.RushingTds,
                    id: "RushingTds",
                    header: "RushingTds",
                    size: 150,
                    enableColumnFilter: false,
                },
                ]
            }
            if (spot === "RB" || spot === "R") {
                allcolumns = [...allcolumns,
                {
                    accessorFn: (row) => row.ReceivingYds,
                    id: "ReceivingYds",
                    header: "ReceivingYds",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.ReceivingTds,
                    id: "ReceivingTds",
                    header: "ReceivingTds",
                    size: 150,
                    enableColumnFilter: false,
                },
                ]
            }
            if (spot === "DF") {
                allcolumns = [...allcolumns,
                {
                    accessorFn: (row) => row.Tackles,
                    id: "Tackles",
                    header: "Tackles",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.Solo,
                    id: "Solo",
                    header: "Solo",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.Sacks,
                    id: "Sacks",
                    header: "Sacks",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.DefInts,
                    id: "DefInts",
                    header: "DefInts",
                    size: 150,
                    enableColumnFilter: false,
                },
                {
                    accessorFn: (row) => row.DefTds,
                    id: "DefTds",
                    header: "DefTds",
                    size: 150,
                    enableColumnFilter: false,
                },
                ]
            }
            if (spot === "All") {
                allcolumns = [...allcolumns,
                {
                    id: 'Stats',
                    header: 'Stats',
                    size: 200,
                    enableSorting: false,
                    enableColumnFilter: false,
                    Cell: ({ renderedCellValue, row }) => (
                        <Typography variant="inherit">
                            {["TMQB", "QB"].includes(row.original.PositionCode) ? `${row.original.PassYds ?? 0} Yds, ${row.original.PassTds ?? 0} TDs, ${row.original.PassInts ?? 0} Ints` : ' '}
                            {["RB"].includes(row.original.PositionCode) ? `${row.original.RushingYds ?? 0} Yds, ${row.original.RushingTds ?? 0} TDs` : ' '}
                            {["WR", "TE"].includes(row.original.PositionCode) ? `${row.original.ReceivingYds ?? 0} Yds, ${row.original.ReceivingTds ?? 0} TDs` : ' '}
                            {["TMPK", "PK"].includes(row.original.PositionCode) ? ` ${row.original.FGYds ?? 0} FGYds, ${row.original.XPs ?? 0} XPs` : ' '}
                            {["S", "CB", "LB", "DE", "DT"].includes(row.original.PositionCode) ? ` ${row.original.Tackles ?? 0} Tckls, ${row.original.Sacks ?? 0} Sacks` : ' '}
                        </Typography>
                    )
                }
                ]
            }
            return allcolumns;
        },
        [spot, nflTeams],
    );

    return (
        <Root>
            <PageToolbar title={'Players'} />
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
                            <Button variant="contained" color="success"
                                to={`/RosterPlayer/Add/${row.original.PlayerId}`}>Add</Button> : null
                        }
                        {row.original.TeamId && row.original.TeamId === team?.TeamId ?
                            <Button variant="contained" color="error"
                                to={`/RosterPlayer/Drop/${row.original.TeamId}/${row.original.RosterPlayerId}`}>Drop</Button> : null
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