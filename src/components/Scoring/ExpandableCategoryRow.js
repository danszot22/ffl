import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { StyledExpandableTableRow } from '../common/styled';
import { useState } from 'react';
import { Box, TableCell, TableRow, Grid, Collapse, Typography, useTheme, useMediaQuery, Modal, Paper } from "@mui/material";
import CategoryPlayerList from './CategoryPlayerList';
import TeamLink from '../common/TeamLink';
import { formatFantasyTeamName, formatPlayerName } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function ExpandableCategoryRow({ category, team, row, showProjections, showGame = true }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'))
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <StyledExpandableTableRow onClick={() => setOpen(!open)} key={row.TeamId} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <TeamLink team={row.Team} variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }} shortName={isBelowMedium} />
                </TableCell>
                <TableCell sx={{ pl: 0, pr: 0, display: (showProjections ? 'table-cell' : 'none') }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                        <Paper
                            sx={{
                                textAlign: 'center',
                                p: 1,
                                mr: { xs: 0, md: 1 },
                                minWidth: 40,
                                color: "#fff",
                                bgcolor: (theme) =>
                                    theme.palette.warning.dark,
                            }}
                        >
                            {row.Starters.filter(player => player.NflGame?.Playing &&
                                ((category.startsWith('Pass') && ["TMQB", "QB"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Rush') && ["RB"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Rec') && ["WR", "TE"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Fg') && ["TMPK", "PK"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('XP') && ["TMPK", "PK"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Tack') && ["S", "CB", "LB", "DE", "DT"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Sack') && ["S", "CB", "LB", "DE", "DT"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('DEF') && ["S", "CB", "LB", "DE", "DT"].includes(player.Player.Position.PositionCode)))).length}
                        </Paper>
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
                            {row.Starters.filter(player => player.NflGame?.NotPlayed &&
                                ((category.startsWith('Pass') && ["TMQB", "QB"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Rush') && ["RB"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Rec') && ["WR", "TE"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('FG') && ["TMPK", "PK"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('XP') && ["TMPK", "PK"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Tack') && ["S", "CB", "LB", "DE", "DT"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('Sack') && ["S", "CB", "LB", "DE", "DT"].includes(player.Player.Position.PositionCode)) ||
                                    (category.startsWith('DeF') && ["S", "CB", "LB", "DE", "DT"].includes(player.Player.Position.PositionCode)))).length}
                        </Paper>
                    </Box>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>
                        {(row.PointTotal + row.BonusTotal).toFixed(1)}
                    </Typography>
                </TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }} ><Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>{row.BonusTotal}</Typography></TableCell>
                <TableCell align="right">
                    <Link variant="inherit" sx={{ fontWeight: (row.TeamId === team ? 600 : 0) }} onClick={() => setOpen(!open)}>
                        <Typography variant="inherit" sx={{ color: theme => theme.palette.mode === 'dark' ? '#90caf9' : '' }}>
                            {row.StatisticalTotal} {showProjections && !isBelowMedium ? `(${row.ProjStatisticalTotal})` : null}
                        </Typography>
                    </Link>
                </TableCell>
                {
                    !isBelowMedium ? <TableCell align="right">{formatPlayerName(row.Starters[0]?.Player.Name, "")}
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell> : null}
            </StyledExpandableTableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    {!isBelowMedium ? <Collapse in={open} timeout="auto" unmountOnExit>
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
                    </Collapse> : null}
                </TableCell>
            </TableRow>
            {isBelowMedium ? <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        overflow: 'scroll',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 1,
                        minHeight: '25%',
                        minWidth: '75%',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <CategoryPlayerList title={`${formatFantasyTeamName(row.Team, true)}'s Starters`} players={row.Starters} showProjections={showProjections} showGame={showGame} />
                        {row.Bench ? <CategoryPlayerList title={`${formatFantasyTeamName(row.Team, true)}'s Bench`} players={row.Bench} showProjections={showProjections} showGame={showGame} /> : null}
                    </Box>
                </Box>
            </Modal> : null}
        </>
    );
}