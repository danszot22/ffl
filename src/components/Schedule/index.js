import { useEffect, useState } from "react"
import { leagueScheduleLoader } from "../../api/graphql";
import { mapToGameList } from "../../utils/parsers";
import Root from "../Root";
import { Box } from "@mui/material";
import WeekGames from "./WeekGames";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";

function Schedule({ league }) {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await leagueScheduleLoader(league?.LeagueId);
                setSchedule(mapToGameList(response));
            } catch (error) {
                console.error(error);
                return;
            }
        };
        fetchSchedule();
    },
        [league?.LeagueId]
    );

    return (
        <Root>
            <PageToolbar title={'Schedule'} />
            {
                Object.values(schedule).map((gameWeek) => {
                    return (
                        <div key={gameWeek.Week} style={{ width: '100%' }}>
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
                                <WeekGames key={gameWeek.Week} week={gameWeek.Week} games={gameWeek.Games} />
                            </Box>
                        </div>
                    )
                })
            }
        </Root>
    )
}

export default withAuth(Schedule);