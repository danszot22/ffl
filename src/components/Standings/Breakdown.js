import Root from "../Root";
import { Skeleton, AppBar, Tabs, Tab, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState, useEffect } from "react";
import { seasonScoringLoader } from "../../api/graphql";
import { mapSeasonCategoryScoring } from "../../utils/parsers";
import { a11yProps, CustomTabPanel } from "../common/CustomTabPanel";
import { useTheme, useMediaQuery } from "@mui/material";
import ExpandableCategoryRow from "../Scoring/ExpandableCategoryRow";
import PanelToolbar from "../Scoring/PanelToolbar";
import TableToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";

function Breakdown({ league, team }) {
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.down('lg'))

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const fetchScoring = async (leagueId) => {
            setIsLoading(true);
            const response = await seasonScoringLoader(leagueId);
            setCategoryData(mapSeasonCategoryScoring(response));
            setIsLoading(false);
        }
        fetchScoring(league?.LeagueId);
    }, [league]);

    return (
        <Root title={'Season Breakdown'} >
            <TableToolbar title={'Season Breakdown'} />
            {
                isLoading ? (
                    <Skeleton variant="rectangular" height={48} />
                ) : (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <AppBar position="static">
                                <Tabs variant={isMedium ? "scrollable" : "fullWidth"}
                                    scrollButtons
                                    allowScrollButtonsMobile value={value} onChange={handleChange} textColor="inherit" aria-label="category tabs">
                                    {Object.values(categoryData).map((category, index) =>
                                        <Tab key={category.key} label={category.title} {...a11yProps(index)} />
                                    )}
                                </Tabs>
                            </AppBar>
                        </Box>
                        {Object.values(categoryData).map((category, index) => (
                            <CustomTabPanel key={category.key} value={value} index={index}>
                                <PanelToolbar title={category.title} showProjections={false} />
                                <TableContainer component={Paper}>
                                    <Table size="small" sx={{ minWidth: { xs: 250, md: 400 } }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Team</TableCell>
                                                <TableCell align="right">Pts + Bonus</TableCell>
                                                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }} >Bonus</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }} >Top Starter</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {category.teamStatistics.map((teamStatistic) => (
                                                <ExpandableCategoryRow team={team?.TeamId} key={`${category.key}-${teamStatistic.TeamId}`} row={teamStatistic} showGame={false} showProjections={false} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CustomTabPanel>
                        ))}
                    </Box>
                )
            }
        </Root>
    )
}

export default withAuth(Breakdown);