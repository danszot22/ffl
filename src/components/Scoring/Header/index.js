import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import HeaderGame from "./HeaderGame";

function Header({
  weeks,
  week,
  updatedOn,
  teamFantasyGame,
  isLoading,
  showProjections,
  handleOpen,
  handleClick,
}) {
  return (
    <Box
      sx={{
        pt: 1,
        display: "flex",
        flexDirection: { xs: "column", sm: "column", md: "column", lg: "row" },
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonGroup
          sx={{ mt: 1 }}
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Typography p={1}>Week:</Typography>
          {weeks.map((i) => (
            <Button
              key={i}
              variant={week === i + 1 ? "contained" : "outlined"}
              onClick={() => handleClick(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </ButtonGroup>
        <Typography variant="subtitle2" component="span">
          Updated:{" "}
          <Typography variant="caption" component="span">
            {updatedOn}
          </Typography>
        </Typography>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <FormControl fullWidth>
          <InputLabel id="week-select-label">Week</InputLabel>
          <Select
            labelId="week-select-label"
            id="Week"
            value={week ? week : ""}
            label="Week"
            onChange={(event) => handleClick(event.target.value)}
          >
            {weeks.map((i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {teamFantasyGame && !isLoading ? (
          <HeaderGame
            handleOpen={handleOpen}
            game={teamFantasyGame}
            showProjections={showProjections}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default Header;
