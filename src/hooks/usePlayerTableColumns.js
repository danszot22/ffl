import { useState, useEffect, useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import PlayerImage from "../components/common/PlayerImage";
import PlayerLink from "../components/common/PlayerLink";
import {
  formatDateToMonthYear,
  playerStatusCodes,
  playerStatuses,
} from "../utils/helpers";
import { nflTeamsLoader } from "../api/graphql";
import { getPositionsToAdd } from "../api/ffl";
import { useQuery } from "@tanstack/react-query";

function usePlayerTableColumns(
  spot,
  leagueId,
  teamId,
  rosterPlayerToDrop,
  setPositionFilter
) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isAboveSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const isAboveMedium = useMediaQuery(theme.breakpoints.up("md"));
  const isBelowLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const [nflTeams, setNflTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [summaryTypes, setSummaryTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPositions(true);
      if (rosterPlayerToDrop && rosterPlayerToDrop.PlayerId) {
        const result = await getPositionsToAdd(
          leagueId,
          teamId,
          rosterPlayerToDrop.PlayerId
        );
        setPositions(result);
        setPositionFilter(result.join(","));
      }
      setIsLoadingPositions(false);
    };
    if (rosterPlayerToDrop && rosterPlayerToDrop.PlayerId) {
      fetchData();
    } else {
      setPositions(
        spot === "DF"
          ? ["All", "DE", "CB", "S", "LB"]
          : spot === "R"
          ? ["All", "WR", "TE"]
          : spot === "All"
          ? ["All", "TMQB", "RB", "WR", "TE", "TMPK", "DE", "CB", "S", "LB"]
          : [spot]
      );
    }
  }, [spot, rosterPlayerToDrop, teamId, leagueId, setPositionFilter]);

  const { data: nflTeamResponse } = useQuery({
    queryKey: ["nflTeams"],
    queryFn: async () => {
      return await nflTeamsLoader();
    },
    staleTime: 15 * 60 * 1000, //15 minutes
  });

  useEffect(() => {
    setNflTeams(nflTeamResponse);
  }, [nflTeamResponse]);

  useEffect(() => {
    setSummaryTypes([
      { id: 1, value: "Season" },
      { id: 2, value: "Last 2 Weeks" },
      { id: 3, value: "Last 4 Weeks" },
      { id: 5, value: "Weekly Projections" },
    ]);
  }, []);

  const columns = useMemo(() => {
    let allcolumns = [
      {
        accessorFn: (row) => row.PlayerName,
        id: "PlayerName", //id is still required when using accessorFn instead of accessorKey
        header: "Name",
        size: isBelowLarge ? 150 : 250,
        enableSorting: false,
        enableColumnFilter: isAboveMedium,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {`${row.original?.RowNumber}.`}
            <PlayerImage
              positionCode={row.original?.PositionCode}
              nflTeamCode={row.original?.DisplayCode}
              espnPlayerId={row.original.EspnPlayerId}
            />
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <PlayerLink
                  playerId={row.original.PlayerId}
                  playerName={row.original.PlayerName}
                  positionCode={row.original.PositionCode}
                />
                <Typography variant="caption">
                  {playerStatusCodes[row.original.StatusCode]}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                {isXs ? (
                  <Typography variant="caption">
                    {row.original.PositionCode}
                  </Typography>
                ) : null}
                {isXs ? (
                  <Typography variant="caption">
                    {row.original.DisplayCode}
                  </Typography>
                ) : null}
              </Box>
              {isXs ? (
                <Typography variant="caption">
                  {row.original.OwnerName != null
                    ? row.original.OwnerName
                    : "Available"}
                </Typography>
              ) : null}
            </Box>
          </Box>
        ),
      },
    ];
    if (isAboveSmall) {
      allcolumns = [
        ...allcolumns,
        {
          accessorFn: (row) =>
            row.Name != null ? `${row.Name}` : "Free Agent",
          id: "NflTeamName",
          header: "Team",
          size: isBelowLarge ? 50 : 200,
          enableSorting: false,
          filterVariant: "select",
          filterSelectOptions: nflTeams ? ["All", ...nflTeams] : [],
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {row.original.DisplayCode ? (
                <img
                  alt={row.original.DisplayCode}
                  height={30}
                  src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${row.original.DisplayCode}.png&h=150&w=150`}
                  loading="lazy"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <img
                  alt="Free Agent"
                  height={30}
                  src="https://secure.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png&h=150&w=150"
                  loading="lazy"
                  style={{ borderRadius: "50%" }}
                />
              )}
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ];
    }
    if (isAboveSmall) {
      allcolumns = [
        ...allcolumns,
        {
          accessorFn: (row) =>
            row.PositionCode != null ? `${row.PositionCode}` : " ",
          id: "PositionCode",
          header: "Position",
          size: 50,
          enableSorting: false,
          enableColumnFilter: spot === "DF" || spot === "R" || spot === "All",
          filterVariant: "select",
          filterSelectOptions: positions,
        },
      ];
    }
    if (isAboveSmall) {
      allcolumns = [
        ...allcolumns,
        {
          accessorFn: (row) =>
            row.OwnerName != null ? `${row.OwnerName}` : "Available",
          id: "Availability",
          header: "Type",
          size: 150,
          enableSorting: false,
          enableColumnFilter: !rosterPlayerToDrop,
          filterVariant: "select",
          filterSelectOptions: ["All", "Available"],
        },
      ];
    }
    if (isAboveMedium) {
      allcolumns = [
        ...allcolumns,
        {
          accessorFn: (row) =>
            row.StatusDescription
              ? row.StatusDescription
              : row.StatusCode
              ? `${formatDateToMonthYear(row.InjuryDate)} ${
                  playerStatuses[row.StatusCode]
                }`
              : null,
          id: "Status",
          header: "Status",
          size: 200,
          enableColumnFilter: false,
        },
      ];
    }
    allcolumns = [
      ...allcolumns,
      {
        accessorFn: (row) => row.Points,
        id: "Points",
        header: "Points",
        size: 50,
        enableColumnFilter: isAboveSmall,
        filterVariant: "select",
        filterSelectOptions: summaryTypes?.map((type) => type.value),
        Cell: ({ renderedCellValue, row }) => row.original.Points,
      },
    ];
    if (spot === "TMQB") {
      allcolumns = [
        ...allcolumns,
        {
          accessorFn: (row) => row.PassYds,
          id: "PassYds",
          header: "PassYds",
          size: isAboveMedium ? 150 : 50,
          enableColumnFilter: false,
        },
        {
          accessorFn: (row) => row.PassTds,
          id: "PassTds",
          header: "PassTds",
          size: isAboveMedium ? 150 : 50,
          enableColumnFilter: false,
        },
        {
          accessorFn: (row) => row.PassInts,
          id: "PassInts",
          header: "PassInts",
          size: isAboveMedium ? 150 : 50,
          enableColumnFilter: false,
        },
      ];
    }
    if (spot === "TMPK") {
      allcolumns = [
        ...allcolumns,
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
      ];
    }
    if (spot === "RB" || (spot === "TMQB" && isAboveMedium)) {
      allcolumns = [
        ...allcolumns,
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
      ];
    }
    if (spot === "R" || (spot === "RB" && isAboveMedium)) {
      allcolumns = [
        ...allcolumns,
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
      ];
    }
    if (spot === "DF") {
      allcolumns = [
        ...allcolumns,
        {
          accessorFn: (row) => row.Tackles,
          id: "Tackles",
          header: isAboveMedium ? "Tackles" : "Tckl",
          size: isAboveMedium ? 150 : 50,
          enableColumnFilter: false,
        },
        {
          accessorFn: (row) => row.Sacks,
          id: "Sacks",
          header: "Sacks",
          size: isAboveMedium ? 150 : 50,
          enableColumnFilter: false,
        },
      ];
      if (isAboveMedium) {
        allcolumns = [
          ...allcolumns,
          {
            accessorFn: (row) => row.Solo,
            id: "Solo",
            header: "Solo",
            size: isAboveMedium ? 150 : 50,
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
        ];
      }
    }
    if (spot === "All") {
      allcolumns = [
        ...allcolumns,
        {
          id: "Stats",
          header: "Stats",
          size: 200,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ renderedCellValue, row }) => (
            <Typography variant="inherit">
              {["TMQB", "QB"].includes(row.original.PositionCode)
                ? `${row.original.PassYds ?? 0} Yds, ${
                    row.original.PassTds ?? 0
                  } TDs, ${row.original.PassInts ?? 0} Ints`
                : " "}
              {["RB"].includes(row.original.PositionCode)
                ? `${row.original.RushingYds ?? 0} Yds, ${
                    row.original.RushingTds ?? 0
                  } TDs`
                : " "}
              {["WR", "TE"].includes(row.original.PositionCode)
                ? `${row.original.ReceivingYds ?? 0} Yds, ${
                    row.original.ReceivingTds ?? 0
                  } TDs`
                : " "}
              {["TMPK", "PK"].includes(row.original.PositionCode)
                ? ` ${row.original.FGYds ?? 0} FGYds, ${
                    row.original.XPs ?? 0
                  } XPs`
                : " "}
              {["S", "CB", "LB", "DE", "DT"].includes(row.original.PositionCode)
                ? ` ${row.original.Tackles ?? 0} Tckls, ${
                    row.original.Sacks ?? 0
                  } Sacks`
                : " "}
            </Typography>
          ),
        },
      ];
    }
    return allcolumns;
  }, [
    spot,
    rosterPlayerToDrop,
    nflTeams,
    positions,
    summaryTypes,
    isXs,
    isAboveSmall,
    isAboveMedium,
    isBelowLarge,
  ]);

  return {
    columns,
    nflTeams,
    positions,
    summaryTypes,
    isLoadingPositions,
  };
}

export default usePlayerTableColumns;
