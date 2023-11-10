import Root from "../Root";
import { Box } from "@mui/material";
import { leaguePlayersLoader } from "../../api/graphql";
import { useState, useEffect } from "react";
import { mapToRosterList } from "../../utils/parsers";
import Roster from "./Roster";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";

function Rosters({ league, team }) {
    const [rosters, setRosters] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await leaguePlayersLoader(league?.LeagueId, "All", "OnRosters", 1, 1000, 1, "All", "All", " ", "PositionId", "ASC");
                setRosters(mapToRosterList(response, team?.TeamId));
            } catch (error) {
                console.error(error);
                return;
            }
        }
        fetchPlayers();
    }, [
        team?.TeamId,
        league?.LeagueId,
    ]);

    return (
        <Root>
            <PageToolbar title={'League Rosters'} />
            <div style={{ width: '100%' }}>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    p: 1,
                    m: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                }}
                >
                    {
                        rosters.map((roster) => {
                            return (
                                <Roster key={roster.team.TeamId} roster={roster} />
                            )
                        })
                    }
                </Box>
            </div>
        </Root>

    )
}
export default withAuth(Rosters);