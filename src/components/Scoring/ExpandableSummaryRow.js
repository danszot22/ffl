import Grid from '@mui/material/Unstable_Grid2';
import { TableRow, TableCell, Collapse, Box, Typography, Modal, Paper, Link } from "@mui/material";
import { StyledExpandableTableRow } from '../common/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import SummaryPlayerList from './SummaryPlayerList';
import { useTheme, useMediaQuery } from "@mui/material";
import TeamLink from '../common/TeamLink';
import { formatFantasyTeamName } from '../../utils/helpers';

export default function ExpandableSummaryRow({ team, row, topScore, showProjections }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'))
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'))
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <StyledExpandableTableRow onClick={() => setOpen(!open)} key={row.key} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{ pr: 0 }} component="th" scope="row">
                    <Typography variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }}>{row.rank}</Typography>
                </TableCell>
                <TableCell sx={{ pl: 0, pr: 0 }}>
                    <TeamLink team={row.team} variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }} shortName={isBelowMedium} />
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
                            {row.Starters.filter(player => player.NflGame.Playing).length}
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
                            {row.Starters.filter(player => player.NflGame.NotPlayed).length}
                        </Paper>
                    </Box>
                </TableCell>
                <TableCell align="right">
                    <Link variant="inherit" sx={{ fontWeight: row.key === team ? 600 : 0 }} onClick={() => setOpen(!open)}>
                        {(row.total).toFixed(1)} {showProjections ? `(${(row.projectedTotal).toFixed(1)})` : ' '}
                    </Link>
                </TableCell>
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
                    {!isXs ? <Collapse in={open} timeout="auto" unmountOnExit>
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
                    </Collapse> : null}
                </TableCell>
            </TableRow>
            {isXs ? <Modal
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
                        minWidth: '95%',
                    }}
                >
                    <SummaryPlayerList title={`${formatFantasyTeamName(row.team, true)}'s starters`} players={row.Starters} showProjections={showProjections} />
                </Box>
            </Modal> : null}
        </>
    );
}
