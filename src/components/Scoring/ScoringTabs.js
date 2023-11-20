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
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

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
                        <Table size="small" sx={{ minWidth: { xs: 250, md: 400 } }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Team</TableCell>
                                    <TableCell sx={{ pl: 0, pr: 0, display: (showProjections ? 'table-cell' : 'none') }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                                            {category.title.startsWith('Pass') ? 'QBs' :
                                                category.title.startsWith('Rush') ? 'RBs' :
                                                    category.title.startsWith('Rec') ? 'WR/TE' :
                                                        category.title.startsWith('Fg') ? 'PKs' :
                                                            category.title.startsWith('XP') ? 'PKs' :
                                                                category.title.startsWith('Tack') ? 'Def' :
                                                                    category.title.startsWith('Sack') ? 'Def' :
                                                                        category.title.startsWith('DEF') ? 'Def' : ''}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">Pts + Bonus</TableCell>
                                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }} >Bonus</TableCell>
                                    <TableCell align="right">Amount {showProjections && !isBelowMedium ? "(Proj)" : null}</TableCell>
                                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Top Starter</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {category.teamStatistics.map((teamStatistic) => (
                                    <ExpandableCategoryRow category={category.title} team={team} key={`${category.key}-${teamStatistic.TeamId}`} row={teamStatistic} showProjections={showProjections} />
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