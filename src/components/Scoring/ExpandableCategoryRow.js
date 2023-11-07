import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { StyledExpandableTableRow } from '../common/styled';
import { useState } from 'react';
import { Box, TableCell, TableRow, Grid, Collapse, Link, Typography } from "@mui/material";
import CategoryPlayerList from './CategoryPlayerList';

export default function ExpandableCategoryRow({ team, row, showProjections, showGame = true }) {

    const [open, setOpen] = useState(false);

    return (
        <>
            <StyledExpandableTableRow key={row.TeamId} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    <Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>{row.Team.OwnerName}</Typography>
                </TableCell>
                <TableCell><Link variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }} to={`/Team/${row.TeamId}`}>{row.Team.TeamName}</Link></TableCell>
                <TableCell align="right"><Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>{row.PointTotal.toFixed(1)}</Typography></TableCell>
                <TableCell align="right"><Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>{row.BonusTotal}</Typography></TableCell>
                <TableCell align="right"><Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>{row.StatisticalTotal} {showProjections ? `(${row.ProjStatisticalTotal})` : null}</Typography></TableCell>
                <TableCell align="right">{row.Starters[0]?.Player.Name}
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </StyledExpandableTableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                                    <CategoryPlayerList title="Starter" players={row.Starters} showProjections={showProjections} showGame={showGame} />
                                    {row.Bench ? <CategoryPlayerList title="Bench" players={row.Bench} showProjections={showProjections} showGame={showGame} /> : null}
                                </Box>
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}