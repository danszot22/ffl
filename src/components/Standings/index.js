import Root from "../Root";
import SeasonRecords from "./SeasonRecords";
import SeasonPoints from "./SeasonPoints";
import Grid from '@mui/material/Unstable_Grid2';
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import { seasonStandingsLoader } from "../../api/graphql";
import { useEffect, useState } from "react";

function Standings({ league, team }) {
    const [standings, setStandings] = useState();

    useEffect(() => {
        const fetchData = async (year, leagueId) => {
            const response = await seasonStandingsLoader(year, leagueId);
            console.log(response);
            setStandings(response);
        }
        fetchData(2023, league?.LeagueId);
    }, [
        league?.LeagueId,
    ]);

    return (
        <Root>
            <PageToolbar title={'Season Standings'} />
            {standings ?
                <Grid container spacing={6}>
                    <Grid md={6}>
                        <SeasonPoints data={standings} />
                    </Grid>
                    <Grid md={6}>
                        <SeasonRecords data={standings} />
                    </Grid>
                </Grid>
                : null}
        </Root>
    )
}

export default withAuth(Standings);