import Navigation from "../Navigation";
import { styled } from '@mui/material/styles'
import { Paper } from '@mui/material';
import { NflWeekContext, setLineupWeek, setLastScoredWeek } from "../../contexts/NflWeekContext";
import { useContext, useEffect } from "react";
import { currentNflGameWeekLoader, lastNflGameWeekPlayedLoader } from "../../api/graphql";
import { useQuery } from "@tanstack/react-query";

const Item = styled(Paper)(({ theme }) => ({

    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1),
        margin: theme.spacing(0),
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
    },
    textAlign: 'left',

}));

function Root({ children, title, subtitle }) {
    const { dispatch: nflWeekDispatch } = useContext(NflWeekContext);

    const { data: lastPlayedWeek } = useQuery({
        queryKey: ['lastPlayedWeek'],
        queryFn: async () => {
            return await lastNflGameWeekPlayedLoader();
        },
        refetchInterval: 5 * 60 * 1000, //5 minutes
    });
    useEffect(() => {
        nflWeekDispatch(setLastScoredWeek(lastPlayedWeek));
    }, [lastPlayedWeek, nflWeekDispatch]);


    const { data: currentGameWeek } = useQuery({
        queryKey: ['currentGameWeek'],
        queryFn: async () => {
            return await currentNflGameWeekLoader();
        },
        refetchInterval: 5 * 60 * 1000, //5 minutes
    });
    useEffect(() => {
        nflWeekDispatch(setLineupWeek(currentGameWeek));
    }, [currentGameWeek, nflWeekDispatch]);

    return (
        <>
            <Navigation title={title} subtitle={subtitle} />
            <Item>
                {children}
            </Item>
        </>
    )
}

export default Root;
