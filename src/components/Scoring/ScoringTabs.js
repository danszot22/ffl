import { AppBar, Tabs, Tab, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from 'react';
import ScoringSummary from "./ScoringSummary";
import ExpandableCategoryRow from "./ExpandableCategoryRow";
import { useTheme, useMediaQuery } from "@mui/material";
import PanelToolbar from "./PanelToolbar";
import { a11yProps, CustomTabPanel } from "../common/CustomTabPanel";

function ScoringTabs({ team, data, summaryData, week, showProjections }) {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.down('lg'))

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <AppBar position="static">
                    <Tabs variant={isMedium ? "scrollable" : "fullWidth"}
                        scrollButtons
                        allowScrollButtonsMobile value={value} onChange={handleChange} textColor="inherit" aria-label="category tabs">
                        <Tab key={0} label="All" {...a11yProps(0)} />
                        {Object.values(data).map((category, index) =>
                            <Tab key={category.key} label={category.title} {...a11yProps(index + 1)} />
                        )}
                    </Tabs>
                </AppBar>
            </Box>
            <CustomTabPanel key={0} value={value} index={0}>
                <ScoringSummary team={team} summaryData={summaryData} week={week} showProjections={showProjections} />
            </CustomTabPanel>
            {Object.values(data).map((category, index) => (
                <CustomTabPanel key={category.key} value={value} index={index + 1}>
                    <PanelToolbar title={category.title} showProjections={showProjections} />
                    <TableContainer component={Paper}>
                        <Table size="small" sx={{ minWidth: 400 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2}>Team</TableCell>
                                    <TableCell align="right">Points</TableCell>
                                    <TableCell align="right">Bonus</TableCell>
                                    <TableCell align="right">Amount {showProjections ? "(Proj)" : null}</TableCell>
                                    <TableCell align="right">Top Starter</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {category.teamStatistics.map((teamStatistic) => (
                                    <ExpandableCategoryRow team={team} key={`${category.key}-${teamStatistic.TeamId}`} row={teamStatistic} showProjections={showProjections} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CustomTabPanel>
            ))}
        </Box>
    );
}

export default ScoringTabs;