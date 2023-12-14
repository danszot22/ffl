import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  TableFooter,
  Box,
} from "@mui/material";
import { StyledTableRow } from "../common/styled";
import { mapSeasonRecords } from "../../utils/parsers";
import TeamLink from "../common/TeamLink";
import { useEffect, useState } from "react";
import { incompleteWeeksLoader } from "../../api/graphql";

function SeasonRecords({ data, leagueId }) {
  const [isRegularSeasonActive, setIsRegularSeasonActive] = useState(false);
  const leagueRecords = mapSeasonRecords(data);

  useEffect(() => {
    const fetchData = async (leagueId) => {
      setIsRegularSeasonActive(await incompleteWeeksLoader(leagueId));
    };
    fetchData(leagueId);
  }, [leagueId]);

  return (
    <TableContainer component={Paper}>
      {leagueRecords?.map((leagueRecord, index) => (
        <Table key={leagueRecord.key}>
          <TableHead>
            {index === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="inherit" sx={{ pr: 1 }} component="span">
                    Season Records
                  </Typography>
                  <Button
                    sx={{ pl: 1 }}
                    variant="outlined"
                    to="/PlayoffBracket"
                  >
                    {isRegularSeasonActive
                      ? `Playoff Bracket Preview`
                      : `Playoff Bracket`}
                  </Button>
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow sx={{ borderTop: 3 }}>
              <TableCell colSpan={2}>Division {leagueRecord.key}</TableCell>
              <TableCell>W</TableCell>
              <TableCell>L</TableCell>
              <TableCell>T</TableCell>
              <TableCell>DIV</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leagueRecord.records.map((record) => (
              <StyledTableRow key={record.TeamId}>
                <TableCell sx={{ pb: 0, pt: 0, width: 25 }}>
                  <Typography variant="caption">
                    {!isRegularSeasonActive && record.DivisionSeed === 1 ? (
                      <Chip variant="outlined" label="y" />
                    ) : !isRegularSeasonActive && record.PlayoffTeamId ? (
                      <Chip variant="outlined" label="x" />
                    ) : !isRegularSeasonActive ? (
                      <Chip variant="outlined" label="e" />
                    ) : null}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: { xs: 150, md: 350 } }}>
                  <TeamLink team={record} />
                </TableCell>
                <TableCell>{record.Wins}</TableCell>
                <TableCell>{record.Losses}</TableCell>
                <TableCell>{record.Ties}</TableCell>
                <TableCell>
                  {record.DivisionWins}-{record.DivisionLosses}-
                  {record.DivisionTies}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            {index === leagueRecords.length - 1 && !isRegularSeasonActive ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Typography component="span">y-Division Winner </Typography>
                    <Typography component="span">x-Playoff Team </Typography>
                    <Typography component="span">e-Eliminated</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : null}
          </TableFooter>
        </Table>
      ))}
    </TableContainer>
  );
}

export default SeasonRecords;
