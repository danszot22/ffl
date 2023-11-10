import { teamFinancesLoader, teamPrizeLoader, transactionFeeLoader } from '../../api/graphql';
import { useCallback, useMemo, useState, useEffect } from 'react';
import Root from "../Root";
import { formatDollars } from "../../utils/helpers";
import { mapTeamFinances } from "../../utils/parsers";
import { StyledDataGrid } from "../common/styled";
import FinanceToolbar from './FinanceToolbar';
import PageToolbar from '../common/PageToolbar';
import withAuth from '../withAuth';
import TeamLink from '../common/TeamLink';
import { useMediaQuery, useTheme } from '@mui/material';

function Finances({ league, user }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchFinances = async () => {
            try {
                const responseFees = await transactionFeeLoader(league?.LeagueId);
                const responsePrizes = await teamPrizeLoader(league?.LeagueId);
                const responseFinances = await teamFinancesLoader(league?.LeagueId);
                setTeams(mapTeamFinances(responseFinances, responsePrizes, responseFees));
            } catch (error) {
                console.error(error);
                return;
            }
        }

        fetchFinances();
    }, [league?.LeagueId]);

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

    const columns = [
        {
            field: 'TeamName',
            headerName: 'Team',
            sortable: false,
            width: isBelowMedium ? 100 : 300,
            editable: false,
            renderCell: (params) => (
                <TeamLink team={params.row} />
            ),
        },
        {
            field: 'EntryFee', width: isBelowMedium ? 75 : 150, headerName: 'Entry Fee', sortable: false, editable: true,
            valueFormatter: ({ value }) => formatDollars(value),
        },
        {
            field: 'TransactionFees', width: isBelowMedium ? 75 : 150, headerName: 'Transaction Fees', sortable: false, editable: false,
            valueFormatter: ({ value }) => formatDollars(value),
        },
        {
            field: 'FeesPaid', width: isBelowMedium ? 75 : 150, headerName: 'Fees Paid', type: 'number', sortable: false, editable: true,
            valueFormatter: ({ value }) => formatDollars(value),
        },
        {
            field: 'Winnings', width: isBelowMedium ? 75 : 150, headerName: 'Winnings', type: 'number', sortable: false, editable: false,
            valueFormatter: ({ value }) => formatDollars(value),
        },
        {
            field: 'WinningsPaid', width: isBelowMedium ? 75 : 150, headerName: 'Winnings Paid', type: 'amount', sortable: false, editable: true,
            valueFormatter: ({ value }) => formatDollars(value),
        },
        {
            field: 'Balance', width: isBelowMedium ? 75 : 150, headerName: 'Balance', type: 'number', sortable: false, editable: false,
            valueFormatter: ({ value }) => formatDollars(value),
            valueGetter: (params) => {
                return `${(params.row.EntryFee + params.row.TransactionFees - params.row.FeesPaid) - (params.row.Winnings - params.row.WinningsPaid)}`
            },
        },
    ];

    return (
        <Root>
            <PageToolbar title={'Finances'} />
            <StyledDataGrid
                getRowId={(row) => row.TeamId}
                rows={teams}
                columns={columns}
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
                    toolbar: FinanceToolbar,
                } : null}
                slotProps={{
                    toolbar: {
                        gridMode,
                        rowModesModel,
                        setRowModesModel,
                        teams
                    },
                }}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
            />
        </Root>
    )
}

export default withAuth(Finances);