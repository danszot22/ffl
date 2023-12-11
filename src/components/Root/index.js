import Navigation from "../Navigation";
import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
import {
  NflWeekContext,
  setLineupWeek,
  setLastScoredWeek,
  setSeasonYear,
} from "../../contexts/NflWeekContext";
import { useContext, useEffect, useLayoutEffect } from "react";
import {
  currentNflGameWeekLoader,
  lastNflGameWeekPlayedLoader,
  seasonYearLoader,
} from "../../api/graphql";
import { useQuery } from "@tanstack/react-query";
import { convertDateToLocal } from "../../utils/helpers";
import { useLocation } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(1),
    margin: theme.spacing(0),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
  textAlign: "left",
}));

function Root({ children, title, subtitle, sx }) {
  const { dispatch: nflWeekDispatch } = useContext(NflWeekContext);

  let location = useLocation();
  useLayoutEffect(() => {
    // if there is an update available and no state passed to route
    if (
      !location.state &&
      window.localStorage.getItem("version-update-needed")
    ) {
      window.localStorage.removeItem("version-update-needed"); // remove the storage object
      window.location.reload(); // refresh the browser
    }
  }, [location]);

  const { data: seasonYear } = useQuery({
    queryKey: ["seasonYear"],
    queryFn: async () => {
      const gameDate = await seasonYearLoader();
      return convertDateToLocal(gameDate)?.getFullYear();
    },
    staleTime: 15 * 60 * 1000, //15 minutes
    //refetchInterval: 5 * 60 * 1000, //5 minutes
  });

  useEffect(() => {
    nflWeekDispatch(setSeasonYear(seasonYear));
  }, [seasonYear, nflWeekDispatch]);

  const { data: lastPlayedWeek } = useQuery({
    queryKey: ["lastPlayedWeek"],
    queryFn: async () => {
      return await lastNflGameWeekPlayedLoader();
    },
    staleTime: 5 * 60 * 1000, //5 minutes
    refetchInterval: 5 * 60 * 1000, //5 minutes
  });
  useEffect(() => {
    nflWeekDispatch(setLastScoredWeek(lastPlayedWeek));
  }, [lastPlayedWeek, nflWeekDispatch]);

  const { data: currentGameWeek } = useQuery({
    queryKey: ["currentGameWeek"],
    queryFn: async () => {
      return await currentNflGameWeekLoader();
    },
    staleTime: 5 * 60 * 1000, //5 minutes
    refetchInterval: 5 * 60 * 1000, //5 minutes
  });
  useEffect(() => {
    nflWeekDispatch(setLineupWeek(currentGameWeek));
  }, [currentGameWeek, nflWeekDispatch]);

  return (
    <>
      <Navigation title={title} subtitle={subtitle} />
      {sx ? <Paper sx={sx}>{children}</Paper> : <Item>{children}</Item>}
    </>
  );
}

export default Root;
