import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Grid } from "@mui/material";
import { mapScoring } from "../../utils/parsers";
import ExpandableSummaryRow from "./ExpandableSummaryRow";
import PanelToolbar from "./PanelToolbar";
import { useTheme, useMediaQuery } from "@mui/material";

function ScoringSummary({ team, summaryData, week, showProjections }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'))

    return (
        <>
            <PanelToolbar title={`Week ${week}`} showProjections={showProjections} />
            <TableContainer component={Paper}>
                <Table size="small" aria-label="Scoring Summary table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell colSpan={showProjections && !isXs ? 2 : 1}>Team</TableCell>
                            <TableCell>
                                {showProjections ?
                                    (<>
                                        <Grid container justifyContent="center" alignItems="center">
                                            <Grid sx={{ mr: 1 }}>
                                                <Paper
                                                    sx={{
                                                        p: 1,
                                                        color: "#fff",
                                                        bgcolor: (theme) =>
                                                            theme.palette.warning.dark,
                                                    }}
                                                >
                                                    Playing
                                                </Paper>
                                            </Grid>
                                            <Grid>
                                                <Paper
                                                    sx={{
                                                        p: 1,
                                                        color: "#fff",
                                                        bgcolor: (theme) =>
                                                            theme.palette.error.dark,
                                                    }}
                                                >
                                                    Not Played
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </>
                                    ) : null}</TableCell>
                            <TableCell align="right">Points {showProjections ? "(Proj)" : null}</TableCell>
                            {
                                !isXs ? <>
                                    <TableCell align="right">Back</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </> : null
                            }

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mapScoring(summaryData).map((row) => (
                            <ExpandableSummaryRow team={team} key={`${row.key}`} row={row} topScore={summaryData[0].total} showProjections={showProjections} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ScoringSummary;