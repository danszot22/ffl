import { Box, Toolbar, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function PageToolbar(props) {
  const { title, subtitle } = props;

  return (
    <Toolbar
      sx={{
        display: { xs: "none", md: "block" },
        pl: 1,
        pr: 1,
        backgroundColor: (theme) =>
          alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          ),
      }}
    >
      <Box
        sx={{
          justifyContent: "center",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%", fontWeight: 700 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="subtitle2" id="tableTitle" component="div">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Toolbar>
  );
}
