import Navigation from "../Navigation";
import { styled } from '@mui/material/styles'
import { Paper } from '@mui/material';
import { NflWeekContext, setLineupWeek, setLastScoredWeek } from "../../contexts/NflWeekContext";
import { useContext, useEffect } from "react";
import { currentNflGameWeekLoader, lastNflGameWeekPlayedLoader } from "../../api/graphql";

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

    useEffect(() => {
        const fetchData = async () => {
            const week = await currentNflGameWeekLoader();
            nflWeekDispatch(setLineupWeek(week));
            const lastGameWeek = await lastNflGameWeekPlayedLoader()
            nflWeekDispatch(setLastScoredWeek(lastGameWeek));
        }
        fetchData();
    }, [nflWeekDispatch]);

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
