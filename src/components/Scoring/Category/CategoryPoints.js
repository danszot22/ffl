import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TeamPoints from "./TeamPoints";

function CategoryPoints({ category, showProjections, team, summaryData }) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        sx={{ minWidth: { xs: 250, md: 400 } }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell
              sx={{
                pl: 0,
                pr: 0,
                display: showProjections ? "table-cell" : "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {category.title.startsWith("Pass")
                  ? "QBs"
                  : category.title.startsWith("Rush")
                  ? "RBs"
                  : category.title.startsWith("Rec")
                  ? "WR/TE"
                  : category.title.startsWith("Fg")
                  ? "PKs"
                  : category.title.startsWith("XP")
                  ? "PKs"
                  : category.title.startsWith("Tack")
                  ? "Def"
                  : category.title.startsWith("Sack")
                  ? "Def"
                  : category.title.startsWith("DEF")
                  ? "Def"
                  : ""}
              </Box>
            </TableCell>
            <TableCell align="right">Pts + Bonus</TableCell>
            <TableCell
              align="right"
              sx={{ display: { xs: "none", md: "table-cell" } }}
            >
              Bonus
            </TableCell>
            <TableCell align="right">
              Amount {showProjections && !isBelowMedium ? "(Proj)" : null}
            </TableCell>
            <TableCell align="right">Top Starters</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {category.teamStatistics.map((teamStatistic) => (
            <TeamPoints
              category={category.title}
              team={team}
              key={`${category.key}-${teamStatistic.TeamId}`}
              row={teamStatistic}
              showProjections={showProjections}
              lineup={summaryData?.find(
                (data) => data.key === teamStatistic.TeamId
              )}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CategoryPoints;
