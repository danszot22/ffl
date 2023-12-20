import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useSearchParams, useParams } from "react-router-dom";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import Root from "../Root";
import usePlayerTableColumns from "../../hooks/usePlayerTableColumns";
import usePlayerTableLoader from "../../hooks/usePlayerTableLoader";
import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { numberOfDaysSinceDate } from "../../utils/helpers";

function PlayerList({ league, team }) {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const {
    setSummaryType,
    nflTeamFilter,
    setNflTeamFilter,
    positionFilter,
    setPositionFilter,
    availability,
    spot,
    summaryType,
    isError,
    isLoading,
    isRefetching,
    players,
    rowCount,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = usePlayerTableLoader(
    id,
    searchParams.has("spot") ? searchParams.get("spot") : "All",
    searchParams.has("availability") ? searchParams.get("availability") : "All",
    league?.LeagueId
  );
  const { columns, positions, nflTeams, summaryTypes } =
    usePlayerTableColumns(spot);

  const theme = useTheme();
  const isAboveMedium = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Root title={"Players"}>
      <PageToolbar title={"Players"} />
      <Box
        sx={{
          justifyContent: "center",
          flexGrow: 1,
          display: { xs: "flex", sm: "none" },
          flexDirection: "row",
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
            value={nflTeams?.length > 0 ? nflTeamFilter : ""}
            onChange={(event) => setNflTeamFilter(event.target.value)}
          >
            {nflTeams
              ? ["All", ...nflTeams]?.map((nflteam, index) => (
                  <MenuItem
                    key={nflteam}
                    value={nflteam}
                  >{`${nflteam}`}</MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="position-select-label">Position</InputLabel>
          <Select
            labelId="position-select-label"
            id="position"
            label="Position"
            value={positions.length > 0 ? positionFilter : ""}
            onChange={(event) => setPositionFilter(event.target.value)}
          >
            {positions?.map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="position-select-label">Stat Type</InputLabel>
          <Select
            labelId="position-select-label"
            id="position"
            label="Position"
            value={summaryTypes?.length > 0 ? summaryType : ""}
            onChange={(event) => setSummaryType(event.target.value)}
          >
            {summaryTypes?.map((summaryType) => (
              <MenuItem key={summaryType.id} value={summaryType.id}>
                {summaryType.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <MaterialReactTable
        columns={columns}
        data={players}
        getRowId={(row) => row.PlayerId}
        muiTableHeadCellProps={{
          sx: { pr: 1, pl: 1, pb: 1, pt: 0 },
        }}
        muiTableBodyCellProps={{
          sx: { pr: 1, pl: 1, pb: 1, pt: 0 },
        }}
        manualFiltering
        manualPagination
        manualSorting
        enableRowActions
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "",
            size: 50,
          },
        }}
        initialState={{ showColumnFilters: true }}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        positionActionsColumn={isAboveMedium ? "first" : "last"}
        renderRowActions={({ row, table }) => (
          <Box>
            {!row.original.OwnerName ? (
              <Tooltip title="Add">
                <IconButton
                  color="success"
                  to={`/RosterPlayer/Add/${row.original.PlayerId}`}
                >
                  <PersonAdd />
                </IconButton>
              </Tooltip>
            ) : null}
            {row.original.TeamId &&
            row.original.TeamId === team?.TeamId &&
            (team?.AvlAddDrops > 0 ||
              (row.original.StatusCode === 1 &&
                numberOfDaysSinceDate(row.original.InjuryDate) < 15)) ? (
              <Tooltip title="Drop">
                <IconButton
                  color="error"
                  to={`/RosterPlayer/Drop/${row.original.TeamId}/${row.original.RosterPlayerId}`}
                >
                  <PersonRemove />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>
        )}
        renderTopToolbar={({ table }) => (
          <Typography sx={{ p: 1, m: 1 }}>
            {summaryType === "5" ? "Weekly Projections" : "Player Listing"} -{" "}
            {availability}{" "}
            {spot === "DF"
              ? "Defensive Players"
              : spot === "RB"
              ? "Running Backs"
              : spot === "R"
              ? "Receivers"
              : spot === "TMPK"
              ? "Team Kickers"
              : spot === "TMQB"
              ? "Team Quarterbacks"
              : "Players"}
          </Typography>
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
        }}
      />
    </Root>
  );
}

export default withAuth(PlayerList);
