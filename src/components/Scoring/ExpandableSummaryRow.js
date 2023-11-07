import Grid from '@mui/material/Unstable_Grid2';
import { TableRow, TableCell, Collapse, Box, Paper, Typography } from "@mui/material";
import { StyledExpandableTableRow } from '../common/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import SummaryPlayerList from './SummaryPlayerList';
import { useTheme, useMediaQuery, Link } from "@mui/material";

export default function ExpandableSummaryRow({ team, row, topScore, showProjections }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'))
    const [open, setOpen] = useState(false);

    return (
        <>
            <StyledExpandableTableRow onClick={() => setOpen(!open)} key={row.key} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    <Typography variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }}>{row.rank}</Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }}>{row.team.OwnerName}</Typography>
                </TableCell>
                {!isXs ?
                    <TableCell>
                        <Link variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }} to={`/Team/${row.key}`}>{row.team.TeamName}</Link>
                    </TableCell>
                    : null
                }
                {showProjections ? (
                    <TableCell>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid sx={{ mr: 1 }}>
                                <Paper
                                    sx={{
                                        textAlign: 'center',
                                        minWidth: 40,
                                        p: 1,
                                        color: "#fff",
                                        bgcolor: (theme) =>
                                            theme.palette.warning.dark,
                                    }}
                                >
                                    {row.Starters.filter(player => player.NflGame.Playing).length}
                                </Paper>
                            </Grid>
                            <Grid>
                                <Paper
                                    sx={{
                                        textAlign: 'center',
                                        minWidth: 40,
                                        p: 1,
                                        color: "#fff",
                                        bgcolor: (theme) =>
                                            theme.palette.error.dark,
                                    }}
                                >
                                    {row.Starters.filter(player => player.NflGame.NotPlayed).length}
                                </Paper>
                            </Grid>
                        </Grid>
                    </TableCell>
                ) :
                    null
                }
                <TableCell align="right">
                    <Typography variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }}>{(row.total).toFixed(1)} {showProjections ? `(${(row.projectedTotal).toFixed(1)})` : ' '}</Typography></TableCell>
                {
                    !isXs ? <>
                        <TableCell align="right">
                            <Typography variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }}>{(topScore - row.total).toFixed(1)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                    </> : null
                }
            </StyledExpandableTableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={showProjections ? 8 : 6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'background.default',
                                        display: 'grid',
                                        gridTemplateColumns: { md: '1fr 1fr' },
                                        gap: 2,
                                    }}
                                >
                                    <SummaryPlayerList title='Starter' players={row.Starters} showProjections={showProjections} />
                                    <SummaryPlayerList title='Bench' players={row.Bench} showProjections={showProjections} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
