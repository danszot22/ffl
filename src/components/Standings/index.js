import Root from "../Root";
import SeasonRecords from "./SeasonRecords";
import SeasonPoints from "./SeasonPoints";
import Grid from "@mui/material/Unstable_Grid2";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import { seasonStandingsLoader } from "../../api/graphql";
import { useContext, useEffect, useState } from "react";
import { NflWeekContext } from "../../contexts/NflWeekContext";

function Standings({ league, team }) {
  const { state: nflWeekState } = useContext(NflWeekContext);
  const [standings, setStandings] = useState();

  useEffect(() => {
    const fetchData = async (year, leagueId) => {
      const response = await seasonStandingsLoader(year, leagueId);
      setStandings(response);
    };
    if (nflWeekState?.seasonYear && league?.LeagueId) {
      fetchData(nflWeekState?.seasonYear, league?.LeagueId);
    }
  }, [nflWeekState?.seasonYear, league?.LeagueId]);

  return (
    <Root title={"Season Standings"}>
      <PageToolbar title={"Season Standings"} />
      {standings ? (
        <Grid container spacing={6}>
          <Grid lg={6}>
            <SeasonPoints data={standings} />
          </Grid>
          <Grid lg={6}>
            <SeasonRecords data={standings} leagueId={league?.LeagueId} />
          </Grid>
        </Grid>
      ) : null}
    </Root>
  );
}

export default withAuth(Standings);
