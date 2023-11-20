import { Box, Paper, Toolbar, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';

export default function PanelToolbar({ title, showProjections }) {

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }}
        >
            <div style={{ width: '100%' }}>
                <Box component="span" sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                        id="tableTitle"
                        component="span"
                    >
                        {title}
                    </Typography>
                    {showProjections ?
                        <Box component="span" sx={{ gap: 1, display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
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
                                Playing
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
                                Not Playing
                            </Paper>
                        </Box>
                        :
                        null}
                </Box>
            </div>
        </Toolbar>
    )
}