import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableRow } from "../common/styled";
import { useNavigate } from "react-router-dom";
import { siteScheduleLoader } from "../../api/graphql";
import { useEffect, useState } from "react";
import { formatDollars } from "../../utils/helpers";

export default function GeneralSettings({ leagueId, settings, isEditable }) {
  const [playoffSchedule, setPlayoffSchedule] = useState({});
  const [regularSchedule, setRegularSchedule] = useState({});
  const [keeperDrop, setKeeperDrop] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await siteScheduleLoader();
      setPlayoffSchedule(
        response.find((s) => s.ScheduleId === settings?.PlayoffScheduleId)
      );
      setRegularSchedule(
        response.find((s) => s.ScheduleId === settings?.ScheduleId)
      );
    };
    setKeeperDrop(settings && settings?.AllowDropEligibleKeeper ? true : false);
    fetchSchedule();
  }, [settings]);

  function handleGoToGeneralSettings() {
    navigate(`/GeneralSettings/Edit`, { state: { leagueId, settings } });
  }

  return (
    <TableContainer component={Paper} sx={{ border: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>General Settings</TableCell>
            <TableCell>
              {isEditable ? (
                <Button variant="outlined" onClick={handleGoToGeneralSettings}>
                  Edit
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <TableCell>League Name</TableCell>
            <TableCell>{settings?.LeagueName}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell># of Teams</TableCell>
            <TableCell>
              {settings?.NumberOfTeams}
              {isEditable ? (
                <Button sx={{ ml: 2 }} to="/League/Size">
                  Change
                </Button>
              ) : null}
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Schedule</TableCell>
            <TableCell>{regularSchedule?.Description}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Playoff Schedule</TableCell>
            <TableCell>{playoffSchedule?.Description}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Lineup Deadlines</TableCell>
            <TableCell>
              {settings?.LineupDeadline === 0
                ? "First Game of Every Week"
                : settings?.LineupDeadline === 1
                ? "Sunday 1:00 PM (except Thursday and Saturday Games)"
                : " Game Time of Each Player"}
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Waiver Period</TableCell>
            <TableCell>
              {settings?.WaiversFromWeek === 0
                ? `Season Start`
                : settings?.WaiversFromWeek === 18
                ? `Season End`
                : `First Game Week ${settings?.WaiversFromWeek}`}
              {` to `}
              {settings?.WaiversToWeek === 0
                ? `Season Start`
                : settings?.WaiversToWeek === 18
                ? `Season End`
                : `First Game Week ${settings?.WaiversToWeek}`}
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Waivers Run</TableCell>
            <TableCell>
              {settings?.WaiverProcessDay === 2
                ? "Tuesday"
                : settings?.WaiverProcessDay === 3
                ? "Wednesday"
                : "Thursday"}
              {" @ "}
              {settings?.WaiverProcessTime}
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Umlimited Period</TableCell>
            <TableCell>
              {settings?.UnlimitedAddDropsFromWeek === 0
                ? `Season Start`
                : settings?.UnlimitedAddDropsFromWeek === 18
                ? `Season End`
                : `Week ${settings?.UnlimitedAddDropsFromWeek}`}
              {` to `}
              {settings?.UnlimitedAddDropsToWeek === 0
                ? `Season Start`
                : settings?.UnlimitedAddDropsToWeek === 18
                ? `Season End`
                : `Week ${settings?.UnlimitedAddDropsToWeek}`}
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Auto Approve Trades</TableCell>
            <TableCell>{settings?.AutoApproveTradesInDays} days</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Trade Lead Time</TableCell>
            <TableCell>
              {settings?.TradeCompletionLeadTimeInHours} hours
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Trades Expire In</TableCell>
            <TableCell>{settings?.TradesExpireInDays} days</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Add/Drop Fee</TableCell>
            <TableCell>{formatDollars(settings?.AddDropFee)}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Fee Period</TableCell>
            <TableCell>
              {settings?.AddDropFeeFromWeek === 0
                ? `Season Start`
                : settings?.AddDropFeeFromWeek === 18
                ? `Season End`
                : `Week ${settings?.AddDropFeeFromWeek}`}
              {` to `}
              {settings?.AddDropFeeToWeek === 0
                ? `Season Start`
                : settings?.AddDropFeeToWeek === 18
                ? `Season End`
                : `Week ${settings?.AddDropFeeToWeek}`}
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Keeper</TableCell>
            <TableCell>
              Round {settings?.KeeperRound}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="allowKeeperDrop"
                      checked={keeperDrop}
                      disabled
                    />
                  }
                  label="Allow Keepers Drop"
                />
              </FormGroup>
            </TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
