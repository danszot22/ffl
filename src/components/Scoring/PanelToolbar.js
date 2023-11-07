import { Toolbar, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';

export default function PanelToolbar({ title }) {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                id="tableTitle"
                component="div"
            >
                {title}
            </Typography>

        </Toolbar>
    )
}