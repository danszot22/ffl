import React, { useMemo, useEffect, useState, useContext } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import Root from '../Root';
import { nflTeamsLoader, playersLoader, teamsLoader } from '../../api/graphql';
import useTableLoader from '../../hooks/useTableLoader';
import { Delete, Add } from '@mui/icons-material';
import { FantasyTeamContext } from "../../contexts/FantasyTeamContext";
import { mapToPlayerList } from '../../utils/parsers';

function PlayerListOld() {
    const [nflTeams, setNflTeams] = useState([]);
    const [fantasyTeams, setFantasyTeams] = useState([]);
    const { state } = useContext(FantasyTeamContext);

    const {
        displayedData,
        loadTableWithData,
        rowCount,
        isError,
        isLoading,
        isRefetching,
        columnFilters,
        globalFilter,
        setColumnFilters,
        setGlobalFilter,
        pagination,
        setPagination,
        sorting,
        setSorting,
    } = useTableLoader(playersLoader, (data) => mapToPlayerList(data, state.league?.LeagueId));

    useEffect(() => {
        const fetchTeams = async () => {
            const response = await nflTeamsLoader();
            setNflTeams(response);
        }
        const fetchFantasyTeams = async () => {
            const response = await teamsLoader(state.league?.LeagueId);
            setFantasyTeams(response);
        }
        fetchTeams();
        fetchFantasyTeams()
        loadTableWithData();
    }, [
        columnFilters,
        globalFilter,
        sorting,
        pagination.pageIndex,
        pagination.pageSize,
        loadTableWithData,
        state
    ]);

    const columns = useMemo(
        () => [
            {
                accessorFn: (row) => row.EspnPlayerId != null ? `${row.EspnPlayer.FirstName} ${row.EspnPlayer.LastName}` : row.Name, //accessorFn used to join multiple data into a single cell
                id: 'Name', //id is still required when using accessorFn instead of accessorKey
                header: 'Name',
                size: 250,
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        {row.original.EspnPlayerId ?
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
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
            },
            {
                accessorFn: (row) => row.NflTeam != null ? `${row.NflTeam.Name}` : 'Free Agent',
                id: 'NflTeam.Name',
                header: 'Team',
                size: 200,
                enableSorting: false,
                filterVariant: 'select',
                filterSelectOptions: nflTeams,
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        {
                            row.original.NflTeam ?
                                <img
                                    alt={row.original.NflTeam.DisplayCode}
                                    height={30}
                                    src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${row.original.NflTeam.DisplayCode}.png&h=150&w=150`}
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
                accessorFn: (row) => row.Position != null ? `${row.Position.PositionCode}` : ' ',
                id: 'Position.PositionCode',
                header: 'Position',
                size: 150,
                enableSorting: false,
                filterVariant: 'select',
                filterSelectOptions: ['TMQB', 'RB', 'WR', 'TE', 'TMPK', 'DE', 'CB', 'S', 'LB'],
            },
            {
                accessorFn: (row) => row.RosterPlayer?.Team != null ? `${row.RosterPlayer.Team.OwnerName}` : 'Available',
                id: 'RosterPlayer.Team.OwnerName',
                header: 'Type',
                size: 150,
                enableSorting: false,
                filterVariant: 'select',
                filterSelectOptions: fantasyTeams?.map((team) => team.OwnerName),
            }
        ],
        [nflTeams, fantasyTeams],
    );

    return (
        <Root>
            <MaterialReactTable columns={columns} data={displayedData} getRowId={(row) => row.PlayerId}
                manualFiltering
                manualPagination
                manualSorting
                enableRowActions
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
                        <Tooltip arrow placement="left" title="Add">
                            <IconButton >
                                <Add />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Drop">
                            <IconButton color="error" >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Typography>Players</Typography>
                )}
                isLoading={isLoading}
                isRefetching={isRefetching}
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={setGlobalFilter}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                rowCount={rowCount}
                muiTablePaginationProps={{
                    rowsPerPageOptions: [5, 10],
                    labelDisplayedRows: ({ from, to, count }) => { return (`${from} to ${to}`) },
                    showFirstButton: false,
                    showLastButton: false,
                }}
                state={{
                    columnFilters,
                    globalFilter,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    showSkeletons: isLoading || isRefetching,
                    sorting,
                }} />
        </Root>
    );
}
export default PlayerList;