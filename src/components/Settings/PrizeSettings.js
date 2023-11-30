import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableRow } from "../common/styled";
import { formatDollars, formatPercent } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

export default function PrizeSettings({ leagueId, prizes, isEditable }) {
  const navigate = useNavigate();

  function handleGoToPrizeSettings() {
    navigate(`/PrizeSettings/Edit`, { state: { leagueId, prizes } });
  }

  return (
    <TableContainer component={Paper} sx={{ border: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Prizes</TableCell>
            <TableCell>
              {isEditable ? (
                <Button variant="outlined" onClick={handleGoToPrizeSettings}>
                  Edit
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <TableCell>First Prize</TableCell>
            <TableCell>{formatDollars(prizes.FirstPrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Second Prize</TableCell>
            <TableCell>{formatDollars(prizes.SecondPrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Third Prize</TableCell>
            <TableCell>{formatDollars(prizes.ThirdPrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Weekly Prize</TableCell>
            <TableCell>{formatDollars(prizes.WeeklyPrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Playoff Game Prize</TableCell>
            <TableCell>{formatDollars(prizes.PlayoffGamePrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Fantasy Bowl Prize</TableCell>
            <TableCell>{formatDollars(prizes.FantasyBowlPrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>First Prize From Fees</TableCell>
            <TableCell>{formatPercent(prizes.FirstFeePrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Second Prize From Fees</TableCell>
            <TableCell>{formatPercent(prizes.SecondFeePrize)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Third Prize From Fees</TableCell>
            <TableCell>{formatPercent(prizes.ThirdFeePrize)}</TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
