import Root from "../Root";
import { Paper } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { leagueWaiverResultsLoader } from "../../api/graphql";
import { useState, useEffect } from "react";
import PageToolbar from "../common/PageToolbar";
import { convertDateToLocal, formatFantasyTeamName } from "../../utils/helpers";
import { useSearchParams } from 'react-router-dom';
import withAuth from "../withAuth";
import PlayerLink from "../common/PlayerLink";

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
                            <TableRow key={waiver.WaiverRequestId}>
                                <TableCell>{convertDateToLocal(waiver.ProcessDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    ({waiver.TeamWaiverRank}) {formatFantasyTeamName(waiver.WaiverRequest.Team)}
                                </TableCell>
                                <TableCell>
                                    <PlayerLink playerId={waiver.WaiverRequest.PlayerToAdd.PlayerId} playerName={waiver.WaiverRequest.PlayerToAdd.Name} positionCode={waiver.WaiverRequest.PlayerToAdd.Position.PositionCode} />
                                    {` ${waiver.WaiverRequest.PlayerToAdd.Position.PositionCode}`}
                                </TableCell>
                                <TableCell>
                                    {!waiver.TransactionDenialReason ? "Approved. Dropped " : "Unsuccessful. Reason: "}
                                    {!waiver.TransactionDenialReason &&
                                        <PlayerLink playerId={waiver.WaiverRequest.RosterPlayerToDelete.Player.PlayerId} playerName={waiver.WaiverRequest.RosterPlayerToDelete.Player.Name} positionCode={waiver.WaiverRequest.RosterPlayerToDelete.Player.Position.PositionCode} />
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