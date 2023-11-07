import Root from "../Root";
import { Paper, Link } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { leagueWaiverResultsLoader } from "../../api/graphql";
import { useState, useEffect } from "react";
import PageToolbar from "../common/PageToolbar";
import { convertDateToLocal, formatPlayerFullName } from "../../utils/helpers";
import { useSearchParams } from 'react-router-dom';
import withAuth from "../withAuth";

function WaiverResults({ league }) {
    const [waivers, setWaivers] = useState([]);
    const [searchParams] = useSearchParams();
    const [week] = useState(searchParams.has("Week") ? searchParams.get("Week") : 1);

    useEffect(() => {
        const fetchWaivers = async (leagueId) => {
            try {
                const response = await leagueWaiverResultsLoader(leagueId, week);
                response.sort(
                    (a, b) => (a.RequestNumber) - (b.RequestNumber) || (a.TeamWaiverRank) - (b.TeamWaiverRank)
                )
                setWaivers(response);
            } catch (error) {
                console.error(error);
                return;
            }
        }
        fetchWaivers(league?.LeagueId);
    }, [
        league?.LeagueId,
        week,
    ]);

    return (
        <Root>
            <PageToolbar title={'Wavier Results'} />
            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Date
                            </TableCell>
                            <TableCell>
                                Team
                            </TableCell>
                            <TableCell>
                                Claim
                            </TableCell>
                            <TableCell>
                                Result
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {waivers.map((waiver) => (
                            <TableRow>
                                <TableCell>{convertDateToLocal(waiver.ProcessDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    ({waiver.TeamWaiverRank}) {waiver.WaiverRequest.Team?.TeamName} ({waiver.WaiverRequest.Team?.OwnerName})
                                </TableCell>
                                <TableCell>
                                    <Link to={`/Player/${waiver.WaiverRequest.PlayerToAdd.PlayerId}`} >
                                        {formatPlayerFullName(waiver.WaiverRequest.PlayerToAdd.Name, waiver.WaiverRequest.PlayerToAdd.Position.PositionCode)}
                                    </Link>
                                    {` ${waiver.WaiverRequest.PlayerToAdd.Position.PositionCode}`}
                                </TableCell>
                                <TableCell>
                                    {!waiver.TransactionDenialReason ? "Approved. Dropped " : "Unsuccessful. Reason: "}
                                    {!waiver.TransactionDenialReason &&
                                        <Link to={`/Player/${waiver.WaiverRequest.RosterPlayerToDelete.Player.PlayerId}`} >
                                            {formatPlayerFullName(waiver.WaiverRequest.RosterPlayerToDelete.Player.Name, waiver.WaiverRequest.RosterPlayerToDelete.Player.Position.PositionCode)}
                                        </Link>
                                    }
                                    {!waiver.TransactionDenialReason ? ` ${waiver.WaiverRequest.RosterPlayerToDelete.Player.Position.PositionCode}` : " "}
                                    {waiver.TransactionDenialReason === 0 ? "Claim would result in an invalid roster" :
                                        waiver.TransactionDenialReason === 1 ? "Player has already been added to another team" :
                                            waiver.TransactionDenialReason === 2 ? "A player involved has already been dropped" :
                                                waiver.TransactionDenialReason === 3 ? "No Add/Drops remaining" :
                                                    " "}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Root>
    )
}

export default withAuth(WaiverResults);