import { useEffect, useState } from "react";
import { leaguePlayersLoader } from "../api/graphql";
import { useMediaQuery, useTheme } from "@mui/material";

function usePlayerTableLoader(id, initialSpot, initialAvailability, leagueId) {
  const theme = useTheme();
  const isAboveMedium = useMediaQuery(theme.breakpoints.up("md"));

  const [availability, setAvailability] = useState(initialAvailability);
  const spot = initialSpot;

  const [nameFilter, setNameFilter] = useState(" ");
  const [positionFilter, setPositionFilter] = useState("All");
  const [nflTeamFilter, setNflTeamFilter] = useState("All");
  const [summaryType, setSummaryType] = useState(1);
  const [positions, setPositions] = useState();

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: isAboveMedium ? 20 : 5,
  });

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setSummaryType(id);
  }, [id]);

  useEffect(() => {
    setNameFilter(" ");
    setNflTeamFilter("All");
    setPositionFilter(positions ? positions.join(",") : "All");
    setSummaryType(1);
    setAvailability(initialAvailability);
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
        setSummaryType(
          columnFilter.value === "Last 2 Weeks"
            ? 2
            : columnFilter.value === "Last 4 Weeks"
            ? 3
            : columnFilter.value === "Season"
            ? 1
            : columnFilter.value === "Weekly Projections"
            ? 5
            : 0
        );
      }
    });
  }, [positions, columnFilters, initialAvailability]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setIsRefetching(true);

      try {
        const response = await leaguePlayersLoader(
          leagueId,
          spot,
          availability,
          pagination.pageIndex + 1,
          pagination.pageSize,
          summaryType,
          positionFilter,
          nflTeamFilter,
          nameFilter,
          sorting?.length > 0 ? sorting[0].id : "Points",
          sorting?.length > 0 ? (sorting[0].desc ? "DESC" : "ASC") : "DESC"
        );
        if (response) {
          setPlayers(response);
          setRowCount(response[0]?.TotalRows);
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchPlayers();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    spot,
    availability,
    summaryType,
    leagueId,
    nameFilter,
    positionFilter,
    nflTeamFilter,
  ]);

  return {
    setNameFilter,
    setPositions,
    availability,
    spot,
    summaryType,
    positionFilter,
    setPositionFilter,
    nflTeamFilter,
    setNflTeamFilter,
    setSummaryType,
    players,
    rowCount,
    isError,
    isLoading,
    isRefetching,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
  };
}

export default usePlayerTableLoader;
