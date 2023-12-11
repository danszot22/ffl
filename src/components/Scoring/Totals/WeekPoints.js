import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { mapScoring } from "../../../utils/parsers";
import TeamPoints from "./TeamPoints";
import { useTheme, useMediaQuery } from "@mui/material";

function WeekPoints({ userTeamId, summaryData, showProjections }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <TableContainer sx={{ maxWidth: 600 }} component={Paper}>
      <Table size="small" aria-label="Scoring Summary table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Team</TableCell>
            <TableCell
              sx={{ display: showProjections ? "table-cell" : "none" }}
            ></TableCell>
            <TableCell align="right">
              Points {showProjections ? "(Proj)" : null}
            </TableCell>
            {!isXs ? (
              <>
                <TableCell align="right">Back</TableCell>
              </>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {mapScoring(summaryData).map((row) => (
            <TeamPoints
              userTeamId={userTeamId}
              key={`${row.key}`}
              row={row}
              topScore={summaryData[0].total}
              showProjections={showProjections}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WeekPoints;
