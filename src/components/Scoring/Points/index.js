import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Accordion,
  AccordionDetails,
  Typography,
  styled,
} from "@mui/material";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { a11yProps, CustomTabPanel } from "../../common/CustomTabPanel";
import PointsToolbar from "./PointsToolbar";
import WeekPoints from "../Totals/WeekPoints";
import CategoryPoints from "../Category/CategoryPoints";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import PlayerList from "../Totals/PlayerList";

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));
function Points({ userTeamId, data, summaryData, week, showProjections }) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isBelowLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [expanded, setExpanded] = useState(0);

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return isBelowMedium ? (
    <>
      <Accordion TransitionProps={{ unmountOnExit: true }} expanded={true}>
        <AccordionDetails sx={{ p: 0 }}>
          <WeekPoints
            userTeamId={userTeamId}
            summaryData={summaryData}
            showProjections={showProjections}
          />
        </AccordionDetails>
      </Accordion>
      {Object.values(data).map((category, index) => (
        <Accordion
          TransitionProps={{ unmountOnExit: true }}
          expanded={expanded === index + 1}
          onChange={handleAccordionChange(index + 1)}
        >
          <AccordionSummary>
            <Typography id="tableTitle" component="span">
              {category.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <CategoryPoints
              category={category}
              summaryData={summaryData}
              userTeamId={userTeamId}
              showProjections={showProjections}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  ) : (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <AppBar position="static">
          <Tabs
            variant={isBelowLarge ? "scrollable" : "fullWidth"}
            scrollButtons
            allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="category tabs"
          >
            <Tab key={0} label="All" {...a11yProps(0)} />
            {Object.values(data).map((category, index) => (
              <Tab
                key={category.key}
                label={category.title}
                {...a11yProps(index + 1)}
              />
            ))}
          </Tabs>
        </AppBar>
      </Box>
      <CustomTabPanel key={0} value={value} index={0}>
        <PointsToolbar
          title={`Week ${week}`}
          showProjections={showProjections}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            p: 1,
            gap: 2,
          }}
        >
          <WeekPoints
            userTeamId={userTeamId}
            summaryData={summaryData}
            showProjections={showProjections}
          />
          <PlayerList
            title={"Starters"}
            players={
              summaryData?.find((row) => row.key === userTeamId)?.Starters
            }
            showProjections={showProjections}
            variant="inherit"
          />
        </Box>
      </CustomTabPanel>
      {Object.values(data).map((category, index) => (
        <CustomTabPanel key={category.key} value={value} index={index + 1}>
          <PointsToolbar
            title={category.title}
            showProjections={showProjections}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              p: 1,
            }}
          >
            <CategoryPoints
              category={category}
              summaryData={summaryData}
              userTeamId={userTeamId}
              showProjections={showProjections}
            />
          </Box>
        </CustomTabPanel>
      ))}
    </Box>
  );
}

export default Points;
