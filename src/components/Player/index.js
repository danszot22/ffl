import Root from "../Root";
import { useParams } from "react-router-dom";
import { playerLoader, nflGamesByTeamLoader, teamPositionPlayerLoader } from "../../api/graphql";
import { playerNewsLoader } from "../../api/espnData";
import { useEffect, useState } from "react";
import PageToolbar from "../common/PageToolbar";
import { mapPlayerDetails, mapTeamPlayerDetails } from "../../utils/parsers";
import { convertDateToLocal } from "../../utils/helpers";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Skeleton } from "@mui/material";
import PlayerStatisticRow from "./PlayerStatisticRow";
import TeamPlayerStatisticRow from "./TeamPlayerStatisticRow";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';

export default function Player() {
    const { id } = useParams();
    const [player, setPlayer] = useState([]);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [playerNews, setPlayerNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {

        const fetchPlayerNews = async () => {
            setIsLoading(true);
            if (player?.Player?.EspnPlayerId && player?.Player?.NflTeam?.ExternalCode)
                setPlayerNews(await playerNewsLoader(2023, player?.Player?.EspnPlayerId, player?.Player?.NflTeam?.ExternalCode));
            setIsLoading(false);
        }
        fetchPlayerNews();
    }, [player]);

    useEffect(() => {
        const fetchPlayer = async (playerId) => {
            const response = await playerLoader(playerId);
            const gamesResponse = response?.NflTeam ? await nflGamesByTeamLoader(response?.NflTeam?.NflTeamId) : [];
            setPlayer(mapPlayerDetails(response, gamesResponse));
            const playersResponse = await teamPositionPlayerLoader(playerId);
            setTeamPlayers(mapTeamPlayerDetails(playersResponse, gamesResponse));
        }
        fetchPlayer(id);
    }, [id]);

    return (
        <Root>
            <PageToolbar title={'Player Details'} />
            <Box
                sx={{
                    p: 1,
                    m: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                }}>
                {player?.Player?.Position?.PositionCode?.startsWith('TM') ?
                    <img
                        alt={player?.Player?.NflTeam?.DisplayCode}
                        height={100}
                        src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${player?.Player?.NflTeam?.DisplayCode}.png&h=150&w=150`}
                        loading="lazy"
                        style={{ borderRadius: '50%' }}
                    /> :
                    player?.Player?.EspnPlayerId ?
                        <img
                            alt="?"
                            height={100}
                            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.Player.EspnPlayerId}.png&h=120&w=120&scale=crop`}
                            loading="lazy"
                            style={{ borderRadius: '50%' }}
                        /> :
                        <img
                            alt="?"
                            height={100}
                            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=120&h=120&scale=crop`}
                            loading="lazy"
                            style={{ borderRadius: '50%' }}
                        />
                }
                <Box
                    sx={{
                        p: 1,
                        m: 1,
                        display: 'flex',
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                    }}>
                    <div>{player?.Player?.Name}</div>
                    <div>{player?.Player?.Position?.PositionCode}</div>
                    <div>{player?.Player?.NflTeam.DisplayName}</div>
                    {isLoading ? <Skeleton sx={{ p: 1 }} variant="rectangular" height={40}>Loading...</Skeleton> :
                        playerNews?.map((playerNewsItem) =>
                            <Box key={playerNewsItem.id}>
                                <Typography sx={{ display: { xs: 'block', sm: 'none' } }}>{playerNewsItem.shortComment}</Typography>
                                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>{playerNewsItem.longComment}</Typography>
                                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>{convertDateToLocal(playerNewsItem.date).toLocaleDateString()} {convertDateToLocal(playerNewsItem.date).toLocaleTimeString()}</Typography>
                            </Box>
                        )}
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table size="small" sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Week
                            </TableCell>
                            <TableCell>
                                Opponent
                            </TableCell>
                            <TableCell>
                                {["QB"].includes(player?.Player?.Position?.PositionCode) ? "PassYds" :
                                    "RB" === player?.Player?.Position?.PositionCode ? "RushYds" :
                                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? "RecYds" :
                                            ["PK"].includes(player?.Player?.Position?.PositionCode) ? "FgYds" :
                                                ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? "Tackles" :
                                                    " "}
                            </TableCell>
                            <TableCell>
                                {["QB"].includes(player?.Player?.Position?.PositionCode) ? "PassTds" :
                                    "RB" === player?.Player?.Position?.PositionCode ? "RushTds" :
                                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? "RecTds" :
                                            ["PK"].includes(player?.Player?.Position?.PositionCode) ? "XPs" :
                                                ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? "Solo" :
                                                    " "}
                            </TableCell>
                            <TableCell>
                                {["QB"].includes(player?.Player?.Position?.PositionCode) ? "PassInts" :
                                    "RB" === player?.Player?.Position?.PositionCode ? "RecYds" :
                                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? "RushYds" :
                                            ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? "Sacks" :
                                                " "}
                            </TableCell>
                            <TableCell>
                                {["QB"].includes(player?.Player?.Position?.PositionCode) ? "RushYds" :
                                    "RB" === player?.Player?.Position?.PositionCode ? "RecTds" :
                                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? "RushTds" :
                                            ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? "DefInts" :
                                                ' '}
                            </TableCell>
                            <TableCell>
                                {["QB"].includes(player?.Player?.Position?.PositionCode) ? "RushTds" :
                                    ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? "DefTds" : ' '}
                            </TableCell>
                            {player?.Player?.Position?.PositionCode === "TMQB" || player?.Player?.Position?.PositionCode === "TMPK" ?
                                <TableCell>{open ? "Hide Players" : "Show Players"}
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen(!open)}
                                    >
                                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                : null
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {player?.Player?.Position?.PositionCode === "TMQB" || player?.Player?.Position?.PositionCode === "TMPK" ?
                            Object.values(teamPlayers).map((teamPlayer) => <TeamPlayerStatisticRow key={teamPlayer.Game.NflGameId} open={open} player={player} game={teamPlayer.Game} teamPlayers={teamPlayer.Players} />) :
                            player?.Statistics?.map((statistic) => <PlayerStatisticRow key={statistic.Game.NflGameId} player={player} statistic={statistic} />)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Root>
    )
}