import { useState, useEffect, useContext } from "react";
import Root from "../Root";
import {
  mapCategoryScoring,
  mapTeamScoringTotals,
  mapFantasyGames,
} from "../../utils/parsers";
import Points from "./Points";
import {
  scoringLoader,
  fantasyGameLoader,
  lineupsLoader,
  nflGamesLoader,
} from "../../api/graphql";
import { Skeleton } from "@mui/material";
import { NflWeekContext } from "../../contexts/NflWeekContext";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import { useQuery } from "@tanstack/react-query";
import WeeklyGames from "./WeeklyGames";
import Header from "./Header";

function Scoring({ league, team }) {
  const { state: nflWeekState } = useContext(NflWeekContext);

  const [summaryData, setSummaryData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [fantasyGames, setFantasyGames] = useState([]);
  const [teamFantasyGame, setTeamFantasyGame] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatedOn, setUpdatedOn] = useState("");
  const [week, setWeek] = useState();
  const [weeks, setWeeks] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: fantasyGameResponse } = useQuery({
    queryKey: ["fantasyGames", league?.LeagueId, week],
    queryFn: async () => {
      if (!week) return [];
      return await fantasyGameLoader(league?.LeagueId, week);
    },
    refetchInterval: 30 * 1000, //30 seconds
  });

  useEffect(() => {
    setFantasyGames(mapFantasyGames(fantasyGameResponse));
  }, [fantasyGameResponse]);

  const { data: nflGameResponse } = useQuery({
    queryKey: ["nflGames", week],
    queryFn: async () => {
      if (!week) return [];
      return await nflGamesLoader(week);
    },
    refetchInterval: 30 * 1000, //30 seconds
  });

  const { data: lineupResponse } = useQuery({
    queryKey: ["lineups", league?.LeagueId, week],
    queryFn: async () => {
      if (!week) return [];
      return await lineupsLoader(league?.LeagueId, week);
    },
    refetchInterval: 30 * 1000, //30 seconds
  });

  const { data: scoringResponse } = useQuery({
    queryKey: ["scoring", league?.LeagueId, week],
    queryFn: async () => {
      if (!week) return [];
      return await scoringLoader(league?.LeagueId, week);
    },
    refetchInterval: 30 * 1000, //30 seconds
  });

  useEffect(() => {
    setCategoryData(mapCategoryScoring(scoringResponse));
  }, [scoringResponse]);

  useEffect(() => {
    setSummaryData(
      mapTeamScoringTotals(scoringResponse, lineupResponse, nflGameResponse)
    );
    setIsLoading(false);
  }, [scoringResponse, lineupResponse, nflGameResponse]);

  useEffect(() => {
    if (summaryData?.totals?.length > 0)
      setUpdatedOn(
        `${summaryData?.createdDate?.toLocaleDateString()} ${summaryData?.createdDate?.toLocaleTimeString()}`
      );
  }, [summaryData]);

  useEffect(() => {
    setWeeks([...Array(nflWeekState.lineupWeek).keys()]?.sort((a, b) => b - a));
    if (nflWeekState?.lastScoredWeek) setWeek(nflWeekState.lastScoredWeek);
  }, [nflWeekState]);

  const handleClick = (selectedWeek) => {
    setIsLoading(true);
    setWeek(selectedWeek);
  };
  useEffect(() => {
    setTeamFantasyGame(
      fantasyGames.find(
        (game) =>
          game.HomeTeamId === team?.TeamId || game.AwayTeamId === team?.TeamId
      )
    );
  }, [league, team, fantasyGames]);

  return (
    <Root
      sx={{ p: 0 }}
      title={`Scoring - Week ${week}`}
      subtitle={`Updated: ${updatedOn}`}
    >
      <PageToolbar title={"Scoring"} />
      <Header
        week={week}
        weeks={weeks}
        showProjections={!summaryData.complete}
        updatedOn={updatedOn}
        teamFantasyGame={teamFantasyGame}
        isLoading={isLoading}
        handleClick={handleClick}
        handleOpen={handleOpen}
      />
      {isLoading ? (
        <Skeleton variant="rectangular" height={48} />
      ) : (
        <Points
          userTeamId={team?.TeamId}
          data={categoryData}
          summaryData={summaryData.totals}
          week={week}
          showProjections={!summaryData.complete}
        />
      )}
      <WeeklyGames
        fantasyGames={fantasyGames}
        summaryData={summaryData}
        open={open}
        handleClose={handleClose}
      />
    </Root>
  );
}

export default withAuth(Scoring);
