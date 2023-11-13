import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { StyledExpandableTableRow } from '../common/styled';
import { useState } from 'react';
import { Box, TableCell, TableRow, Grid, Collapse, Typography, useTheme, useMediaQuery, Modal } from "@mui/material";
import CategoryPlayerList from './CategoryPlayerList';
import TeamLink from '../common/TeamLink';
import { formatFantasyTeamName, formatPlayerName } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function ExpandableCategoryRow({ team, row, showProjections, showGame = true }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'))
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <StyledExpandableTableRow onClick={() => setOpen(!open)} key={row.TeamId} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    <TeamLink team={row.Team} variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }} shortName={isBelowMedium} />
                </TableCell>
                <TableCell align="right">
                    <Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>
                        {(row.PointTotal + row.BonusTotal).toFixed(1)}
                    </Typography>
                </TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }} ><Typography variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }}>{row.BonusTotal}</Typography></TableCell>
                <TableCell align="right">
                    <Link variant="inherit" sx={{ fontWeight: row.TeamId === team ? 600 : 0 }} onClick={() => setOpen(!open)}>
                        {row.StatisticalTotal} {showProjections && !isBelowMedium ? `(${row.ProjStatisticalTotal})` : null}
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
                    <CategoryPlayerList title={`${formatFantasyTeamName(row.Team, true)}'s starters`} players={row.Starters} showProjections={showProjections} showGame={showGame} />
                    {row.Bench ? <CategoryPlayerList title={`${formatFantasyTeamName(row.Team, true)}'s Bench`} players={row.Bench} showProjections={showProjections} showGame={showGame} /> : null}

                </Box>
            </Modal> : null}
        </>
    );
}