import { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { teamPrizeLoader } from "../../api/graphql";
import Root from "../Root";
import { formatDollars } from "../../utils/helpers";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";
import TeamLink from "../common/TeamLink";

function TeamPrizes({ league }) {
    const [prizes, setPrizes] = useState([]);

    useEffect(() => {
        const fetchPrizes = async (leagueId) => {
            try {
                const response = await teamPrizeLoader(leagueId);
                setPrizes(response);
            } catch (error) {
                console.error(error);
                return;
            }
        }
        fetchPrizes(league?.LeagueId);
    }, [
        league?.LeagueId,
    ]);

    return (
        <Root title={'Team Prizes'}>
            <PageToolbar title={'Team Prizes'} />
            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Week
                            </TableCell>
                            <TableCell>
                                Team
                            </TableCell>
                            <TableCell>
                                Type
                            </TableCell>
                            <TableCell>
                                Amount
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prizes?.map((prize) => (
                            <TableRow key={`${prize.Week}-${prize.TeamId}`}>
                                <TableCell>{prize.Week}</TableCell>
                                <TableCell>
                                    <TeamLink team={prize.Team} />
                                </TableCell>
                                <TableCell>
                                    {prize.PrizeType === 0 ? "Weekly Winner" :
                                        "Playoff Game Winner"}
                                </TableCell>
                                <TableCell>{formatDollars(prize.PrizeAmount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Root>
    )
}

export default withAuth(TeamPrizes);