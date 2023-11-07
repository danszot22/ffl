import { Box, Toolbar, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';

export default function PageToolbar(props) {
    const { title, subtitle } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 1 },
                pr: { xs: 1, sm: 1 },
                backgroundColor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }}
        >
            <Box sx={{
                justifyContent: 'center',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography
                    sx={{ flex: '1 1 100%', fontWeight: 700, }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
                <Typography
                    sx={{ flex: '1 1 100%', }}
                    variant="subtitle2"
                    id="tableTitle"
                    component="div"
                >
                    {subtitle}
                </Typography>
            </Box>

        </Toolbar>
    );
}